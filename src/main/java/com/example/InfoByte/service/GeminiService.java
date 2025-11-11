package com.example.InfoByte.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    private static final Logger logger = LoggerFactory.getLogger(GeminiService.class);

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.model:gemini-2.0-flash}")
    private String modelName;



    private final RestTemplate restTemplate;

    // ✅ PRODUCTION UPGRADE: Configure timeouts via Constructor
    // Prevents the application from hanging if the API is slow
    public GeminiService(RestTemplateBuilder builder) {
        this.restTemplate = builder
                .setConnectTimeout(Duration.ofSeconds(10))
                .setReadTimeout(Duration.ofSeconds(30))
                .build();
    }

    // --- 1. Chat / Text Generation ---
    public String chat(String prompt) {
        // ✅ CRITICAL FIX: gemini-1.5-flash lives in 'v1beta'. 'v1' causes 404 errors.
        String url = "https://generativelanguage.googleapis.com/v1beta/models/"
        + modelName + ":generateContent?key=" + apiKey;



        Map<String, Object> requestBody = Map.of(
            "contents", List.of(
                Map.of("parts", List.of(
                    Map.of("text", prompt)
                ))
            )
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                List<Map<String, Object>> candidates = 
                    (List<Map<String, Object>>) response.getBody().get("candidates");

                if (candidates != null && !candidates.isEmpty()) {
                    Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                    List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                    return parts.get(0).get("text").toString();
                }
            }
            throw new RuntimeException("No response content from Gemini");

        } catch (HttpClientErrorException e) {
            logger.error("Gemini API Error ({}): {}", e.getStatusCode(), e.getResponseBodyAsString());
            // Throwing exception ensures the Scheduler retry logic kicks in
            throw new RuntimeException("Gemini API Error: " + e.getResponseBodyAsString());
        } catch (Exception e) {
            logger.error("Unexpected error calling Gemini API", e);
            throw new RuntimeException("Error calling Gemini API", e);
        }
    }

    // --- 2. Embedding Generation ---
    public List<Double> getEmbedding(String text) {
        // ✅ FIXED: text-embedding-004 also requires 'v1beta'
        String url = "https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=" + apiKey;


        Map<String, Object> requestBody = Map.of(
            "model", "models/text-embedding-004",
            "content", Map.of(
                "parts", List.of(
                    Map.of("text", text)
                )
            )
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> embeddingMap = (Map<String, Object>) response.getBody().get("embedding");
                if (embeddingMap != null) {
                    return (List<Double>) embeddingMap.get("values");
                }
            }
            return Collections.emptyList();
        } catch (Exception e) {
            logger.warn("Failed to generate embedding: {}", e.getMessage());
            // Return empty list for embeddings so flow continues, but log the warning
            return Collections.emptyList();
        }
    }
}