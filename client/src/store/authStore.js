import { create } from "zustand";
import api from "../api/axios.js";

const useAuthStore = create((set) => ({
    user: null,
    accessToken: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    
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