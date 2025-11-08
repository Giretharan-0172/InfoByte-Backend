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

    /**
     * Get personalized feed based on user interests
     * Sorted by newest first
     */
    public Page<Article> getPersonalizedFeed(List<String> userInterests, Pageable pageable) {
        // Add sorting by creation date (newest first)
        Pageable sortedPageable = PageRequest.of(
            pageable.getPageNumber(),
            pageable.getPageSize(),
            Sort.by(Sort.Direction.DESC, "createdAt")
        );
        return articleRepository.findByCategoryIn(userInterests, sortedPageable);
    }

    /**
     * Get trending articles (most engaging)
     * For "Explore" or "Trending" tab
     */
    public Page<Article> getTrendingArticles(Pageable pageable) {
        // Sort by engagement score (highest first)
        Pageable sortedPageable = PageRequest.of(
            pageable.getPageNumber(),
            pageable.getPageSize(),
            Sort.by(Sort.Direction.DESC, "stats.engagementScore")
        );
        return articleRepository.findAll(sortedPageable);
    }

    /**
     * Get most popular articles (most liked)
     */
    public Page<Article> getPopularArticles(Pageable pageable) {
        Pageable sortedPageable = PageRequest.of(
            pageable.getPageNumber(),
            pageable.getPageSize(),
            Sort.by(Sort.Direction.DESC, "stats.likeCount")
        );
        return articleRepository.findAll(sortedPageable);
    }

    /**
     * Get latest articles (all categories)
     */
    public Page<Article> getLatestArticles(Pageable pageable) {
        Pageable sortedPageable = PageRequest.of(
            pageable.getPageNumber(),
            pageable.getPageSize(),
            Sort.by(Sort.Direction.DESC, "createdAt")
        );
        return articleRepository.findAll(sortedPageable);
    }

    /**
     * Get feed by specific category
     */
    public Page<Article> getFeedByCategory(String category, Pageable pageable) {
        Pageable sortedPageable = PageRequest.of(
            pageable.getPageNumber(),
            pageable.getPageSize(),
            Sort.by(Sort.Direction.DESC, "createdAt")
        );
        return articleRepository.findByCategoryIn(List.of(category), sortedPageable);
    }

    /**
     * Get single article by ID
     */
    public Article getArticleById(String articleId) {
        return articleRepository.findById(articleId)
            .orElseThrow(() -> new RuntimeException("Article not found"));
    }
}