// import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmailIcon from "../assets/email.svg";
import PasswordIcon from "../assets/lock.svg";

export default function Login() {

    // const [email, setEmail] = useState("")
    // const [password, setPassword] = useState("")
    const navigate = useNavigate();
    const handleLogin = () => {
        // For now, no validation - just navigate
        navigate("/home"); // 👈 Change "/home" to your target page
    };

    return (
        <div className="h-screen w-screen bg-one flex flex-col justify-center items-center">

            <div className="bg-three md:p-20 p-8 rounded-3xl shadow-xl flex flex-col justify-center items-center">
                <p className="font-poppins font-bold text-nine text-lg md:text-xl">Welcome to</p>
                <h1 className="font-poppins text-nine text-4xl md:text-5xl font-bold mb-6">Study Quiz</h1>
                <p className="font-poppins text-nine text-md md:text-xl mb-4">Sign in to your account</p>

                <div className="relative w-64 mb-6">
                    {/* Icon */}
                    <img src={EmailIcon} alt="email icon" className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 opacity-50" />

                    {/* Input */}
                    <input
                        type="email"
                        placeholder="Email"
                        className="font-poppins pl-10 pr-3 py-2 border border-gray-300 rounded-lg w-full 
                                focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    </div>

                    <div className="relative w-64">
                    {/* Icon */}
                    <img src={PasswordIcon} alt="email icon" className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 opacity-50" />

                    {/* Input */}
                    <input
                        type="password"
                        placeholder="Password"
                        className="font-poppins pl-10 pr-3 py-2 border border-gray-300 rounded-lg w-full 
                                focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    </div>

                    <div className="flex flex-row items-center mb-8 w-full self-start">
                        <input
                            type="checkbox"
                            id="showPassword"
                            className="mt-4 mr-2"
                        />
                        <p className="font-poppins text-nine text-sm mt-4">
                            Show Password
                        </p>
                    </div>
                    
                    <div className="flex flex-col justify-center items-center w-64"> 

                    <button 
                        onClick={handleLogin}
                        className="bg-seven text-one font-bold font-poppins w-full py-2 rounded-lg hover:bg-blue-600 transition-colors mb-4">
                            Log In
                    </button>

                    <button className="bg-one text-nine font-bold font-poppins w-full py-2 rounded-lg hover:bg-gray-200 transition-colors mb-6">
                        Sign Up
                    </button>

                    <p className="font-poppins text-nine text-sm hover:underline">Forgot Password?</p>

                </div>

            </div>
        
        </div>
    );
}