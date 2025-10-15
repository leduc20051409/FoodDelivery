package com.leanhduc.fooddelivery.Service.Redis.Food;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.leanhduc.fooddelivery.Model.Food;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class FoodRedisService implements IFoodRedisService{
    private final RedisTemplate<String, Object> redisTemplate;
    private final ObjectMapper objectMapper;

    private static final long CACHE_TTL = 4;

    private String getKey(Long restaurantId) {
        return "restaurant:" + restaurantId + ":foods";
    }

    @Override
    public void saveFoodByRestaurant(Long restaurantId, List<Food> foods) {
        try {
            String key = getKey(restaurantId);
            String jsonValue = objectMapper.writeValueAsString(foods);
            redisTemplate.opsForValue().set(key, jsonValue, CACHE_TTL, TimeUnit.HOURS);
        } catch (JsonProcessingException e) {
            System.out.println("Error saving food to Redis: " + e.getMessage());
        }
    }

    @Override
    public void deleteFoodCacheByRestaurant(Long restaurantId) {
        String key = getKey(restaurantId);
        redisTemplate.delete(key);
    }

    @Override
    public List<Food> getFoodByRestaurant(Long restaurantId) {
        try {
            String key = getKey(restaurantId);
            Object cacheValue = redisTemplate.opsForValue().get(key);
            if (cacheValue == null) {
                return null;
            }
            List<Food> foods = objectMapper.readValue(
                    cacheValue.toString(),
                    objectMapper.getTypeFactory().constructCollectionType(List.class, Food.class));

            return foods;
        } catch (JsonProcessingException e) {
            return null;
        }
    }

    @Override
    public void clearAll() {
        redisTemplate.getConnectionFactory().getConnection().flushAll();
    }
}
