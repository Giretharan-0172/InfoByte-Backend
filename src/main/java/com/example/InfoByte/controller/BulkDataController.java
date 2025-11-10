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

    @DeleteMapping("/clear-articles")
    public ResponseEntity<Map<String, Object>> clearArticles() {
        long count = articleRepository.count();
        articleRepository.deleteAll();
        return ResponseEntity.ok(Map.of(
            "message", "All articles deleted",
            "deletedCount", count
        ));
    }

    @PostMapping("/seed-data")
    public ResponseEntity<Map<String, Object>> seedTestData() {
        articleRepository.deleteAll();

        // ✅ UPDATED - Added imageUrl to all articles
        List<Article> articles = List.of(
            createArticle(
                "AI Revolutionizes Healthcare Diagnostics",
                "Recent advancements in artificial intelligence have led to faster and more accurate diagnostic systems.",
                "https://techcrunch.com/ai-healthcare-2025",
                "Technology",
                "AI is transforming healthcare by enabling faster and more accurate disease detection.",
                "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800"
            ),
            createArticle(
                "Quantum Computing Breakthrough",
                "Scientists at MIT have achieved a major breakthrough in quantum computing.",
                "https://news.mit.edu/quantum-2025",
                "Technology",
                "MIT researchers developed a 100-qubit quantum processor with extended coherence time.",
                "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800"
            ),
            createArticle(
                "Stock Markets Rally on Tech Earnings",
                "Major tech companies reported better-than-expected quarterly earnings.",
                "https://reuters.com/markets-2025",
                "Business",
                "Stock markets surged as tech companies exceeded earnings expectations.",
                "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800"
            ),
            createArticle(
                "Startup Raises $100M for Green Energy",
                "CleanTech Innovations has secured $100 million in Series B funding.",
                "https://techcrunch.com/cleantech-2025",
                "Business",
                "CleanTech raised $100M to expand production of efficient solar panels.",
                "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800"
            ),
            createArticle(
                "World Cup Final Draws Record Viewership",
                "The FIFA World Cup final attracted 2.5 billion viewers worldwide.",
                "https://espn.com/worldcup-2025",
                "Sports",
                "World Cup final set viewership records with Brazil winning on penalties.",
                "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800"
            ),
            createArticle(
                "Olympic Athlete Breaks 100m World Record",
                "Sprinter James Williams shattered the 100-meter world record.",
                "https://olympic.org/record-2025",
                "Sports",
                "James Williams broke the 100m world record running 9.52 seconds.",
                "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800"
            ),
            createArticle(
                "New Cancer Treatment Shows Promise",
                "A groundbreaking cancer treatment achieved 70% remission rate.",
                "https://nejm.org/cancer-2025",
                "Medicine",
                "Novel immune cell therapy achieved 70% remission in melanoma patients.",
                "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800"
            ),
            createArticle(
                "Mental Health Apps Gain Medical Recognition",
                "The FDA approved three mental health apps for prescription use.",
                "https://fda.gov/apps-2025",
                "Medicine",
                "FDA approved mental health apps for treating anxiety and depression.",
                "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=800"
            ),
            createArticle(
                "Mars Rover Discovers Water Ice",
                "NASA's rover discovered substantial water ice deposits on Mars.",
                "https://nasa.gov/mars-2025",
                "Science",
                "NASA's rover found water ice deposits crucial for future missions.",
                "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800"
            ),
            createArticle(
                "Nuclear Fusion Milestone Achieved",
                "Scientists achieved net energy gain from nuclear fusion.",
                "https://llnl.gov/fusion-2025",
                "Science",
                "Scientists achieved reproducible net energy gain from fusion.",
                "https://images.unsplash.com/photo-1530973428-5bf2db2e4d71?w=800"
            ),
            createArticle(
                "UN Climate Summit Historic Agreement",
                "World leaders agreed to accelerate carbon reduction targets.",
                "https://un.org/climate-2025",
                "WorldNews",
                "UN Summit produced agreement with $500B for renewable energy transition.",
                "https://images.unsplash.com/photo-1569163139394-de4798aa62b6?w=800"
            ),
            createArticle(
                "Global Peace Treaty Signed",
                "Nations signed a comprehensive peace treaty in Geneva.",
                "https://un.org/peace-2025",
                "WorldNews",
                "Historic peace treaty signed addressing territorial disputes.",
                "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800"
            )
        );

        List<Article> saved = articleRepository.saveAll(articles);
        
        return ResponseEntity.ok(Map.of(
            "message", "Test data seeded successfully",
            "count", saved.size()
        ));
    }

    // ✅ UPDATED - Added imageUrl parameter
    private Article createArticle(String title, String content, String url, String category, String summary, String imageUrl) {
        Article article = new Article();
        article.setTitle(title);
        article.setOriginalContent(content);
        article.setSourceUrl(url);
        article.setCategory(category);
        article.setSummary(summary);
        article.setImageUrl(imageUrl);  // ✅ SET IMAGE URL
        article.setEmbedding(List.of(0.1, -0.2, 0.3, -0.1, 0.2, 0.0, -0.15, 0.25, -0.05, 0.18));
        return article;
    }
}