package com.example.InfoByte.service;

import com.example.InfoByte.config.AppConstants;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AIService {

    private final GeminiService geminiService;

    public AIService(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    public String summarize(String articleContent) {
        String promptText = """
                Summarize the following article into exactly 2-4 sentences (approx 60 words).
                Focus on the main event and outcome. Do not use "This article talks about".
                ARTICLE: %s
                SUMMARY:
                """.formatted(articleContent);
        
        return geminiService.chat(promptText);
    }

    public String classify(String articleContent) {
        String categories = String.join(", ", AppConstants.CLASSIFIER_CATEGORIES);
        String promptText = """
                Classify this article into ONE of the following categories: 
                %s.
                Return only the single category name and nothing else.
                ARTICLE: %s
                CATEGORY:
                """.formatted(categories, articleContent);
        
        return geminiService.chat(promptText).trim();
    }

    public List<Double> embed(String text) {
        return geminiService.getEmbedding(text);
    }
}