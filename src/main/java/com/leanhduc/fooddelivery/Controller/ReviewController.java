package com.leanhduc.fooddelivery.Controller;

import com.leanhduc.fooddelivery.Model.User;
import com.leanhduc.fooddelivery.RequestDto.CreateReviewRequest;
import com.leanhduc.fooddelivery.Response.MessageResponse;
import com.leanhduc.fooddelivery.ResponseDto.ReviewDto;
import com.leanhduc.fooddelivery.Service.Review.IReviewService;
import com.leanhduc.fooddelivery.Service.User.IUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ReviewController {
    private final IUserService userService;
    private final IReviewService reviewService;

    @PostMapping ("/api/reviews/create")
    public ResponseEntity<ReviewDto> createReview(
            @RequestParam Long orderId,
            @Valid @RequestBody CreateReviewRequest request,
            @RequestHeader ("Authorization") String jwtToken) {
        User user = userService.findByJwtToken(jwtToken);
        return ResponseEntity.ok(reviewService.createReview(user.getId(), orderId, request));
    }

    @PutMapping ("/api/reviews/edit")
    public ResponseEntity<ReviewDto> editReview(
            @RequestParam Long reviewId,
            @Valid @RequestBody CreateReviewRequest request,
            @RequestHeader ("Authorization") String jwtToken) {
        User user = userService.findByJwtToken(jwtToken);
        return ResponseEntity.ok(reviewService.editReview(reviewId, user.getId(), request));
    }

    @GetMapping ("/restaurant/{restaurantId}/reviews")
    public ResponseEntity<List<ReviewDto>> getReviewsByRestaurantId(
            @PathVariable Long restaurantId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(reviewService.getReviewsByRestaurantId(restaurantId, page, size));
    }

    @GetMapping ("/user/{userId}/reviews")
    public ResponseEntity<List<ReviewDto>> getUserReviews(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(reviewService.getUserReviews(userId, page, size));
    }

    @GetMapping("/api/reviews/order/{orderId}")
    public ResponseEntity<ReviewDto> getReviewByOrderId(
            @PathVariable Long orderId,
            @RequestHeader("Authorization") String jwtToken) {
        User user = userService.findByJwtToken(jwtToken);
        ReviewDto review = reviewService.getReviewByOrderId(orderId, user.getId());
        return ResponseEntity.ok(review);
    }

    @DeleteMapping ("/api/reviews/delete/{reviewId}")
    public ResponseEntity<MessageResponse> deleteReview(
            @PathVariable Long reviewId,
            @RequestHeader ("Authorization") String jwtToken) {
        User user = userService.findByJwtToken(jwtToken);
        reviewService.deleteReview(reviewId, user.getId());
        return ResponseEntity.ok(new MessageResponse("Review deleted successfully"));
    }
}
