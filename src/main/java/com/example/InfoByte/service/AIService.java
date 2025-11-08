package com.example.InfoByte.service;

import com.example.InfoByte.config.AppConstants;
// ✅ CORRECT imports for Spring AI 1.0.0-M4
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.ai.embedding.EmbeddingResponse;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.IntStream;
import java.util.stream.Collectors;

@Service
public class AIService {

    private final ChatClient chatClient;
    private final EmbeddingModel embeddingModel;

    // ✅ Inject ChatClient.Builder and EmbeddingModel
    public AIService(ChatClient.Builder chatClientBuilder, EmbeddingModel embeddingModel) {
        this.chatClient = chatClientBuilder.build();
        this.embeddingModel = embeddingModel;
    }

    public String summarize(String articleContent) {
        String promptText = """
                Summarize the following article into 3-4 concise sentences 
                for a news feed application.
                ARTICLE: %s
                SUMMARY:
                """.formatted(articleContent);
        return chatClient.prompt()
                .user(promptText)
                .call()
                .content();
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
        return chatClient.prompt()
                .user(promptText)
                .call()
                .content();
    }

    public List<Double> embed(String text) {
        // ✅ FIXED: Convert float[] to List<Double>
        EmbeddingResponse response = embeddingModel.embedForResponse(List.of(text));
        float[] embedding = response.getResults().get(0).getOutput();
        
        // Convert float[] to List<Double>
        return IntStream.range(0, embedding.length)
                .mapToDouble(i -> (double) embedding[i])
                .boxed()
                .collect(Collectors.toList());
    }
}