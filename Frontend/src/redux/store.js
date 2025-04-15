import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/redux/features/auth/authSlice';
import { checkToken } from '@/redux/features/auth/authSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat((store) => (next) => (action) => {
            // Kiểm tra token trước các action liên quan đến auth
            // Bỏ qua login, register, refresh, logout, và checkToken
            if (
                action.type.startsWith('auth/') &&
                !action.type.includes('login') &&
                !action.type.includes('register') &&
                !action.type.includes('refresh') &&
                !action.type.includes('logout') &&
                !action.type.includes('checkToken')
            ) {
                store.dispatch(checkToken());
            }
            return next(action);
        }),
});

export default store;
