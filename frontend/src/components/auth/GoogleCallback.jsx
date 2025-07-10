import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginWithGoogle } from '../../State/Customer/Authentication/Action';


const GoogleCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const code = searchParams.get('code');
        const error = searchParams.get('error');

        if (error) {
            console.error('Google OAuth error:', error);
            navigate('/account/login?error=oauth_failed');
            return;
        }

        if (code) {
            const redirectUri = 'http://localhost:5173/login/oauth2/code/google';
            
            dispatch(loginWithGoogle({ 
                code, 
                redirectUri, 
                navigate 
            }));
        } else {
            navigate('/account/login?error=no_code');
        }
    }, [searchParams, navigate, dispatch]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Authenticating with Google...</p>
            </div>
        </div>
    );
};

export default GoogleCallback;