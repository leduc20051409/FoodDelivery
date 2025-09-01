import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const ReviewsSection = () => {
  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviews, setReviews] = useState([]);

  // Mock data - replace with actual Redux state
  const mockReviews = [
    {
      id: 1,
      customerName: "Nguyen Van A",
      rating: 5,
      comment: "Amazing food! The pizza was perfectly crispy and the delivery was super fast. Highly recommend this restaurant!",
      reviewDate: "2024-01-15T10:30:00Z",
      orderId: 12345,
      orderItems: "Margherita Pizza, Garlic Bread, Coke",
      orderDate: "2024-01-14T19:45:00Z",
      restaurantName: "Italian Junk Food",
      customerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1"
    },
    {
      id: 2,
      customerName: "Tran Thi B",
      rating: 4,
      comment: "Great taste and quality ingredients. The burger was juicy and fresh. Will definitely order again!",
      reviewDate: "2024-01-14T14:20:00Z",
      orderId: 12344,
      orderItems: "Cheese Burger, French Fries, Sprite",
      orderDate: "2024-01-13T20:15:00Z",
      restaurantName: "Le Jardin Secret",
      customerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2"
    },
    {
      id: 3,
      customerName: "Le Van C",
      rating: 5,
      comment: "Excellent service and delicious food. The sandwich was packed with flavor and arrived hot!",
      reviewDate: "2024-01-13T16:45:00Z",
      orderId: 12343,
      orderItems: "Club Sandwich, Potato Chips, Orange Juice",
      orderDate: "2024-01-12T12:30:00Z",
      restaurantName: "Sandwich Corner",
      customerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3"
    },
    {
      id: 4,
      customerName: "Pham Thi D",
      rating: 4,
      comment: "Very satisfied with the quality. Fresh ingredients and great presentation. The pizza was delicious!",
      reviewDate: "2024-01-12T11:20:00Z",
      orderId: 12342,
      orderItems: "Pepperoni Pizza, Caesar Salad, Water",
      orderDate: "2024-01-11T18:00:00Z",
      restaurantName: "Pizza Palace",
      customerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=4"
    },
    {
      id: 5,
      customerName: "Hoang Van E",
      rating: 5,
      comment: "Outstanding experience! The food was exceptional and the delivery was prompt. Highly recommended!",
      reviewDate: "2024-01-11T09:15:00Z",
      orderId: 12341,
      orderItems: "Grilled Chicken, Rice, Vegetables",
      orderDate: "2024-01-10T19:30:00Z",
      restaurantName: "Healthy Bites",
      customerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=5"
    }
  ];

  useEffect(() => {
    setReviews(mockReviews);
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`text-lg ${index < rating ? 'text-yellow-400' : 'text-gray-600'
          }`}
      >
        ⭐
      </span>
    ));
  };

  const nextReview = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === reviews.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevReview = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? reviews.length - 1 : prevIndex - 1
    );
  };

  const getVisibleReviews = () => {
    const visibleCount = 3;
    const result = [];
    for (let i = 0; i < visibleCount; i++) {
      const index = (currentIndex + i) % reviews.length;
      result.push(reviews[index]);
    }
    return result;
  };

  if (reviews.length === 0) {
    return null;
  }

  return (
    <section className="px-5 lg:px-20 pt-16 pb-10 bg-gradient-to-b from-gray-900 to-black">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl lg:text-3xl font-semibold text-gray-300">
          What Our Customers Say
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={prevReview}
            className="p-2 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-300"
          >
            ‹
          </button>
          <button
            onClick={nextReview}
            className="p-2 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-300"
          >
            ›
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {getVisibleReviews().map((review, index) => (
          <div
            key={`${review.id}-${currentIndex}-${index}`}
            className="bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105 border border-gray-700"
          >
            {/* Customer Info */}
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
                <img
                  src={review.customerAvatar}
                  alt={review.customerName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${review.customerName}&background=374151&color=fff`;
                  }}
                />
              </div>
              <div>
                <h4 className="text-white font-medium">{review.customerName}</h4>
                <p className="text-gray-400 text-sm">{formatDate(review.reviewDate)}</p>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-1 mb-3">
              {renderStars(review.rating)}
              <span className="text-gray-300 text-sm ml-2">({review.rating}/5)</span>
            </div>

            {/* Review Comment */}
            <p className="text-gray-300 mb-4 leading-relaxed">
              "{review.comment}"
            </p>

            {/* Order Details */}
            <div className="border-t border-gray-700 pt-3">
              <div className="flex justify-between items-start text-xs text-gray-400 mb-1">
                <span>Order #{review.orderId}</span>
                <span>{formatDate(review.orderDate)}</span>
              </div>
              <p className="text-xs text-gray-500 truncate">
                <span className="text-pink-400 font-medium">{review.restaurantName}</span>
                <br />
                {review.orderItems}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center space-x-2 mt-8">
        {reviews.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex
                ? 'bg-pink-500 scale-125'
                : 'bg-gray-600 hover:bg-gray-500'
              }`}
          />
        ))}
      </div>
    </section>
  );
};

export default ReviewsSection;