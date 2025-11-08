package com.example.InfoByte.config;
import java.util.List;
import java.util.Map;

public final class AppConstants {
    private AppConstants() {}

    public static final String CATEGORY_TECHNOLOGY = "Technology";
    public static final String CATEGORY_BUSINESS = "Business";
    public static final String CATEGORY_SPORTS = "Sports";
    public static final String CATEGORY_MEDICINE = "Medicine";
    public static final String CATEGORY_SCIENCE = "Science";
    public static final String CATEGORY_WORLD_NEWS = "WorldNews";

    public static final Map<String, String> NEWSAPI_CATEGORY_MAP = Map.of(
            CATEGORY_TECHNOLOGY, "technology",
            CATEGORY_BUSINESS, "business",
            CATEGORY_SPORTS, "sports",
            CATEGORY_MEDICINE, "health",
            CATEGORY_SCIENCE, "science",
            CATEGORY_WORLD_NEWS, "general"
    );

    public static final List<String> CLASSIFIER_CATEGORIES = List.of(
            CATEGORY_TECHNOLOGY,
            CATEGORY_BUSINESS,
            CATEGORY_SPORTS,
            CATEGORY_MEDICINE,
            CATEGORY_SCIENCE,
            CATEGORY_WORLD_NEWS
    );
}