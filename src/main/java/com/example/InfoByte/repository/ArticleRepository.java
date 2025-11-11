package com.example.InfoByte.repository;

import com.example.InfoByte.model.Article;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ArticleRepository extends MongoRepository<Article, String> {
    Page<Article> findByCategoryIn(List<String> categories, Pageable pageable);

    // ✅ FIX: Changed from TextCriteria to standard standard regex-like search
    // This is much more robust for simple search queries
    Page<Article> findByTitleContainingIgnoreCaseOrSummaryContainingIgnoreCase(String title, String summary, Pageable pageable);
}