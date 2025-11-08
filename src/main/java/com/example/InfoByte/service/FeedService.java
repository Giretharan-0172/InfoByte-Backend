package com.example.InfoByte.service;

import com.example.InfoByte.model.Article;
import com.example.InfoByte.repository.ArticleRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class FeedService {

    private final ArticleRepository articleRepository;

    public FeedService(ArticleRepository articleRepository) {
        this.articleRepository = articleRepository;
    }

    public Page<Article> getPersonalizedFeed(List<String> userInterests, Pageable pageable) {
        return articleRepository.findByCategoryIn(userInterests, pageable);
    }

    public Page<Article> getFeedByCategory(String category, Pageable pageable) {
        return articleRepository.findByCategoryIn(List.of(category), pageable);
    }

    public Article getArticleById(String articleId) {
        return articleRepository.findById(articleId)
            .orElseThrow(() -> new RuntimeException("Article not found"));
    }
}