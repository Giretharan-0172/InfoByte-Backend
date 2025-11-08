package com.example.InfoByte.repository;

import com.example.InfoByte.model.UserInteraction;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

// This MUST be an interface
public interface UserInteractionRepository extends MongoRepository<UserInteraction, String> {

    // ✅ FIX: Add queries required by InteractionService
    Optional<UserInteraction> findByUserIdAndArticleId(String userId, String articleId);
    
    List<UserInteraction> findByUserIdAndLikedTrue(String userId);
    
    List<UserInteraction> findByUserIdAndBookmarkedTrue(String userId);

    List<UserInteraction> findByUserIdAndReadTrue(String userId);
}