import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import IconBackground from "../pages/IconBackground";
import EmailIcon from "../assets/email.svg";
import PasswordIcon from "../assets/lock.svg";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      console.log("User logged in successfully");
      navigate("/home");
    } catch (error) {
      console.error("Login error:", error);
      let errorMessage = "Login failed. Please try again.";
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = "No account found with this email.";
          break;
        case 'auth/wrong-password':
          errorMessage = "Incorrect password.";
          break;
        case 'auth/invalid-email':
          errorMessage = "Invalid email address.";
          break;
        case 'auth/too-many-requests':
          errorMessage = "Too many failed attempts. Please try again later.";
          break;
        default:
          errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const goToRegister = () => {
    navigate("/register");
  };

  const goToForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <div className="relative h-screen w-screen  flex flex-col justify-center items-center">
      
      <IconBackground className="absolute -z-0" />

      <div className="bg-three md:p-20 p-8 rounded-3xl shadow-xl flex flex-col justify-center items-center absolute z-1">
        <p className="font-poppins font-bold text-nine text-lg md:text-xl">Welcome to</p>
        <h1 className="font-poppins text-nine text-4xl md:text-5xl font-bold mb-6">Study Quiz</h1>
        <p className="font-poppins text-nine text-md md:text-xl mb-4">Sign in to your account</p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 w-full text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="relative w-64 mb-6">
            {/* Icon */}
            <img src={EmailIcon} alt="email icon" className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 opacity-50" />

            {/* Input */}
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="font-poppins pl-10 pr-3 py-2 border border-gray-300 rounded-lg w-full  
                        focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="relative w-64">
            {/* Icon */}
            <img src={PasswordIcon} alt="password icon" className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 opacity-50" />

            {/* Input */}
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className="font-poppins pl-10 pr-3 py-2 border border-gray-300 rounded-lg w-full  
                        focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex flex-row items-center mb-8 w-full self-start">
            <input
              type="checkbox"
              id="showPassword"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
              className="mt-4 mr-2"
            />
            <label htmlFor="showPassword" className="font-poppins text-nine text-sm mt-4">
              Show Password
            </label>
          </div>

          <div className="flex flex-col justify-center items-center w-64">
            <button
              type="submit"
              disabled={loading}
              className="bg-seven text-one font-bold font-poppins w-full py-2 rounded-lg hover:bg-blue-600 transition-colors mb-4 disabled:opacity-50"
            >
              {loading ? "Logging In..." : "Log In"}
            </button>

            <button
              type="button"
              onClick={goToRegister}
              className="bg-one text-nine font-bold font-poppins w-full py-2 rounded-lg hover:bg-gray-200 transition-colors mb-6"
            >
              Sign Up
            </button>

            <p 
              onClick={goToForgotPassword}
              className="font-poppins text-nine text-sm hover:underline cursor-pointer"
            >
              Forgot Password?
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}