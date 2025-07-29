import React, { useEffect, useState } from 'react'
import RestaurantOrderGroup from './Order/RestaurantOrderGroup'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getUsersOrders } from '../State/Customer/Orders/Action';

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'PENDING', label: 'Pending Payment' },
  { key: 'CONFIRMED', label: 'Confirmed' },
  { key: 'PREPARING', label: 'Preparing' },
  { key: 'OUT_FOR_DELIVERY', label: 'Shipping' },
  { key: 'DELIVERED', label: 'To Receive' },
  { key: 'COMPLETED', label: 'Completed' },
  { key: 'CANCELLED', label: 'Cancelled' },
];

const Orders = () => {
  const { cart, auth, order } = useSelector(store => store);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const jwt = localStorage.getItem("token");
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);

  // Use actual orders from Redux store instead of mock data
  const ordersList = order.orders || [];

  useEffect(() => {
    if (jwt) {
      setLoading(true);
      dispatch(getUsersOrders(jwt)).finally(() => {
        setLoading(false);
      });
    }
  }, [auth.jwt, dispatch, jwt]);

  const filtered = ordersList.filter(o =>
    activeTab === 'all' ? true : o.orderStatus === activeTab
  );

  // Group orders by restaurant for better organization
  const groupOrdersByRestaurant = (orders) => {
    const grouped = {};
    orders.forEach(order => {
      // For each order, group items by restaurant
      const restaurantGroups = {};
      order.items.forEach(item => {
        const restaurantId = item.food?.restaurant?.id || 'unknown';
        if (!restaurantGroups[restaurantId]) {
          restaurantGroups[restaurantId] = [];
        }
        restaurantGroups[restaurantId].push(item);
      });
      
      // Create separate order entries for each restaurant
      Object.keys(restaurantGroups).forEach(restaurantId => {
        const key = `${order.id}-${restaurantId}`;
        grouped[key] = {
          order,
          items: restaurantGroups[restaurantId]
        };
      });
    });
    return Object.values(grouped);
  };

  const groupedOrders = groupOrdersByRestaurant(filtered);

  if (loading) {
    return (
      <div className="w-full flex flex-col items-center">
        <h1 className="text-xl font-semibold py-6">My Orders</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center">
      <h1 className="text-xl font-semibold py-6">My Orders</h1>

      {/* Tabs */}
      <div className="sticky top-20 z-10 bg-[#121212]">
        <div className="flex justify-center">
          <div className="flex space-x-8 border-b border-gray-700 mb-6 px-4 py-3 overflow-x-auto">
            {TABS.map(tab => {
              const count = ordersList.filter(o =>
                tab.key === "all" ? true : o.orderStatus === tab.key
              ).length;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`
                    text-lg font-medium pb-4 px-3 whitespace-nowrap
                    ${activeTab === tab.key
                      ? "border-b-4 border-orange-500 text-orange-400"
                      : "text-gray-400 hover:text-orange-400"}
                  `}
                >
                  {tab.label} {count > 0 && <span>({count})</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="w-full max-w-5xl mx-auto px-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-gray-400 text-lg mb-4">
              {activeTab === 'all' ? 'No orders found' : `No ${TABS.find(tab => tab.key === activeTab)?.label.toLowerCase()} orders`}
            </div>
            <button 
              onClick={() => navigate('/')}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-5 w-full">
            {groupedOrders.map(({ order, items }, index) =>
              <RestaurantOrderGroup 
                key={`${order.id}-${items[0]?.food?.restaurant?.id || index}`} 
                order={order} 
                items={items} 
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders