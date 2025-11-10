package com.example.InfoByte.controller;

import com.example.InfoByte.repository.ArticleRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final ArticleRepository articleRepository;

    public CategoryController(ArticleRepository articleRepository) {
        this.articleRepository = articleRepository;
    }

    /**
     * Get all distinct categories that have articles
     * GET /api/categories
     */
    @GetMapping
    public ResponseEntity<?> getAvailableCategories() {
        try {
            // Get all distinct categories from articles
            List<String> categories = articleRepository.findAll()
                .stream()
                .map(article -> article.getCategory())
                .distinct()
                .filter(category -> category != null && !category.isEmpty())
                .sorted()
                .toList();

            return ResponseEntity.ok(Map.of(
                "message", "Categories retrieved successfully",
                "categories", categories,
                "count", categories.size()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", e.getMessage()
            ));
        }
    }

    /**
     * Get category statistics
     * GET /api/categories/stats
     */
    @GetMapping("/stats")
    public ResponseEntity<?> getCategoryStats() {
        try {
            var articles = articleRepository.findAll();
            
            // Count articles per category
            var categoryStats = articles.stream()
                .filter(article -> article.getCategory() != null)
                .collect(java.util.stream.Collectors.groupingBy(
                    article -> article.getCategory(),
                    java.util.stream.Collectors.counting()
                ));

            return ResponseEntity.ok(Map.of(
                "message", "Category statistics retrieved",
                "stats", categoryStats,
                "totalArticles", articles.size()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", e.getMessage()
            ));
        }
    }
}