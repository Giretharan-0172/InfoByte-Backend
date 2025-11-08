package com.example.InfoByte.controller;

import com.example.InfoByte.dto.FeedResponse;
import com.example.InfoByte.model.Article;
import com.example.InfoByte.model.User;
import com.example.InfoByte.service.EnhancedFeedService;
import com.example.InfoByte.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/feed")
public class EnhancedFeedController {

    private final EnhancedFeedService feedService;
    private final UserService userService;

    public EnhancedFeedController(EnhancedFeedService feedService, UserService userService) {
        this.feedService = feedService;
        this.userService = userService;
    }

    /**
     * Get personalized feed based on user interests
     * GET /api/feed/{userId}?page=0&size=10
     */
    @GetMapping("/{userId}")
    public ResponseEntity<FeedResponse> getUserFeed(
            @PathVariable String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            User user = userService.getUserById(userId);
            if (user.getInterests() == null || user.getInterests().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new FeedResponse("User has no interests selected", null, 0, 0, 0));
            }

            Page<Article> articles = feedService.getPersonalizedFeed(
                user.getInterests(),
                PageRequest.of(page, size)
            );

            return ResponseEntity.ok(new FeedResponse(
                "Personalized feed retrieved successfully",
                articles.getContent(),
                articles.getTotalElements(),
                articles.getTotalPages(),
                articles.getNumber()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new FeedResponse(e.getMessage(), null, 0, 0, 0));
        }
    }

    /**
     * Get trending articles (sorted by engagement)
     * GET /api/feed/trending?page=0&size=10
     */
    @GetMapping("/trending")
    public ResponseEntity<FeedResponse> getTrendingFeed(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Page<Article> articles = feedService.getTrendingArticles(PageRequest.of(page, size));

            return ResponseEntity.ok(new FeedResponse(
                "Trending feed retrieved successfully",
                articles.getContent(),
                articles.getTotalElements(),
                articles.getTotalPages(),
                articles.getNumber()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new FeedResponse(e.getMessage(), null, 0, 0, 0));
        }
    }

    /**
     * Get popular articles (most liked)
     * GET /api/feed/popular?page=0&size=10
     */
    @GetMapping("/popular")
    public ResponseEntity<FeedResponse> getPopularFeed(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Page<Article> articles = feedService.getPopularArticles(PageRequest.of(page, size));

            return ResponseEntity.ok(new FeedResponse(
                "Popular articles retrieved successfully",
                articles.getContent(),
                articles.getTotalElements(),
                articles.getTotalPages(),
                articles.getNumber()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new FeedResponse(e.getMessage(), null, 0, 0, 0));
        }
    }

    /**
     * Get latest articles (all categories)
     * GET /api/feed/latest?page=0&size=10
     */
    @GetMapping("/latest")
    public ResponseEntity<FeedResponse> getLatestFeed(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Page<Article> articles = feedService.getLatestArticles(PageRequest.of(page, size));

            return ResponseEntity.ok(new FeedResponse(
                "Latest articles retrieved successfully",
                articles.getContent(),
                articles.getTotalElements(),
                articles.getTotalPages(),
                articles.getNumber()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new FeedResponse(e.getMessage(), null, 0, 0, 0));
        }
    }

    /**
     * Get feed by specific category
     * GET /api/feed/{userId}/category/{category}?page=0&size=10
     */
    @GetMapping("/{userId}/category/{category}")
    public ResponseEntity<FeedResponse> getFeedByCategory(
            @PathVariable String userId,
            @PathVariable String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            // Verify user exists
            userService.getUserById(userId);

            Page<Article> articles = feedService.getFeedByCategory(
                category,
                PageRequest.of(page, size)
            );

            return ResponseEntity.ok(new FeedResponse(
                "Category feed retrieved successfully",
                articles.getContent(),
                articles.getTotalElements(),
                articles.getTotalPages(),
                articles.getNumber()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new FeedResponse(e.getMessage(), null, 0, 0, 0));
        }
    }

    /**
     * Get single article by ID
     * GET /api/feed/article/{articleId}
     */
    @GetMapping("/article/{articleId}")
    public ResponseEntity<?> getArticleById(@PathVariable String articleId) {
        try {
            Article article = feedService.getArticleById(articleId);
            return ResponseEntity.ok(article);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}