package com.leanhduc.fooddelivery.Service.Review;

import com.leanhduc.fooddelivery.Model.Review;
import com.leanhduc.fooddelivery.RequestDto.CreateReviewRequest;
import com.leanhduc.fooddelivery.ResponseDto.ReviewDto;

import java.util.List;

public interface IReviewService {
    ReviewDto createReview(Long userId, Long orderId, CreateReviewRequest request);

    ReviewDto editReview(Long reviewId, Long userId, CreateReviewRequest request);

    List<ReviewDto> getReviewsByRestaurantId(Long restaurantId, int page, int size);

    List<ReviewDto> getUserReviews(Long userId, int page, int size);

    ReviewDto getReviewByOrderId(Long orderId, Long userId);

    void deleteReview(Long reviewId, Long userId);

    ReviewDto conversionToDto(Review review);
}

