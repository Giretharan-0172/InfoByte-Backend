package com.example.InfoByte.service;
import com.example.InfoByte.config.AppConstants;
import com.example.InfoByte.model.ApiArticle;
import com.example.InfoByte.model.NewsApiResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class ContentAggregationService {

    private final RestTemplate restTemplate;
    private final ArticleProcessingService articleProcessingService;

    @Value("${newsapi.key}")
    private String apiKey;

    private static final String NEWS_API_BASE_URL = "https://newsapi.org/v2/top-headlines?country=us&apiKey=";

    public ContentAggregationService(RestTemplate restTemplate, ArticleProcessingService articleProcessingService) {
        this.restTemplate = restTemplate;
        this.articleProcessingService = articleProcessingService;
    }

    public void fetchAndProcessAllNews() {
        System.out.println("Starting news aggregation for all categories...");
        for (var entry : AppConstants.NEWSAPI_CATEGORY_MAP.entrySet()) {
            String internalCategoryName = entry.getKey();
            String newsApiQueryName = entry.getValue();
            System.out.println("Fetching news for category: " + internalCategoryName);
            try {
                fetchNewsForCategory(internalCategoryName, newsApiQueryName);
            } catch (Exception e) {
                System.err.println("Failed to fetch news for category: " + internalCategoryName + " - " + e.getMessage());
            }
        }
        System.out.println("News aggregation finished.");
    }

    private void fetchNewsForCategory(String internalCategoryName, String apiQueryName) {
        String url = NEWS_API_BASE_URL + apiKey + "&category=" + apiQueryName;
        NewsApiResponse response = restTemplate.getForObject(url, NewsApiResponse.class);
        if (response != null && response.getArticles() != null) {
            System.out.println("Fetched " + response.getArticles().size() + " articles for " + internalCategoryName);
            for (ApiArticle apiArticle : response.getArticles()) {
                if (apiArticle.getTitle() != null && (apiArticle.getDescription() != null || apiArticle.getContent() != null)) {
                    String content = (apiArticle.getDescription() != null) ? apiArticle.getDescription() : apiArticle.getContent();
                    try {
                        articleProcessingService.processAndSaveArticle(
                                apiArticle.getTitle(),
                                content,
                                apiArticle.getUrl(),
                                internalCategoryName
                        );
                    } catch (Exception e) {
                        System.err.println("Failed to process article: " + apiArticle.getTitle() + " - " + e.getMessage());
                    }
                }
            }
        }
    }
}