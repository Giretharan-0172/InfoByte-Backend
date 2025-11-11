package com.example.InfoByte.service;

import com.example.InfoByte.config.AppConstants;
import com.example.InfoByte.model.ApiArticle;
import com.example.InfoByte.model.Article;
import com.example.InfoByte.model.NewsApiResponse;
import com.example.InfoByte.repository.ArticleRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
public class ContentAggregationService {

    private final RestTemplate restTemplate;
    private final ArticleProcessingService articleProcessingService;
    private final ArticleRepository articleRepository;

    @Value("${newsapi.key}")
    private String apiKey;

    private static final String NEWS_API_BASE_URL = "https://newsapi.org/v2/top-headlines?country=us&pageSize=20&apiKey=";

    public ContentAggregationService(RestTemplate restTemplate, 
                                     ArticleProcessingService articleProcessingService,
                                     ArticleRepository articleRepository) {
        this.restTemplate = restTemplate;
        this.articleProcessingService = articleProcessingService;
        this.articleRepository = articleRepository;
    }

    // ✅ PRODUCER: MANUAL TRIGGER
    // Fetches ~17 articles per category * 6 categories ≈ 102 articles total
    public void fetchNewsFromApiManual() {
        System.out.println(">>> Triggering Manual News Fetch...");
        
        // We want ~100 total. There are 6 categories. 100/6 = ~17 per category.
        int limitPerCategory = 17; 

        for (var entry : AppConstants.NEWSAPI_CATEGORY_MAP.entrySet()) {
            String internalCategoryName = entry.getKey();
            String newsApiQueryName = entry.getValue();
            
            try {
                fetchRawCategory(internalCategoryName, newsApiQueryName, limitPerCategory);
            } catch (Exception e) {
                System.err.println("Fetch failed for " + internalCategoryName);
            }
        }
        System.out.println(">>> Fetch Complete. Articles are waiting in DB for processing.");
    }

    private void fetchRawCategory(String category, String apiQuery, int limit) {
        String url = NEWS_API_BASE_URL + apiKey + "&category=" + apiQuery;
        NewsApiResponse response = restTemplate.getForObject(url, NewsApiResponse.class);

        if (response != null && response.getArticles() != null) {
            int count = 0;
            for (ApiArticle apiArticle : response.getArticles()) {
                if (count >= limit) break;

                // Skip duplicates
                if (apiArticle.getUrl() != null && articleRepository.existsBySourceUrl(apiArticle.getUrl())) {
                    continue;
                }

                if (apiArticle.getTitle() != null && apiArticle.getUrl() != null) {
                    String content = (apiArticle.getDescription() != null) ? apiArticle.getDescription() : apiArticle.getTitle();
                    
                    // Save Raw (Processed = False)
                    articleProcessingService.saveRawArticle(
                        apiArticle.getTitle(),
                        content,
                        apiArticle.getUrl(),
                        category,
                        apiArticle.getUrlToImage()
                    );
                    count++;
                }
            }
            System.out.println("Saved " + count + " raw articles for " + category);
        }
    }

    // ✅ CONSUMER: SCHEDULED PROCESSOR
    // Runs every 1 minute. Processes exactly 15 articles (Gemini Limit).
    @Scheduled(fixedRate = 60000)
    public void processPendingArticles() {
        // 1. Find 15 articles that haven't been summarized yet
        List<Article> pendingArticles = articleRepository.findTop15ByProcessedFalse();

        if (pendingArticles.isEmpty()) {
            // Silent return if nothing to do
            return; 
        }

        System.out.println(">>> Scheduled Processor: Found " + pendingArticles.size() + " articles to process.");

        // 2. Process them (Summarize + Embed)
        for (Article article : pendingArticles) {
            articleProcessingService.processExistingArticle(article);
        }
        
        System.out.println(">>> Batch complete. " + articleRepository.countByProcessedFalse() + " remaining in queue.");
    }
}