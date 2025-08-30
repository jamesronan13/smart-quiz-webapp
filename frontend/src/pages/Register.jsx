import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";
import EmailIcon from "../assets/email.svg";
import PasswordIcon from "../assets/lock.svg";

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthday: "",
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

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.birthday || !formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // Save additional user data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        birthday: formData.birthday,
        email: formData.email,
        createdAt: new Date().toISOString()
      });

      console.log("User registered successfully");
      navigate("/home");
    } catch (error) {
      console.error("Registration error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => {
    navigate("/");
  };

  return (
    <div className="h-screen w-screen bg-one flex flex-col justify-center items-center p-4">
      <div className="bg-three md:p-20 p-8 rounded-3xl shadow-xl flex flex-col justify-center items-center w-full max-w-md">
        <p className="font-poppins font-bold text-nine text-lg md:text-xl">Welcome to</p>
        <h1 className="font-poppins text-nine text-4xl md:text-5xl font-bold mb-6">Study Quiz</h1>
        <p className="font-poppins text-nine text-md md:text-xl mb-4">Create your account</p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 w-full text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="w-full">
          {/* First Name */}
          <div className="relative w-full mb-4">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleInputChange}
              className="font-poppins px-3 py-2 border border-gray-300 rounded-lg w-full 
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Last Name */}
          <div className="relative w-full mb-4">
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleInputChange}
              className="font-poppins px-3 py-2 border border-gray-300 rounded-lg w-full 
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Birthday */}
          <div className="relative w-full mb-4">
            <input
              type="date"
              name="birthday"
              value={formData.birthday}
              onChange={handleInputChange}
              className="font-poppins px-3 py-2 border border-gray-300 rounded-lg w-full 
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Email */}
          <div className="relative w-full mb-4">
            <img src={EmailIcon} alt="email icon" className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 opacity-50" />
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

          {/* Password */}
          <div className="relative w-full mb-4">
            <img src={PasswordIcon} alt="password icon" className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 opacity-50" />
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

          {/* Show Password Checkbox */}
          <div className="flex flex-row items-center mb-6 w-full">
            <input
              type="checkbox"
              id="showPassword"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="showPassword" className="font-poppins text-nine text-sm">
              Show Password
            </label>
          </div>

          {/* Buttons */}
          <div className="flex flex-col justify-center items-center w-full">
            <button
              type="submit"
              disabled={loading}
              className="bg-seven text-one font-bold font-poppins w-full py-2 rounded-lg hover:bg-blue-600 transition-colors mb-4 disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>

            <button
              type="button"
              onClick={goToLogin}
              className="bg-one text-nine font-bold font-poppins w-full py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Already have an account? Log In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}