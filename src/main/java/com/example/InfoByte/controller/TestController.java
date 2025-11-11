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
        // This now only FETCHES and stores raw data.
        // Processing happens automatically in the background every minute.
        new Thread(() -> {
            contentAggregationService.fetchNewsFromApiManual();
        }).start();
        
        return "Fetch started! Articles are being saved to DB. The AI Processor will summarize 15 of them every minute automatically.";
    }
}