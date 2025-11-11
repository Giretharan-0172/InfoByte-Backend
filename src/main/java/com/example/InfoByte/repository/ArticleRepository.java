package com.example.InfoByte.repository;

import com.example.InfoByte.model.Article;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.query.TextCriteria; // ✅ NEW
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ArticleRepository extends MongoRepository<Article, String> {
    Page<Article> findByCategoryIn(List<String> categories, Pageable pageable);

    // ✅ NEW: Find articles that match the text criteria (for search)
    Page<Article> findAllBy(TextCriteria criteria, Pageable pageable);
}