import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";
import IconBackground from "./IconBackground";
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
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const navigate = useNavigate();

  // Validation functions
  const validateName = (name) => {
    if (!name.trim()) {
      return "This field is required";
    }
    if (name.trim().length < 2) {
      return "Must be at least 2 characters";
    }
    if (!/^[a-zA-Z\s'.-]+$/.test(name.trim())) {
      return "Only letters, spaces, apostrophes, and hyphens allowed";
    }
    return "";
  };

  const validateEmail = (email) => {
    if (!email.trim()) {
      return "Email is required";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const validatePassword = (password) => {
    if (!password) {
      return "Password is required";
    }
    if (password.length < 8) {
      return "Password must be at least 8 characters";
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/(?=.*\d)/.test(password)) {
      return "Password must contain at least one number";
    }
    if (!/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(password)) {
      return "Password must contain at least one special character";
    }
    return "";
  };

  const validateBirthday = (birthday) => {
    if (!birthday) {
      return "Birthday is required";
    }
    
    const birthDate = new Date(birthday);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (birthDate >= today) {
      return "Birthday cannot be in the future";
    }
    
    if (age < 13) {
      return "You must be at least 13 years old";
    }
    
    if (age > 120) {
      return "Please enter a valid birth date";
    }
    
    return "";
  };

  // Real-time validation
  const validateField = (name, value) => {
    let error = "";
    
    switch (name) {
      case "firstName":
      case "lastName":
        error = validateName(value);
        break;
      case "email":
        error = validateEmail(value);
        break;
      case "password":
        error = validatePassword(value);
        break;
      case "birthday":
        error = validateBirthday(value);
        break;
      default:
        break;
    }
    
    return error;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Real-time validation
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const validateAllFields = () => {
    const newErrors = {};
    
    newErrors.firstName = validateName(formData.firstName);
    newErrors.lastName = validateName(formData.lastName);
    newErrors.email = validateEmail(formData.email);
    newErrors.password = validatePassword(formData.password);
    newErrors.birthday = validateBirthday(formData.birthday);
    
    setErrors(newErrors);
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      password: true,
      birthday: true
    });

    return Object.values(newErrors).every(error => !error);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    if (!validateAllFields()) {
      return;
    }

    setLoading(true);

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // Save additional user data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        birthday: formData.birthday,
        email: formData.email,
        createdAt: new Date().toISOString()
      });

      console.log("User registered successfully");
      navigate("/home");
    } catch (error) {
      console.error("Registration error:", error);
      
      // Handle Firebase specific errors
      let errorMessage = "An error occurred during registration";
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = "This email address is already registered";
          break;
        case 'auth/invalid-email':
          errorMessage = "Please enter a valid email address";
          break;
        case 'auth/operation-not-allowed':
          errorMessage = "Email/password accounts are not enabled";
          break;
        case 'auth/weak-password':
          errorMessage = "Password is too weak";
          break;
        case 'auth/network-request-failed':
          errorMessage = "Network error. Please check your connection";
          break;
        default:
          errorMessage = error.message;
      }
      
      setErrors(prev => ({
        ...prev,
        submit: errorMessage
      }));
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => {
    navigate("/");
  };

  // Check if form is valid
  const isFormValid = Object.values(errors).every(error => !error) && 
                     Object.keys(formData).every(key => formData[key].trim() !== "");

  return (
    <div className="relative h-screen w-screen flex flex-col justify-center items-center p-4">

      <IconBackground className="absolute -z-0 "/>

      <div className="bg-three md:p-20 p-8 rounded-3xl shadow-xl flex flex-col justify-center items-center w-full max-w-md absolute z-1">
        <p className="font-poppins font-bold text-nine text-lg md:text-xl">Welcome to</p>
        <h1 className="font-poppins text-nine text-4xl md:text-5xl font-bold mb-6">Study Quiz</h1>
        <p className="font-poppins text-nine text-md md:text-xl mb-4">Create your account</p>

        {errors.submit && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 w-full text-center">
            {errors.submit}
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
              onBlur={handleBlur}
              className={`font-poppins px-3 py-2 border rounded-lg w-full 
                         focus:outline-none focus:ring-2 transition-colors
                         ${errors.firstName && touched.firstName 
                           ? 'border-red-500 focus:ring-red-500' 
                           : 'border-gray-300 focus:ring-blue-500'}`}
              required
            />
            {errors.firstName && touched.firstName && (
              <p className="text-red-500 text-xs mt-1 font-poppins">{errors.firstName}</p>
            )}
          </div>

          {/* Last Name */}
          <div className="relative w-full mb-4">
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`font-poppins px-3 py-2 border rounded-lg w-full 
                         focus:outline-none focus:ring-2 transition-colors
                         ${errors.lastName && touched.lastName 
                           ? 'border-red-500 focus:ring-red-500' 
                           : 'border-gray-300 focus:ring-blue-500'}`}
              required
            />
            {errors.lastName && touched.lastName && (
              <p className="text-red-500 text-xs mt-1 font-poppins">{errors.lastName}</p>
            )}
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
              onBlur={handleBlur}
              className={`font-poppins pl-10 pr-3 py-2 border rounded-lg w-full 
                         focus:outline-none focus:ring-2 transition-colors
                         ${errors.email && touched.email 
                           ? 'border-red-500 focus:ring-red-500' 
                           : 'border-gray-300 focus:ring-blue-500'}`}
              required
            />
            {errors.email && touched.email && (
              <p className="text-red-500 text-xs mt-1 font-poppins">{errors.email}</p>
            )}
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
              onBlur={handleBlur}
              className={`font-poppins pl-10 pr-3 py-2 border rounded-lg w-full 
                         focus:outline-none focus:ring-2 transition-colors
                         ${errors.password && touched.password 
                           ? 'border-red-500 focus:ring-red-500' 
                           : 'border-gray-300 focus:ring-blue-500'}`}
              required
            />
            {errors.password && touched.password && (
              <p className="text-red-500 text-xs mt-1 font-poppins">{errors.password}</p>
            )}
          </div>

          {/* Password Requirements */}
          {formData.password && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs font-poppins text-gray-600 mb-2">Password must contain:</p>
              <div className="grid grid-cols-1 gap-1 text-xs font-poppins">
                <div className={`flex items-center ${formData.password.length >= 8 ? 'text-green-600' : 'text-red-500'}`}>
                  <span className="mr-1">{formData.password.length >= 8 ? '✓' : '✗'}</span>
                  At least 8 characters
                </div>
                <div className={`flex items-center ${/(?=.*[a-z])/.test(formData.password) ? 'text-green-600' : 'text-red-500'}`}>
                  <span className="mr-1">{/(?=.*[a-z])/.test(formData.password) ? '✓' : '✗'}</span>
                  One lowercase letter
                </div>
                <div className={`flex items-center ${/(?=.*[A-Z])/.test(formData.password) ? 'text-green-600' : 'text-red-500'}`}>
                  <span className="mr-1">{/(?=.*[A-Z])/.test(formData.password) ? '✓' : '✗'}</span>
                  One uppercase letter
                </div>
                <div className={`flex items-center ${/(?=.*\d)/.test(formData.password) ? 'text-green-600' : 'text-red-500'}`}>
                  <span className="mr-1">{/(?=.*\d)/.test(formData.password) ? '✓' : '✗'}</span>
                  One number
                </div>
                <div className={`flex items-center ${/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(formData.password) ? 'text-green-600' : 'text-red-500'}`}>
                  <span className="mr-1">{/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(formData.password) ? '✓' : '✗'}</span>
                  One special character
                </div>
              </div>
            </div>
          )}

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
              className={`font-bold font-poppins w-full py-2 rounded-lg transition-colors mb-4 
                         ${loading 
                           ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                           : 'bg-seven text-one hover:bg-blue-600'}`}
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>

            <div className="flex flex-row gap-1">
              <p className="font-poppins text-nine text-sm">
                Already have an account?
              </p>
              <p 
                onClick={goToLogin}
                className="font-poppins text-nine text-sm hover:underline cursor-pointer">
                Log In
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}