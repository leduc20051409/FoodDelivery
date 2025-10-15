package com.leanhduc.fooddelivery.Configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.util.logging.Logger;

@Configuration
public class RedisConfig {
    private static final Logger logger = Logger.getLogger(RedisConfig.class.getName());

    @Value ("${spring.data.redis.host}")
    private String redisHost;

    @Value("${spring.data.redis.port}")
    private int redisPort;

    @Bean
    public LettuceConnectionFactory redisConnectionFactory() {
        logger.info(String.format("🔗 Connecting to Redis at %s:%d", redisHost, redisPort));
        RedisStandaloneConfiguration configuration =
                new RedisStandaloneConfiguration(redisHost, redisPort);
        LettuceConnectionFactory factory = new LettuceConnectionFactory(configuration);
        try {
            factory.afterPropertiesSet();
            factory.getConnection().ping();
            logger.info("✅ Redis connection successful!");
        } catch (Exception e) {
            logger.severe("❌ Redis connection failed: " + e.getMessage());
        }
        return factory;
    }

    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory redisConnectionFactory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(redisConnectionFactory);
        Jackson2JsonRedisSerializer<Object> serializer =
                new Jackson2JsonRedisSerializer<>(Object.class);
        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(serializer);
        template.setHashKeySerializer(new StringRedisSerializer());
        template.setHashValueSerializer(serializer);

        template.afterPropertiesSet();
        return template;
    }
}
