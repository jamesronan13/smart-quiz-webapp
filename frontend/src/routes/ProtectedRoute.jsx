import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/firebaseConfig";

export default function ProtectedRoute({ children }) {
  const [user, loading, error] = useAuthState(auth);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="h-screen w-screen bg-one flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-seven"></div>
      </div>
    );
  }

  // Show error if there's an authentication error
  if (error) {
    return (
      <div className="h-screen w-screen bg-one flex justify-center items-center">
        <div className="text-red-500 font-poppins">Authentication Error: {error.message}</div>
      </div>
    );
  }

  // Redirect to login if user is not authenticated
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Render children if user is authenticated
  return children;
}