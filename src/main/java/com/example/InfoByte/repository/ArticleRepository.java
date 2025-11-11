package com.example.InfoByte.repository;

import com.example.InfoByte.model.Article;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ArticleRepository extends MongoRepository<Article, String> {
    Page<Article> findByCategoryIn(List<String> categories, Pageable pageable);

    Page<Article> findByTitleContainingIgnoreCaseOrSummaryContainingIgnoreCase(String title, String summary, Pageable pageable);

    // ✅ NEW: Check for duplicates
    boolean existsBySourceUrl(String sourceUrl);

    // ✅ NEW: Get batch of unprocessed articles for the scheduler
    List<Article> findTop15ByProcessedFalse();
    
    // Optional: count pending
    long countByProcessedFalse();
}