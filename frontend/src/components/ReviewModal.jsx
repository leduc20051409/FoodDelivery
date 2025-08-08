import React, { useState } from 'react';
import { X, Star } from 'lucide-react';

const ReviewModal = ({ open, onClose, order, restaurant, onSubmit, existingReview = null }) => {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState(existingReview?.comment || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!existingReview;

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    try {
      const reviewData = {
        orderId: order.id,
        restaurantId: restaurant.id,
        rating,
        comment: review,
        isEditing,
        reviewId: existingReview?.id,
        // Add any other fields your API expects
      };
      
      // TODO: Replace with your actual API call
      await onSubmit(reviewData);
      
      // Reset form
      setRating(0);
      setReview('');
      onClose();
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setRating(0);
    setHoverRating(0);
    setReview('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1f1f1f] rounded-lg border border-gray-700 w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-gray-200">
            {isEditing ? 'Edit Review' : 'Rate & Review'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-200 p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-4">
          {/* Restaurant Info */}
          <div className="mb-4">
            <p className="text-gray-200 font-medium">{restaurant?.name}</p>
            <p className="text-gray-400 text-sm">Order #{order.id}</p>
          </div>

          {/* Order Items Preview */}
          <div className="mb-4">
            <p className="text-gray-200 text-sm font-medium mb-2">Order Items:</p>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {order.items?.map((item, index) => (
                <div key={item.id || index} className="flex items-center bg-[#2a2a2a] rounded-lg p-2 min-w-0">
                  <img
                    src={item.food?.images?.[0] || '/placeholder-food.jpg'}
                    alt={item.food?.name || 'Food item'}
                    className="w-12 h-12 object-cover rounded flex-shrink-0"
                  />
                  <div className="ml-2 min-w-0 flex-1">
                    <p className="text-gray-200 text-xs font-medium truncate">
                      {item.food?.name || 'Food item'}
                    </p>
                    <p className="text-gray-400 text-xs">x{item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Star Rating */}
          <div className="mb-4">
            <label className="block text-gray-200 text-sm font-medium mb-2">
              Your Rating *
            </label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 focus:outline-none"
                >
                  <Star
                    size={24}
                    className={`${
                      star <= (hoverRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-400'
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {rating === 0 && 'Please select a rating'}
              {rating === 1 && 'Poor'}
              {rating === 2 && 'Fair'}
              {rating === 3 && 'Good'}
              {rating === 4 && 'Very Good'}
              {rating === 5 && 'Excellent'}
            </p>
          </div>

          {/* Review Text */}
          <div className="mb-6">
            <label className="block text-gray-200 text-sm font-medium mb-2">
              Your Review (Optional)
            </label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share your experience with this restaurant..."
              className="w-full p-3 bg-[#2a2a2a] border border-gray-600 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:border-orange-500 resize-none"
              rows="4"
              maxLength="500"
            />
            <p className="text-xs text-gray-400 mt-1">
              {review.length}/500 characters
            </p>
          </div>

          {/* Buttons */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-500 text-gray-400 rounded-lg hover:bg-gray-600 hover:text-white transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={rating === 0 || isSubmitting}
              className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Submitting...' : (isEditing ? 'Update Review' : 'Submit Review')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;