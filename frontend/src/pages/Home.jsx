import React, { useEffect, useState } from 'react';
import '../css/Home.css';
import MultiItemCarousel from '../components/MultiItemCarousel';
import RestaurantCard from '../components/RestaurantCard';
import RestaurentDetail from './RestaurentDetail';
import Auth from '../components/auth/Auth';
import { useDispatch, useSelector } from 'react-redux';
import { getAllRestaurantsAction } from '../components/State/Restaurant/Action';
import { store } from '../components/State/Store';

const ITEMS_PER_PAGE = 8;

const Home = () => {
    const dispatch = useDispatch();
    const jwt = localStorage.getItem("token");
    const { restaurant } = useSelector(store => store);
    const [currentPage, setCurrentPage] = useState(1);
    useEffect(() => {
        dispatch(getAllRestaurantsAction());
    }, []);

    const totalRestaurants = restaurant?.restaurants || [];
    const totalPages = Math.ceil(totalRestaurants.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentRestaurants = totalRestaurants.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return (
        <div className='pb-10'>
            <section className='banner -z-50 relative flex flex-col justify-center items-center'>
                <div className='w-[50vw] z-10 text-center'>
                    <p className='text-2xl lg:text-6xl font-bold z-10 py-5'>Duc Food</p>
                    <p className='z-10 text-gray-300 text-xl lg:text-4xl'>Taste the Convenience: Food, Fast and Delivered.</p>
                </div>
                <div className="cover absolute top-0 left-0 right-0 "></div>
                <div className="fadout"></div>
            </section>
            <section className='p-10 lg:py-10 lg:px-20'>
                <p className='text-2xl font-semibold text-gray-400 py-3 pb-10'>Top Meels</p>
                <MultiItemCarousel />
            </section>

            <section className='px-5 lg:px-20 pt-10'>
                <h1 className='text-2xl font-semibold text-gray-400 py-3'>Order From Our Handpicked Favorites</h1>

                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
                    {currentRestaurants.map((item, index) => (
                        <RestaurantCard key={index} item={item} />
                    ))}
                </div>

                {/* Pagination Controls */}
                <div className='flex justify-center items-center mt-6 gap-3'>
                    <div className='flex justify-center items-center mt-6 gap-2'>
                        {/* Nút mũi tên trái */}
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className={`px-3 py-1 rounded-full border font-medium ${currentPage === 1
                                    ? 'text-gray-400 cursor-not-allowed bg-gray-100'
                                    : 'text-gray-800 bg-white hover:bg-gray-200'
                                }`}
                        >
                            ←
                        </button>

                        {/* Các nút số trang */}
                        {Array.from({ length: totalPages }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentPage(index + 1)}
                                className={`px-3 py-1 rounded-full border font-medium ${currentPage === index + 1
                                        ? 'bg-gray-800 text-white'
                                        : 'bg-white text-gray-800 hover:bg-gray-200'
                                    }`}
                            >
                                {index + 1}
                            </button>
                        ))}

                        {/* Nút mũi tên phải */}
                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className={`px-3 py-1 rounded-full border font-medium ${currentPage === totalPages
                                    ? 'text-gray-400 cursor-not-allowed bg-gray-100'
                                    : 'text-gray-800 bg-white hover:bg-gray-200'
                                }`}
                        >
                            →
                        </button>
                    </div>

                </div>
            </section>

            <section className='px-5'>

            </section>
            <Auth />
        </div>
    )
}

export default Home
