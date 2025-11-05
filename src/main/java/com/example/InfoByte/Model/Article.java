package com.example.InfoByte.Model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

/**
 * Represents an article document stored in the "articles" collection in MongoDB.
 */
@Data // From Lombok: automatically creates getters, setters, toString(), etc.
@Document(collection = "articles") // Tells Spring this class maps to the "articles" collection
public class Article {

    @Id // Marks this field as the primary key
    private String id;

    private String title;
    private String originalContent;
    private String sourceUrl;

    // This will be filled in by the AI
    private String category; // e.g., "Technology", "Finance"

    // --- AI Generated Fields ---

    // This will be the summary from Gemini
    private String summary;

    // This field is for the RAG chatbot (Phase 3)
    private List<Double> embedding;
}
