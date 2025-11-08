package com.example.InfoByte.controller;

import com.example.InfoByte.dto.FeedResponse;
import com.example.InfoByte.model.Article;
import com.example.InfoByte.model.User;
import com.example.InfoByte.service.FeedService;
import com.example.InfoByte.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/feed")
public class FeedController {

    private final FeedService feedService;
    private final UserService userService;

    public FeedController(FeedService feedService, UserService userService) {
        this.feedService = feedService;
        this.userService = userService;
    }

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
                "Feed retrieved successfully",
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