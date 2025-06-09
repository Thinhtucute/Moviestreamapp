package com.group8.Backend.service;

import ai.djl.MalformedModelException;
import ai.djl.inference.Predictor;
import ai.djl.ndarray.NDArray;
import ai.djl.ndarray.NDList;
import ai.djl.ndarray.NDManager;
import ai.djl.repository.zoo.Criteria;
import ai.djl.repository.zoo.ModelNotFoundException;
import ai.djl.repository.zoo.ModelZoo;
import ai.djl.repository.zoo.ZooModel;
import ai.djl.training.util.ProgressBar;

import com.group8.Backend.dto.response.MediaResponse;
import com.group8.Backend.entity.Media;
import com.group8.Backend.mapper.MediaMapper;
import com.group8.Backend.repository.FavoriteRepository;
import com.group8.Backend.repository.MediaRepository;
import jakarta.annotation.PostConstruct;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Paths;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RecommendationService {
    final FavoriteRepository favoriteRepository;
    final MediaRepository mediaRepository;
    final MediaMapper mediaMapper;
    final JdbcTemplate jdbcTemplate;

    @Value("${recommendation.model.path:src/main/resources/models/gcn_model.pt}")
    String modelPath;

    // Cache to store movie embeddings for fast similarity calculation
    Map<Integer, float[]> movieEmbeddings = new ConcurrentHashMap<>();

    // Cache to store pre-calculated similar movies
    Map<Integer, List<Integer>> similarMoviesCache = new ConcurrentHashMap<>();

    // DJL components
    ZooModel<NDList, NDList> model;
    Predictor<NDList, NDList> predictor;
    NDManager manager;

    @PostConstruct
    public void init() {
        log.info("Initializing recommendation service with PyTorch model...");

        try {
            // Initialize NDManager
            manager = NDManager.newBaseManager();

            // Load the model
            loadModel();

            // Cache movie embeddings for faster lookup
            cacheMovieEmbeddings();

            log.info("Recommendation service initialized successfully");
        } catch (Exception e) {
            log.error("Failed to initialize recommendation service: {}", e.getMessage(), e);
            log.info("Falling back to sample data...");
            // Create fallback data just in case
            populateSampleData();
        }
    }

    private void loadModel() {
        try {
            log.info("Loading PyTorch model from: {}", modelPath);
            // Check if the file exists
            java.io.File modelFile = new java.io.File(modelPath);
            if (!modelFile.exists()) {
                log.error("Model file does not exist at path: {}", modelPath);
                throw new RuntimeException("Model file not found: " + modelPath);
            }
            // Log file size and other details
            log.info("Model file exists, size: {} bytes", modelFile.length());

            Criteria<NDList, NDList> criteria = Criteria.builder()
                    .setTypes(NDList.class, NDList.class)
                    .optModelPath(Paths.get(modelPath))
                    .optEngine("PyTorch")
                    .optProgress(new ProgressBar())
                    .build();
            // Try loading the model
            log.info("Attempting to load model with DJL...");
            model = ModelZoo.loadModel(criteria);
            predictor = model.newPredictor();

            log.info("PyTorch model loaded successfully");
        } catch (ModelNotFoundException | MalformedModelException | IOException e) {
            log.error("Failed to load model: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to load recommendation model", e);
        }
    }

    private void cacheMovieEmbeddings() {
        try {
            log.info("Caching movie embeddings for faster similarity calculations");

            // Get all known MovieLens IDs from database
            List<Integer> allMovieLensIds = jdbcTemplate.queryForList(
                    "SELECT DISTINCT movieId FROM movielens_links ORDER BY movieId",
                    Integer.class);

            int counter = 0;
            for (Integer movieId : allMovieLensIds) {
                try {
                    float[] embedding = getMovieEmbedding(movieId);
                    if (embedding != null) {
                        movieEmbeddings.put(movieId, embedding);
                        counter++;

                        // Log progress periodically
                        if (counter % 100 == 0) {
                            log.info("Cached {} movie embeddings so far", counter);
                        }
                    }
                } catch (Exception e) {
                    log.warn("Failed to get embedding for movie {}: {}", movieId, e.getMessage());
                }
            }

            log.info("Successfully cached embeddings for {} movies", movieEmbeddings.size());
        } catch (Exception e) {
            log.error("Failed to cache movie embeddings: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to cache movie embeddings", e);
        }
    }

    private float[] getMovieEmbedding(int movieId) {
        try {
            // If we've already cached this embedding, return it
            if (movieEmbeddings.containsKey(movieId)) {
                return movieEmbeddings.get(movieId);
            }

            // Create input for the model
            NDList input = new NDList();
            input.add(manager.create(new long[] { movieId }));

            // Get prediction from model
            NDList output = predictor.predict(input);

            // Extract embedding from the output
            NDArray embedding = output.get(0);

            // Convert to float array
            float[] embArray = embedding.toFloatArray();

            // Cache the result
            movieEmbeddings.put(movieId, embArray);

            return embArray;
        } catch (Exception e) {
            log.warn("Error getting embedding for movie {}: {}", movieId, e.getMessage());
            return null;
        }
    }

    private List<Integer> findSimilarMoviesByEmbedding(int movieId, int topK) {
        try {
            // Get the target movie embedding
            float[] targetEmbedding = getMovieEmbedding(movieId);
            if (targetEmbedding == null) {
                return Collections.emptyList();
            }

            // Calculate cosine similarity with all other movies
            Map<Integer, Double> similarities = new HashMap<>();

            for (Map.Entry<Integer, float[]> entry : movieEmbeddings.entrySet()) {
                int candidateId = entry.getKey();
                if (candidateId != movieId) { // Skip self
                    float[] candidateEmbedding = entry.getValue();
                    double similarity = cosineSimilarity(targetEmbedding, candidateEmbedding);
                    similarities.put(candidateId, similarity);
                }
            }

            // Sort by similarity descending and get top K
            return similarities.entrySet().stream()
                    .sorted(Map.Entry.<Integer, Double>comparingByValue().reversed())
                    .limit(topK)
                    .map(Map.Entry::getKey)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error finding similar movies for {}: {}", movieId, e.getMessage());
            return Collections.emptyList();
        }
    }

    private double cosineSimilarity(float[] vectorA, float[] vectorB) {
        if (vectorA.length != vectorB.length) {
            throw new IllegalArgumentException("Vectors must be of the same length");
        }

        double dotProduct = 0.0;
        double normA = 0.0;
        double normB = 0.0;

        for (int i = 0; i < vectorA.length; i++) {
            dotProduct += vectorA[i] * vectorB[i];
            normA += Math.pow(vectorA[i], 2);
            normB += Math.pow(vectorB[i], 2);
        }

        if (normA == 0 || normB == 0) {
            return 0; // Handle zero vectors
        }

        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }

    private void populateSampleData() {
        log.info("Populating sample recommendation data...");

        // Add sample data for common movie IDs (these are arbitrary examples)
        similarMoviesCache.put(1, Arrays.asList(2, 3, 4, 5, 6, 7, 8, 9, 10));
        similarMoviesCache.put(2, Arrays.asList(1, 3, 11, 12, 13, 14, 15));
        similarMoviesCache.put(3, Arrays.asList(1, 2, 16, 17, 18, 19, 20));
        similarMoviesCache.put(4, Arrays.asList(1, 5, 21, 22, 23, 24, 25));
        similarMoviesCache.put(5, Arrays.asList(1, 4, 26, 27, 28, 29, 30));

        // Add more popular movies
        for (int i = 1; i <= 100; i++) {
            if (!similarMoviesCache.containsKey(i)) {
                List<Integer> similar = new ArrayList<>();
                // Add 5-10 similar movies
                int numSimilar = 5 + new Random().nextInt(6);
                for (int j = 0; j < numSimilar; j++) {
                    int similarId = 101 + (i * 10) + j;
                    similar.add(similarId);
                }
                similarMoviesCache.put(i, similar);
            }
        }

        log.info("Populated sample data with {} movie similarities", similarMoviesCache.size());
    }

    public void clearCache() {
        log.info("Clearing recommendation caches...");
        similarMoviesCache.clear();
        movieEmbeddings.clear();
        log.info("Recommendation caches cleared successfully");
    }

    public List<MediaResponse> getRecommendationsForUser(int userId) {
        // 1. Get user's favorite movies
        List<Integer> favoriteMediaIds = favoriteRepository.findMediaIdsByUserId(userId);

        log.info("Finding recommendations for user {} with {} favorites", userId, favoriteMediaIds.size());

        if (favoriteMediaIds.isEmpty()) {
            // Return popular movies if user has no favorites
            log.info("No favorites found for user {}, returning popular recommendations", userId);
            return getPopularRecommendations();
        }

        // 2. For each favorite, get similar movies using the mapping table and ML model
        Map<Integer, Double> recommendationScores = new HashMap<>();

        for (Integer mediaId : favoriteMediaIds) {
            // Find TMDB to MovieLens mapping
            Integer movielensId = getMovieLensIdForMedia(mediaId);

            if (movielensId != null) {
                log.debug("Found MovieLens ID {} for media ID {}", movielensId, mediaId);

                // Get similar movies based on MovieLens ID
                List<Integer> similarMovieLensIds = getSimilarMovies(movielensId);
                log.debug("Found {} similar MovieLens IDs for {}", similarMovieLensIds.size(), movielensId);

                // Map MovieLens IDs back to Media IDs
                for (Integer similarMovieLensId : similarMovieLensIds) {
                    Integer similarMediaId = getMediaIdForMovieLensId(similarMovieLensId);
                    if (similarMediaId != null) {
                        // Increment score for this recommendation
                        recommendationScores.put(similarMediaId,
                                recommendationScores.getOrDefault(similarMediaId, 0.0) + 1.0);
                    }
                }
            } else {
                log.debug("No MovieLens ID found for media ID {}", mediaId);
            }
        }

        log.info("Found {} raw recommendations before filtering", recommendationScores.size());

        // Remove movies the user has already favorited
        favoriteMediaIds.forEach(recommendationScores::remove);

        log.info("Found {} recommendations after removing user favorites", recommendationScores.size());

        if (recommendationScores.isEmpty()) {
            log.info("No recommendations found after filtering, returning popular recommendations");
            return getPopularRecommendations();
        }

        // Get top scored recommendations
        List<Integer> recommendationCandidates = recommendationScores.entrySet().stream()
                .sorted(Map.Entry.<Integer, Double>comparingByValue().reversed())
                .limit(30)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());

        // Shuffle the recommendations
        Collections.shuffle(recommendationCandidates);

        // Take the first 10 after shuffling
        List<Integer> topRecommendedIds = recommendationCandidates.stream()
                .limit(10)
                .collect(Collectors.toList());

        log.info("Selected 10 randomized recommendations from a pool of {} candidates",
                recommendationCandidates.size());

        // 3. Get media details for recommendations
        List<Media> recommendedMedia = mediaRepository.findAllById(topRecommendedIds);

        log.info("Retrieved {} media details for recommendations", recommendedMedia.size());

        // 4. Convert to response objects
        List<MediaResponse> recommendations = recommendedMedia.stream()
                .map(mediaMapper::toMediaResponse)
                .collect(Collectors.toList());

        log.info("Returning {} final recommendations for user {}", recommendations.size(), userId);
        return recommendations;
    }

    private List<MediaResponse> getPopularRecommendations() {
        // Simple popularity-based fallback
        List<MediaResponse> popularMedia = mediaRepository.findTopByViewCount(10).stream()
                .map(mediaMapper::toMediaResponse)
                .collect(Collectors.toList());

        log.info("Returning {} popular recommendations", popularMedia.size());
        return popularMedia;
    }

    private Integer getMovieLensIdForMedia(Integer mediaId) {
        try {
            Integer movielensId = jdbcTemplate.queryForObject(
                    "SELECT movieId FROM movielens_links WHERE tmdbId = ?",
                    Integer.class,
                    mediaId);
            return movielensId;
        } catch (Exception e) {
            log.debug("No MovieLens mapping found for media ID {}: {}", mediaId, e.getMessage());
            return null;
        }
    }

    private Integer getMediaIdForMovieLensId(Integer movielensId) {
        try {
            Integer mediaId = jdbcTemplate.queryForObject(
                    "SELECT tmdbId FROM movielens_links WHERE movieId = ?",
                    Integer.class,
                    movielensId);
            return mediaId;
        } catch (Exception e) {
            log.debug("No media mapping found for MovieLens ID {}: {}", movielensId, e.getMessage());
            return null;
        }
    }

    private List<Integer> getSimilarMovies(Integer movielensId) {
        // Check cache first
        if (similarMoviesCache.containsKey(movielensId)) {
            return similarMoviesCache.get(movielensId);
        }

        try {
            // Use the model to find similar movies
            List<Integer> similarMovies = findSimilarMoviesByEmbedding(movielensId, 20);

            // Cache the result for future use
            if (!similarMovies.isEmpty()) {
                similarMoviesCache.put(movielensId, similarMovies);
            }

            return similarMovies;
        } catch (Exception e) {
            log.error("Error finding similar movies for {}: {}", movielensId, e.getMessage());
            return Collections.emptyList();
        }
    }
}