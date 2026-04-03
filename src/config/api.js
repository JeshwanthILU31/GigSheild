const API_BASE_URL = 'https://gigsheild-i53f.onrender.com';

const ENDPOINTS = {
    AUTH: {
        REGISTER: '/api/auth/register',
        LOGIN: '/api/auth/login',
        VERIFY_OTP: '/api/auth/verify-otp',
    },
    POLICIES: {
        CREATE: '/api/policies/create',
        ME: '/api/policies/me',
        HISTORY: '/api/policies/history',
        PAUSE: '/api/policies/pause',
    },
    CLAIMS: {
        TRIGGER: '/api/claims/trigger',
        ME: '/api/claims/me',
        DETAILS: (id) => `/api/claims/${id}`,
    },
    USER: {
        PROFILE: '/api/user/profile',
    },
};

export { API_BASE_URL, ENDPOINTS };
