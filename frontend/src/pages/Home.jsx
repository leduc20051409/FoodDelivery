import React, { useEffect, useState } from 'react';
import '../css/Home.css';
import MultiItemCarousel from '../components/MultiItemCarousel';
import RestaurantCard from '../components/RestaurantCard';
import RestaurentDetail from './RestaurentDetail';
import Auth from '../components/auth/Auth';
import { useDispatch, useSelector } from 'react-redux';
import { getAllRestaurantsAction } from '../components/State/Restaurant/Action';
import { store } from '../components/State/Store';
import { Pagination, Stack } from '@mui/material';

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

    const handlePageChange = (event, value) => {
        setCurrentPage(value); // Cập nhật trang hiện tại
    };

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
                <div className="flex justify-center items-center mt-6">
                    <Stack spacing={2}>
                        {/* Sử dụng component Pagination của MUI thay vì các nút button thủ công */}
                        <Pagination
                            count={totalPages} // Tổng số trang
                            page={currentPage} // Trang hiện tại
                            onChange={handlePageChange} // Hàm xử lý khi thay đổi trang
                            variant="outlined" // Kiểu viền
                            shape="rounded" // Hình dạng nút bo góc
                            sx={{
                                // Tùy chỉnh kiểu để phù hợp với giao diện
                                '& .MuiPaginationItem-root': {
                                    color: '#374151', // Màu chữ của các nút
                                    borderColor: '#d1d5db', // Màu viền
                                },
                                '& .Mui-selected': {
                                    backgroundColor: '#1f2937', // Màu nền khi nút được chọn
                                    color: '#ffffff', // Màu chữ khi được chọn
                                    '&:hover': {
                                        backgroundColor: '#374151', // Màu nền khi hover
                                    },
                                },
                            }}
                        />
                    </Stack>
                </div>
            </section>

            <section className='px-5'>

            </section>
            <Auth />
        </div>
    )
}

export default Home
