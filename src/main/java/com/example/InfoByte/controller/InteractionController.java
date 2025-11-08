package com.example.InfoByte.controller;

import com.example.InfoByte.dto.InteractionRequest;
import com.example.InfoByte.model.Article;
import com.example.InfoByte.model.UserInteraction;
import com.example.InfoByte.service.InteractionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/interactions")
public class InteractionController {

    private final InteractionService interactionService;

    public InteractionController(InteractionService interactionService) {
        this.interactionService = interactionService;
    }

    /**
     * Like/Unlike an article
     * POST /api/interactions/like
     */
    @PostMapping("/like")
    public ResponseEntity<?> toggleLike(@RequestBody InteractionRequest request) {
        try {
            UserInteraction interaction = interactionService.toggleLike(
                request.getUserId(), 
                request.getArticleId()
            );
            return ResponseEntity.ok(Map.of(
                "message", interaction.isLiked() ? "Article liked" : "Article unliked",
                "liked", interaction.isLiked(),
                "interaction", interaction
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Bookmark/Unbookmark an article
     * POST /api/interactions/bookmark
     */
    @PostMapping("/bookmark")
    public ResponseEntity<?> toggleBookmark(@RequestBody InteractionRequest request) {
        try {
            UserInteraction interaction = interactionService.toggleBookmark(
                request.getUserId(), 
                request.getArticleId()
            );
            return ResponseEntity.ok(Map.of(
                "message", interaction.isBookmarked() ? "Article bookmarked" : "Bookmark removed",
                "bookmarked", interaction.isBookmarked(),
                "interaction", interaction
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Share an article
     * POST /api/interactions/share
     */
    @PostMapping("/share")
    public ResponseEntity<?> shareArticle(@RequestBody InteractionRequest request) {
        try {
            UserInteraction interaction = interactionService.recordShare(
                request.getUserId(), 
                request.getArticleId()
            );
            return ResponseEntity.ok(Map.of(
                "message", "Article shared successfully",
                "shared", true,
                "interaction", interaction
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Record article view/read
     * POST /api/interactions/view
     */
    @PostMapping("/view")
    public ResponseEntity<?> recordView(@RequestBody InteractionRequest request) {
        try {
            int readTime = request.getReadTimeSeconds() != null ? request.getReadTimeSeconds() : 0;
            UserInteraction interaction = interactionService.recordView(
                request.getUserId(), 
                request.getArticleId(),
                readTime
            );
            return ResponseEntity.ok(Map.of(
                "message", "View recorded",
                "interaction", interaction
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Get user's interaction status for a specific article
     * GET /api/interactions/{userId}/{articleId}
     */
    @GetMapping("/{userId}/{articleId}")
    public ResponseEntity<?> getUserInteraction(
            @PathVariable String userId,
            @PathVariable String articleId) {
        try {
            UserInteraction interaction = interactionService.getUserInteraction(userId, articleId);
            return ResponseEntity.ok(interaction);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Get user's liked articles
     * GET /api/interactions/{userId}/liked
     */
    @GetMapping("/{userId}/liked")
    public ResponseEntity<?> getLikedArticles(@PathVariable String userId) {
        try {
            List<Article> articles = interactionService.getLikedArticles(userId);
            return ResponseEntity.ok(Map.of(
                "message", "Liked articles retrieved",
                "count", articles.size(),
                "articles", articles
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Get user's bookmarked articles
     * GET /api/interactions/{userId}/bookmarked
     */
    @GetMapping("/{userId}/bookmarked")
    public ResponseEntity<?> getBookmarkedArticles(@PathVariable String userId) {
        try {
            List<Article> articles = interactionService.getBookmarkedArticles(userId);
            return ResponseEntity.ok(Map.of(
                "message", "Bookmarked articles retrieved",
                "count", articles.size(),
                "articles", articles
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Get user's read history
     * GET /api/interactions/{userId}/history
     */
    @GetMapping("/{userId}/history")
    public ResponseEntity<?> getReadHistory(@PathVariable String userId) {
        try {
            List<Article> articles = interactionService.getReadHistory(userId);
            return ResponseEntity.ok(Map.of(
                "message", "Read history retrieved",
                "count", articles.size(),
                "articles", articles
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}