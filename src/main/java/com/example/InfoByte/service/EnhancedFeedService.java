package com.example.InfoByte.service;

import com.example.InfoByte.model.Article;
import com.example.InfoByte.repository.ArticleRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class EnhancedFeedService {

    private final ArticleRepository articleRepository;

    public EnhancedFeedService(ArticleRepository articleRepository) {
        this.articleRepository = articleRepository;
    }

    public Page<Article> getPersonalizedFeed(List<String> userInterests, Pageable pageable) {
        Pageable sortedPageable = PageRequest.of(
            pageable.getPageNumber(),
            pageable.getPageSize(),
            Sort.by(Sort.Direction.DESC, "createdAt")
        );
        return articleRepository.findByCategoryIn(userInterests, sortedPageable);
    }
    
    public Page<Article> getPersonalizedTrendingFeed(List<String> userInterests, Pageable pageable) {
        Pageable sortedPageable = PageRequest.of(
            pageable.getPageNumber(),
            pageable.getPageSize(),
            Sort.by(Sort.Direction.DESC, "stats.engagementScore")
        );
        return articleRepository.findByCategoryIn(userInterests, sortedPageable);
    }

    public Page<Article> getTrendingArticles(Pageable pageable) {
        Pageable sortedPageable = PageRequest.of(
            pageable.getPageNumber(),
            pageable.getPageSize(),
            Sort.by(Sort.Direction.DESC, "stats.engagementScore")
        );
        return articleRepository.findAll(sortedPageable);
    }

    public Page<Article> getPopularArticles(Pageable pageable) {
        Pageable sortedPageable = PageRequest.of(
            pageable.getPageNumber(),
            pageable.getPageSize(),
            Sort.by(Sort.Direction.DESC, "stats.likeCount")
        );
        return articleRepository.findAll(sortedPageable);
    }

    public Page<Article> getLatestArticles(Pageable pageable) {
        Pageable sortedPageable = PageRequest.of(
            pageable.getPageNumber(),
            pageable.getPageSize(),
            Sort.by(Sort.Direction.DESC, "createdAt")
        );
        return articleRepository.findAll(sortedPageable);
    }

    public Page<Article> getFeedByCategory(String category, Pageable pageable) {
        Pageable sortedPageable = PageRequest.of(
            pageable.getPageNumber(),
            pageable.getPageSize(),
            Sort.by(Sort.Direction.DESC, "createdAt")
        );
        return articleRepository.findByCategoryIn(List.of(category), sortedPageable);
    }

    public Article getArticleById(String articleId) {
        return articleRepository.findById(articleId)
            .orElseThrow(() -> new RuntimeException("Article not found"));
    }
    
    // ✅ FIX: Use the new repository method
    public Page<Article> searchArticles(String query, Pageable pageable) {
        return articleRepository.findByTitleContainingIgnoreCaseOrSummaryContainingIgnoreCase(query, query, pageable);
    }
}