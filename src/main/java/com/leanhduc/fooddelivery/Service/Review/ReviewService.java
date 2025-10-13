package com.leanhduc.fooddelivery.Service.Review;

import com.leanhduc.fooddelivery.Exception.ResourceNotFoundException;
import com.leanhduc.fooddelivery.Exception.ReviewException;
import com.leanhduc.fooddelivery.Exception.UnauthorizedAccessException;
import com.leanhduc.fooddelivery.Model.Order;
import com.leanhduc.fooddelivery.Model.OrderStatus;
import com.leanhduc.fooddelivery.Model.Restaurant;
import com.leanhduc.fooddelivery.Model.Review;
import com.leanhduc.fooddelivery.Repository.OrderRepository;
import com.leanhduc.fooddelivery.Repository.RestaurantRepository;
import com.leanhduc.fooddelivery.Repository.ReviewRepository;
import com.leanhduc.fooddelivery.RequestDto.CreateReviewRequest;
import com.leanhduc.fooddelivery.ResponseDto.ReviewDto;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService implements IReviewService {

    private final OrderRepository orderRepository;
    private final ReviewRepository reviewRepository;
    private final RestaurantRepository restaurantRepository;
    private final ModelMapper modelMapper;

    @Override
    @Transactional
    public ReviewDto createReview(Long userId, Long orderId, CreateReviewRequest request) {
        Order order = validateOrderForReview(orderId, userId);

        Review review = new Review();
        review.setCustomer(order.getCustomer());
        review.setRestaurant(order.getRestaurant());
        review.setOrder(order);
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setReviewDate(new Date());
        review.setVerified(true);

        Review savedReview = reviewRepository.save(review);

        order.setReviewed(true);
        orderRepository.save(order);

        updateRestaurantRating(order.getRestaurant().getId());

        return conversionToDto(savedReview);
    }

    private Order validateOrderForReview(Long orderId, Long userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (!order.getCustomer().getId().equals(userId)) {
            throw new UnauthorizedAccessException("Not your order");
        }

        if (order.getOrderStatus() != OrderStatus.DELIVERED && order.getOrderStatus() != OrderStatus.COMPLETED) {
            throw new ReviewException("Order must be delivered to review");
        }

        if (order.isReviewed()) {
            throw new ReviewException("Order already reviewed");
        }

        Date deliveredDate = order.getUpdatedAt();
        Date now = new Date();
        long daysDiff = (now.getTime() - deliveredDate.getTime()) / (1000 * 60 * 60 * 24);

        if (daysDiff > 30) {
            throw new ReviewException("Review period expired (30 days)");
        }

        return order;
    }

    private void updateRestaurantRating(Long restaurantId) {
        List<Review> reviews = reviewRepository.findByRestaurantId(restaurantId);
        Restaurant restaurant = restaurantRepository.findById(restaurantId).
                orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));
        if (reviews.isEmpty()) {
            restaurant.setAverageRating(0.0);
            restaurant.setTotalReviews(0);
            restaurantRepository.save(restaurant);
            return;
        }

        double averageRating = reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);

        int totalReviews = reviews.size();

        restaurant.setAverageRating(Math.round(averageRating * 10.0) / 10.0);
        restaurant.setTotalReviews(totalReviews);
        restaurantRepository.save(restaurant);
    }

    @Override
    @Transactional
    public ReviewDto editReview(Long reviewId, Long userId, CreateReviewRequest request) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));
        if (!review.getCustomer().getId().equals(userId)) {
            throw new UnauthorizedAccessException("Not your review");
        }
        review.setRating(request.getRating());
        review.setComment(request.getComment());

        Review updatedReview = reviewRepository.save(review);
        updateRestaurantRating(review.getRestaurant().getId());
        return conversionToDto(updatedReview);
    }

    @Override
    public List<ReviewDto> getReviewsByRestaurantId(Long restaurantId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("reviewDate").descending());
        Page<Review> reviews = reviewRepository.findByRestaurantId(restaurantId, pageable);
        return reviews.stream()
                .map(this::conversionToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReviewDto> getUserReviews(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("reviewDate").descending());
        Page<Review> reviews = reviewRepository.findByCustomerId(userId, pageable);
        return reviews.stream()
                .map(this::conversionToDto)
                .collect(Collectors.toList());
    }

    @Override
    public ReviewDto getReviewByOrderId(Long orderId, Long userId) {
        Optional<Review> review = reviewRepository.findByOrderIdAndCustomerId(orderId, userId);
        return review.map(this::conversionToDto).orElse(null);
    }

    @Override
    @Transactional
    public void deleteReview(Long reviewId, Long userId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));
        if (!review.getCustomer().getId().equals(userId)) {
            throw new UnauthorizedAccessException("Not your review");
        }
        reviewRepository.delete(review);

        Order order = review.getOrder();
        order.setReviewed(false);
        order.setReviewable(true);
        orderRepository.save(order);

        updateRestaurantRating(review.getRestaurant().getId());

    }

    @Override
    public ReviewDto conversionToDto(Review review) {
        ReviewDto dto = modelMapper.map(review, ReviewDto.class);

        if (review.getOrder() != null) {
            dto.setOrderId(review.getOrder().getId());
            String itemsSummary = review.getOrder().getItems().stream()
                    .map(item -> item.getFood().getName())
                    .limit(3)
                    .collect(Collectors.joining(", "));
            if (review.getOrder().getItems().size() > 3) {
                itemsSummary += "...";
            }
            dto.setOrderItems(itemsSummary);
        }
        return dto;
    }
}
