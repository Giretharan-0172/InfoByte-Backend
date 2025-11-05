package com.example.InfoByte.Model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

/**
 * Represents a user document stored in the "users" collection in MongoDB.
 * Aligns with the SRS Class Diagram[cite: 164].
 */
@Data
@Document(collection = "users") // Maps to the "users" collection
public class User {

    @Id
    private String id;

    private String email;    // Will also be their username
    private String name;
    private String password; // We will store this hashed using Spring Security

    // This is the key for personalizing the feed
    private List<String> interests; // e.g., ["Technology", "Finance", "Sports"]
}