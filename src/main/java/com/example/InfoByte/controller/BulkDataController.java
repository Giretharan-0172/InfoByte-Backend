package com.example.InfoByte.controller;

import com.example.InfoByte.model.Article;
import com.example.InfoByte.repository.ArticleRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
public class BulkDataController {

    private final ArticleRepository articleRepository;

    public BulkDataController(ArticleRepository articleRepository) {
        this.articleRepository = articleRepository;
    }

    /**
     * Bulk insert articles for testing
     * POST /api/test/bulk-insert
     * Body: Array of Article objects
     */
    @PostMapping("/bulk-insert")
    public ResponseEntity<Map<String, Object>> bulkInsertArticles(@RequestBody List<Article> articles) {
        try {
            List<Article> saved = articleRepository.saveAll(articles);
            return ResponseEntity.ok(Map.of(
                "message", "Articles inserted successfully",
                "count", saved.size(),
                "articles", saved
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "message", "Failed to insert articles",
                "error", e.getMessage()
            ));
        }
    }

    /**
     * Delete all articles (cleanup for testing)
     * DELETE /api/test/clear-articles
     */
    @DeleteMapping("/clear-articles")
    public ResponseEntity<Map<String, Object>> clearArticles() {
        long count = articleRepository.count();
        articleRepository.deleteAll();
        return ResponseEntity.ok(Map.of(
            "message", "All articles deleted",
            "deletedCount", count
        ));
    }

    /**
     * Insert sample test data
     * POST /api/test/seed-data
     */
    @PostMapping("/seed-data")
    public ResponseEntity<Map<String, Object>> seedTestData() {
        // Clear existing articles
        articleRepository.deleteAll();

        // Create sample articles
        List<Article> articles = List.of(
            createArticle(
                "AI Revolutionizes Healthcare Diagnostics",
                "Recent advancements in artificial intelligence have led to faster and more accurate diagnostic systems.",
                "https://techcrunch.com/ai-healthcare-2025",
                "Technology",
                "AI is transforming healthcare by enabling faster and more accurate disease detection."
            ),
            createArticle(
                "Quantum Computing Breakthrough",
                "Scientists at MIT have achieved a major breakthrough in quantum computing.",
                "https://news.mit.edu/quantum-2025",
                "Technology",
                "MIT researchers developed a 100-qubit quantum processor with extended coherence time."
            ),
            createArticle(
                "Stock Markets Rally on Tech Earnings",
                "Major tech companies reported better-than-expected quarterly earnings.",
                "https://reuters.com/markets-2025",
                "Business",
                "Stock markets surged as tech companies exceeded earnings expectations."
            ),
            createArticle(
                "Startup Raises $100M for Green Energy",
                "CleanTech Innovations has secured $100 million in Series B funding.",
                "https://techcrunch.com/cleantech-2025",
                "Business",
                "CleanTech raised $100M to expand production of efficient solar panels."
            ),
            createArticle(
                "World Cup Final Draws Record Viewership",
                "The FIFA World Cup final attracted 2.5 billion viewers worldwide.",
                "https://espn.com/worldcup-2025",
                "Sports",
                "World Cup final set viewership records with Brazil winning on penalties."
            ),
            createArticle(
                "Olympic Athlete Breaks 100m World Record",
                "Sprinter James Williams shattered the 100-meter world record.",
                "https://olympic.org/record-2025",
                "Sports",
                "James Williams broke the 100m world record running 9.52 seconds."
            ),
            createArticle(
                "New Cancer Treatment Shows Promise",
                "A groundbreaking cancer treatment achieved 70% remission rate.",
                "https://nejm.org/cancer-2025",
                "Medicine",
                "Novel immune cell therapy achieved 70% remission in melanoma patients."
            ),
            createArticle(
                "Mental Health Apps Gain Medical Recognition",
                "The FDA approved three mental health apps for prescription use.",
                "https://fda.gov/apps-2025",
                "Medicine",
                "FDA approved mental health apps for treating anxiety and depression."
            ),
            createArticle(
                "Mars Rover Discovers Water Ice",
                "NASA's rover discovered substantial water ice deposits on Mars.",
                "https://nasa.gov/mars-2025",
                "Science",
                "NASA's rover found water ice deposits crucial for future missions."
            ),
            createArticle(
                "Nuclear Fusion Milestone Achieved",
                "Scientists achieved net energy gain from nuclear fusion.",
                "https://llnl.gov/fusion-2025",
                "Science",
                "Scientists achieved reproducible net energy gain from fusion."
            ),
            createArticle(
                "UN Climate Summit Historic Agreement",
                "World leaders agreed to accelerate carbon reduction targets.",
                "https://un.org/climate-2025",
                "WorldNews",
                "UN Summit produced agreement with $500B for renewable energy transition."
            ),
            createArticle(
                "Global Peace Treaty Signed",
                "Nations signed a comprehensive peace treaty in Geneva.",
                "https://un.org/peace-2025",
                "WorldNews",
                "Historic peace treaty signed addressing territorial disputes."
            )
        );

        List<Article> saved = articleRepository.saveAll(articles);
        
        return ResponseEntity.ok(Map.of(
            "message", "Test data seeded successfully",
            "count", saved.size()
        ));
    }

    private Article createArticle(String title, String content, String url, String category, String summary) {
        Article article = new Article();
        article.setTitle(title);
        article.setOriginalContent(content);
        article.setSourceUrl(url);
        article.setCategory(category);
        article.setSummary(summary);
        // Simple dummy embedding (10 dimensions for testing)
        article.setEmbedding(List.of(0.1, -0.2, 0.3, -0.1, 0.2, 0.0, -0.15, 0.25, -0.05, 0.18));
        return article;
    }
}
