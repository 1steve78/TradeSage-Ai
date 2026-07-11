import { Navigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isCheckingAuth } = useAuthStore();

    if (isCheckingAuth) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-slate-950 text-white">
                <p className="text-gray-400">Verifying session...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/auth" replace />
    }
    return children;

}
export default ProtectedRoute;