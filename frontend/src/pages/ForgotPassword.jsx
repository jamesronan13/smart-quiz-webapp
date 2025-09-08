import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import EmailIcon from "../assets/email.svg";
import IconBackground from "./IconBackground";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setEmail(e.target.value);
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await sendPasswordResetEmail(auth, email);
      console.log("Password reset email sent successfully");
      setSuccess(true);
    } catch (error) {
      console.error("Password reset error:", error);
      let errorMessage = "Failed to send reset email. Please try again.";
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = "No account found with this email address.";
          break;
        case 'auth/invalid-email':
          errorMessage = "Invalid email address.";
          break;
        case 'auth/too-many-requests':
          errorMessage = "Too many requests. Please try again later.";
          break;
        default:
          errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => {
    navigate("/");
  };

  if (success) {
    return (
      <div className="relative h-screen w-screen flex flex-col justify-center items-center">

        <IconBackground className="absolute -z-0" />

        <div className="bg-three md:p-20 p-8 rounded-3xl shadow-xl flex flex-col justify-center items-center max-w-md absolute z-1">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h1 className="font-poppins text-nine text-3xl md:text-4xl font-bold mb-4">Email Sent!</h1>
            <p className="font-poppins text-nine text-sm md:text-base mb-6 leading-relaxed">
              We've sent a password reset link to <strong>{email}</strong>. 
              Please check your email and follow the instructions to reset your password.
            </p>
            <p className="font-poppins text-nine text-xs md:text-sm mb-6">
              Don't see the email? Check your spam folder or try again.
            </p>
          </div>

          <div className="flex flex-col justify-center items-center w-64">
            <button
              onClick={goToLogin}
              className="bg-seven text-one font-bold font-poppins w-full py-2 rounded-lg hover:bg-blue-600 transition-colors mb-4"
            >
              Back to Login
            </button>

            <button
              onClick={() => {
                setSuccess(false);
                setEmail("");
              }}
              className="bg-one text-nine font-bold font-poppins w-full py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Send Another Email
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen flex flex-col justify-center items-center">

      <IconBackground className="absolute -z-0" />

      <div className="bg-three md:p-20 p-8 rounded-3xl shadow-xl flex flex-col justify-center items-center absolute z-1">
        <h1 className="font-poppins text-nine text-4xl md:text-5xl font-bold mb-2">Reset Password</h1>
        <p className="font-poppins text-nine text-md md:text-xl mb-6 text-center">
          Enter your registered email address and we'll send you a reset link
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 w-full text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleResetPassword}>
          <div className="relative w-64 mb-8">
            {/* Icon */}
            <img src={EmailIcon} alt="email icon" className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 opacity-50" />

            {/* Input */}
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleInputChange}
              className="font-poppins pl-10 pr-3 py-2 border border-gray-300 rounded-lg w-full  
                        focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex flex-col justify-center items-center w-64">
            <button
              type="submit"
              disabled={loading}
              className="bg-seven text-one font-bold font-poppins w-full py-2 rounded-lg hover:bg-blue-600 transition-colors mb-4 disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            <button
              type="button"
              onClick={goToLogin}
              className="bg-one text-nine font-bold font-poppins w-full py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Back to Login
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}