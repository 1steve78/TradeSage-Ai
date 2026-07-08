import { create } from "zustand";

const useAuthStore = create((set) => ({
    loading : false,
    error : null,
    data: [],
    
    setLoading: (loading) => set({ loading }),
    setError : (error) =>set({error}),
    setData : (data) =>set({data}),
    
    reset :()=>
        set({
            loading: false,
            error:null,
            data:[],
        }),
}));

export default useAuthStore;