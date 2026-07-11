import { create } from "zustand";
import api from "../api/axios.js";

const useAuthStore = create((set) => ({
    user: null,
    accessToken: null,
    isAuthenticated: false,
    isCheckingAuth: true,
    loading: false,
    error: null,

    checkAuth: async () => {
        try {
            set({ isCheckingAuth: true, error: null });
            const refreshResponse = await api.get("/auth/refresh-token");
            const accessToken = refreshResponse.data.accessToken;

            set({ accessToken });

            const profileResponse = await api.get("/auth/me");

            set({
                user: profileResponse.data.user,
                isAuthenticated: true,
                isCheckingAuth: false,
            });
        } catch (error) {
            set({
                user: null,
                accessToken: null,
                isAuthenticated: false,
                isCheckingAuth: false,
            });
        }
    },
    
    login  : async (email,password)=>{
        try{
            set({
                loading:true,
                error:null,
            });

            const response = await api.post("/auth/login",{
                email,password,
            });

            set({
                user:response.data.user,
                accessToken : response.data.accessToken,
                isAuthenticated : true,
                loading : false,
            });
        } catch (error) {
            set({
                loading: false,
                error:
                error.response?.data?.message ||
                "Login failed",
            });
        }
    },
    register: async (userData) => {
        try {

            set({
                loading: true,
                error: null
            });

            await api.post(
                "/auth/register",
                userData
            );

            set({
                loading: false
            });

        } catch (error) {

            set({
                loading: false,
                error:
                    error.response?.data?.message ||
                    "Registration failed"
            });

        }
    },
    logout: () => {

        set({

            user: null,

            accessToken: null,

            isAuthenticated: false,

            error: null,

        });

    },
    clearError: () => {

        set({
            error: null
        });

    },
    
}));

export default useAuthStore;