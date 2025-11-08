package com.example.InfoByte.controller;
import com.example.InfoByte.service.ContentAggregationService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class TestController {

    private final ContentAggregationService contentAggregationService;

    public TestController(ContentAggregationService contentAggregationService) {
        this.contentAggregationService = contentAggregationService;
    }

    @GetMapping("/fetch-news")
    public String triggerNewsFetch() {
        System.out.println("Test endpoint hit. Starting news fetch in background...");
        new Thread(() -> {
            contentAggregationService.fetchAndProcessAllNews();
        }).start();
        return "OK! News fetch and processing job started in the background. Check your server logs and MongoDB database.";
    }
}