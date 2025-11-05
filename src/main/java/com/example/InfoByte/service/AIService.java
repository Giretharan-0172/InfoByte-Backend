package com.example.InfoByte.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.embedding.EmbeddingClient;
import org.springframework.stereotype.Service;

import java.util.List;

@Service

public class AIService {
    private final ChatClient chatClient;
    private final EmbeddingClient embeddingClient;

    // Spring AI automatically injects the configured Gemini clients
    // because we added the dependency and API key.
    public AIService(ChatClient chatClient, EmbeddingClient embeddingClient) {
        this.chatClient = chatClient;
        this.embeddingClient = embeddingClient;
    }

    /**
     * Generates a concise summary for a given article.
     * This is for the main feed.
     */
    public String summarize(String articleContent) {
        // This is a simple "zero-shot" prompt.
        String promptText = """
                Summarize the following article into 3-4 concise sentences 
                for a news feed application.
                
                ARTICLE:
                %s
                
                SUMMARY:
                """.formatted(articleContent);

        return chatClient.call(new Prompt(promptText)).getResult().getOutput().getContent();
    }

    /**
     * Classifies an article into a predefined category.
     * This is for personalizing the feed.
     */
    public String classify(String articleContent) {
        String promptText = """
                Classify this article into ONE of the following categories: 
                Technology, Finance, Sports, Medicine, Science, WorldNews.
                Return only the single category name and nothing else.
                
                ARTICLE:
                %s
                
                CATEGORY:
                """.formatted(articleContent);

        return chatClient.call(new Prompt(promptText)).getResult().getOutput().getContent();
    }

    /**
     * Creates a vector embedding for a given text.
     * This is for the RAG chatbot (Phase 3).
     */
    public List<Double> embed(String text) {
        return embeddingClient.embed(text);
    }
}
