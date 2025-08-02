import React from 'react';
import { Typography } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const ReviewItem = ({ review }) => {
    const formattedDate = new Date(review.reviewDate).toLocaleDateString('vi-VN');
    return (
        <div className="p-4 border rounded-md shadow-sm">
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                    <AccountCircleIcon color="primary" />
                    <Typography variant="h6">{review.customerName}</Typography>
                </div>
                <Typography variant="body2" color="textSecondary">{formattedDate}</Typography>
            </div>
            <div className="mb-2 text-sm text-gray-500">
                <Typography variant="body2">
                    Order #{review.orderId}
                </Typography>
                <Typography variant="body2">
                    Items: {review.orderItems}
                </Typography>
            </div>
            <div className="flex items-center mb-2 text-yellow-500">
                {"⭐".repeat(review.rating)}
                {"☆".repeat(5 - review.rating)}
            </div>
            <Typography variant="body1">{review.comment}</Typography>
        </div>
    );
};

export default ReviewItem;
