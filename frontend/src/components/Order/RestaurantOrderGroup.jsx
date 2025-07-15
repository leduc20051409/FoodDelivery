import React, { use, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const formatPrice = n =>
  n.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

const RestaurantOrderGroup = ({ order, items }) => {
  const navigate = useNavigate();
  // Get restaurant info from first item
  const restaurant = items[0]?.food?.restaurant;

  // Map order status to display text
  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING': return 'Pending Payment';
      case 'CONFIRMED': return 'Confirmed';
      case 'PREPARING': return 'Preparing';
      case 'OUT_FOR_DELIVERY': return 'Out for Delivery';
      case 'DELIVERED': return 'Delivered';
      case 'CANCELLED': return 'CANCELLED';
      case 'COMPLETED': return 'Completed';
      default: return status;
    }
  };

  // Map order status to CSS classes
  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'text-yellow-500';
      case 'CONFIRMED': return 'text-blue-500';
      case 'PREPARING': return 'text-purple-500';
      case 'OUT_FOR_DELIVERY': return 'text-orange-500';
      case 'DELIVERED': return 'text-green-500';
      case 'CANCELLED': return 'text-red-500';
      case 'COMPLETED': return 'text-green-400';
      default: return 'text-gray-500';
    }
  };

  const formatOrderDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  useEffect(() => {
    console.log("Restaurant Order Group: ", order);
    console.log("Items: ", items);
  }, []);

  return (
    <div className="bg-[#1f1f1f] rounded border border-gray-700 overflow-hidden w-full">
      {/* Restaurant Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-700 bg-[#2a2a2a]">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            {/* Check if restaurant is in favorites */}
            {order.customer?.favorites?.some(fav => fav.restaurant?.id === restaurant?.id) && (
              <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">
                Favorite
              </span>
            )}
            <span className="text-gray-200 font-semibold text-base">
              {restaurant?.name || 'Restaurant'}
            </span>
          </div>
          <div className="text-gray-400 text-xs">
            Order #{order.id} • {formatOrderDate(order.creatAt)}
          </div>
        </div>
        <div className="flex space-x-2 items-center">
          <button className="text-green-400 text-xs border border-green-400 px-2 py-1 rounded hover:bg-green-600 hover:text-white">
            Chat
          </button>
          <button
            onClick={() => navigate(`/restaurant/${items[0].food.restaurant?.address?.city}/${items[0].food.restaurant?.name}/${items[0].food.restaurant?.id}`)}
            className="text-gray-400 text-xs border border-gray-500 px-2 py-1 rounded hover:bg-gray-600 hover:text-white">
            View Shop
          </button>
          <span className={`text-xs font-semibold ${getStatusColor(order.orderStatus)}`}>
            {getStatusText(order.orderStatus)}
          </span>
        </div>
      </div>

      {/* Items List */}
      <div className="divide-y divide-gray-700">
        {items.map((item, index) => (
          <div key={item.id} className="flex px-4 py-3">
            <img
              src={item.food?.images?.[0] || '/placeholder-food.jpg'}
              alt={item.food?.name || 'Food item'}
              className="w-20 h-20 object-cover rounded flex-shrink-0"
            />
            <div className="flex flex-col justify-between ml-4 flex-1">
              <div>
                <p className="text-gray-200 text-sm font-medium">
                  {item.food?.name || 'Food item'}
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  Category: {item.food?.category?.name || 'N/A'}
                </p>
                {item.ingredients && item.ingredients.length > 0 && (
                  <p className="text-gray-400 text-xs">
                    Ingredients: {item.ingredients.slice(0, 3).map(ing => ing.name).join(', ')}
                    {item.ingredients.length > 3 && '...'}
                  </p>
                )}
                <p className="text-gray-400 text-xs">x{item.quantity}</p>
              </div>
              <p className="text-orange-400 font-bold text-sm mt-2">
                {formatPrice(item.totalPrice)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary & Actions */}
      <div className="px-4 py-3 border-t border-gray-700 bg-[#252525]">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm">
                Total ({order.totalItem} items):{" "}
                <span className="text-orange-400 font-bold text-base">
                  {formatPrice(order.totalPrice)}
                </span>
              </span>
              <span className="text-gray-400 text-xs">
                Payment: {order.paymentMethod === 'CASH_ON_DELIVERY' ? 'Cash on Delivery' : order.paymentMethod}
              </span>
            </div>
            {order.deliveryAddress && (
              <span className="text-gray-500 text-xs mt-1">
                Delivery to: {order.deliveryAddress.streetAddress}, {order.deliveryAddress.city}
              </span>
            )}
          </div>
          <div className="flex space-x-2">
            {order.orderStatus === "CANCELLED" ? (
              <>
                <button className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-3 py-2 rounded">
                  Buy Again
                </button>
                <button className="border border-gray-500 text-gray-400 text-xs px-3 py-2 rounded hover:bg-gray-600 hover:text-white">
                  View Cancel Details
                </button>
                <button className="border border-gray-500 text-gray-400 text-xs px-3 py-2 rounded hover:bg-gray-600 hover:text-white">
                  Contact Seller
                </button>
              </>
            ) : order.orderStatus === "DELIVERED" || order.orderStatus === "COMPLETED" ? (
              <>
                <button className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-3 py-2 rounded">
                  Buy Again
                </button>
                <button className="border border-gray-500 text-gray-400 text-xs px-3 py-2 rounded hover:bg-gray-600 hover:text-white">
                  Rate & Review
                </button>
                <button className="border border-gray-500 text-gray-400 text-xs px-3 py-2 rounded hover:bg-gray-600 hover:text-white">
                  Contact Seller
                </button>
              </>
            ) : (
              <>
                <button className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-3 py-2 rounded">
                  Contact Seller
                </button>
                {order.cancellable && (
                  <button className="border border-red-500 text-red-400 text-xs px-3 py-2 rounded hover:bg-red-600 hover:text-white">
                    Cancel Order
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RestaurantOrderGroup