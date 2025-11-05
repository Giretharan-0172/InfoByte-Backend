package com.example.InfoByte.repo;
import com.example.InfoByte.Model.Article;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ArticleRepo extends MongoRepository<Article, String> {

    // This will find all articles where the 'category' field is in the user's list of interests
    Page<Article> findByCategoryIn(List<String> categories, Pageable pageable);
}
