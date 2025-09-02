import { useState } from "react";
import TabBar from "../components/TabBar";

export default function Settings() {
    const [showAboutModal, setShowAboutModal] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [showContactModal, setShowContactModal] = useState(false);

    return (
        <div className="h-screen w-screen bg-one flex flex-col justify-center items-center">
            
            {/* Header */}
            <div className="w-80 md:w-[500px] bg-white rounded-lg shadow-lg p-8 flex flex-col justify-center items-center mb-6">
                <h1 className="font-poppins text-black text-3xl font-bold">Settings</h1>
                <p className="font-poppins text-gray-600 text-center mt-2">
                    Manage your app preferences and information
                </p>
            </div>

            {/* Settings Options */}
            <div className="w-80 md:w-[500px] bg-white rounded-lg shadow-lg p-8 gap-2 flex flex-col justify-center items-center">
                
                {/* About the App */}
                <div 
                    onClick={() => setShowAboutModal(true)} 
                    className="w-full flex flex-row justify-center items-center space-x-4 cursor-pointer rounded-lg border-2 border-six p-4 hover:bg-gray-50 transition-colors duration-200"
                >
                    <span className="text-2xl">📖</span>
                    <h1 className="text-black font-poppins text-lg font-semibold">About the App</h1>
                </div>

                {/* Terms & Conditions */}
                <div 
                    onClick={() => setShowTermsModal(true)}
                    className="w-full flex flex-row justify-center items-center space-x-4 cursor-pointer rounded-lg border-2 border-six p-4 hover:bg-gray-50 transition-colors duration-200"
                >
                    <span className="text-2xl">📜</span>
                    <h1 className="text-black font-poppins text-lg font-semibold">Terms & Conditions</h1>
                </div>

                {/* Contact Support */}
                <div 
                    onClick={() => setShowContactModal(true)}
                    className="w-full flex flex-row justify-center items-center space-x-4 cursor-pointer rounded-lg border-2 border-six p-4 hover:bg-gray-50 transition-colors duration-200"
                >
                    <span className="text-2xl">📨</span>
                    <h1 className="text-black font-poppins text-lg font-semibold">Contact Support</h1>
                </div>

            </div>

            {/* Tab Bar */}
            <div className="fixed bottom-0 left-0 w-full bg-white shadow-lg">
                <TabBar />
            </div>

            {/* Modals */}
            {showAboutModal && <AboutModal onClose={() => setShowAboutModal(false)} />}
            {showTermsModal && <TermsModal onClose={() => setShowTermsModal(false)} />}
            {showContactModal && <ContactModal onClose={() => setShowContactModal(false)} />}
        </div>
    );
}

// About Modal Component
function AboutModal({ onClose }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
                
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold font-poppins text-black">About Sigm4</h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                    >
                        ×
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    
                    {/* App Logo/Icon */}
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">Σ4</span>
                        </div>
                    </div>

                    {/* App Name and Version */}
                    <div className="text-center">
                        <h3 className="text-2xl font-bold font-poppins text-black">Sigm4</h3>
                        <p className="text-gray-600 font-poppins">Smart Quiz App</p>
                        <p className="text-sm text-gray-500 mt-1">Version 1.0.0</p>
                    </div>

                    {/* Description */}
                    <div className="space-y-3">
                        <p className="text-gray-700 font-poppins leading-relaxed">
                            Sigm4 is an intelligent quiz application designed to enhance your learning experience 
                            across multiple subjects. Challenge yourself with our comprehensive question bank and 
                            track your progress as you master new concepts.
                        </p>

                        {/* Features */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-semibold text-black font-poppins mb-2">Features:</h4>
                            <ul className="space-y-1 text-sm text-gray-700">
                                <li>• 4 comprehensive categories: Math, Science, English, and Random</li>
                                <li>• 20 carefully curated questions per category</li>
                                <li>• Progress tracking and performance analytics</li>
                                <li>• User-friendly interface with smooth navigation</li>
                                <li>• Secure user authentication and data protection</li>
                            </ul>
                        </div>

                        {/* Categories Info */}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="bg-blue-50 rounded p-2 text-center">
                                <span className="text-lg">🔢</span>
                                <p className="font-semibold">Math</p>
                            </div>
                            <div className="bg-green-50 rounded p-2 text-center">
                                <span className="text-lg">🔬</span>
                                <p className="font-semibold">Science</p>
                            </div>
                            <div className="bg-purple-50 rounded p-2 text-center">
                                <span className="text-lg">📚</span>
                                <p className="font-semibold">English</p>
                            </div>
                            <div className="bg-orange-50 rounded p-2 text-center">
                                <span className="text-lg">🎲</span>
                                <p className="font-semibold">Random</p>
                            </div>
                        </div>

                        {/* Developer Info */}
                        <div className="text-center pt-4 border-t border-gray-200">
                            <p className="text-xs text-gray-500">
                                Developed with ❤️ for learning enthusiasts
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                © 2025 Sigm4. All rights reserved.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="w-full bg-six text-white py-3 rounded-lg font-poppins font-semibold hover:bg-opacity-90 transition-colors duration-200"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

// Terms Modal Component
function TermsModal({ onClose }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
                
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold font-poppins text-black">Terms & Conditions</h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                    >
                        ×
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4 text-sm text-gray-700">
                    
                    <div className="text-center mb-4">
                        <p className="text-xs text-gray-500">Last updated: September 2, 2025</p>
                    </div>

                    <div className="space-y-4">
                        <section>
                            <h3 className="font-semibold text-black font-poppins mb-2">1. Acceptance of Terms</h3>
                            <p className="leading-relaxed">
                                By accessing and using Sigm4, you agree to be bound by these Terms and Conditions. 
                                If you do not agree to these terms, please do not use our application.
                            </p>
                        </section>

                        <section>
                            <h3 className="font-semibold text-black font-poppins mb-2">2. Use of Service</h3>
                            <p className="leading-relaxed">
                                Sigm4 is designed for educational purposes. You may use the app to take quizzes, 
                                track your progress, and enhance your learning across Math, Science, English, and general knowledge.
                            </p>
                        </section>

                        <section>
                            <h3 className="font-semibold text-black font-poppins mb-2">3. User Account</h3>
                            <p className="leading-relaxed">
                                You are responsible for maintaining the confidentiality of your account credentials. 
                                You agree to provide accurate information during registration and keep it updated.
                            </p>
                        </section>

                        <section>
                            <h3 className="font-semibold text-black font-poppins mb-2">4. Privacy Policy</h3>
                            <p className="leading-relaxed">
                                We collect minimal personal information necessary for app functionality. Your quiz 
                                scores and progress are stored securely. We do not share your personal information 
                                with third parties without your consent.
                            </p>
                        </section>

                        <section>
                            <h3 className="font-semibold text-black font-poppins mb-2">5. Content Accuracy</h3>
                            <p className="leading-relaxed">
                                While we strive for accuracy in our quiz questions and answers, we cannot guarantee 
                                100% accuracy. The content is provided for educational purposes and should not be 
                                considered definitive.
                            </p>
                        </section>

                        <section>
                            <h3 className="font-semibold text-black font-poppins mb-2">6. Prohibited Uses</h3>
                            <p className="leading-relaxed">
                                You may not use Sigm4 for any unlawful purpose, to cheat on actual exams, 
                                or to distribute the quiz content without permission.
                            </p>
                        </section>

                        <section>
                            <h3 className="font-semibold text-black font-poppins mb-2">7. Changes to Terms</h3>
                            <p className="leading-relaxed">
                                We reserve the right to modify these terms at any time. Changes will be 
                                effective immediately upon posting within the app.
                            </p>
                        </section>

                        <section>
                            <h3 className="font-semibold text-black font-poppins mb-2">8. Contact Information</h3>
                            <p className="leading-relaxed">
                                For questions about these terms, please contact us at csa22024@gmail.com
                            </p>
                        </section>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="w-full bg-six text-white py-3 rounded-lg font-poppins font-semibold hover:bg-opacity-90 transition-colors duration-200"
                    >
                        I Understand
                    </button>
                </div>
            </div>
        </div>
    );
}

// Contact Modal Component
function ContactModal({ onClose }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
                
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold font-poppins text-black">Contact Support</h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                    >
                        ×
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    
                    {/* Contact Info */}
                    <div className="bg-blue-50 rounded-lg p-6 text-center">
                        <div className="flex justify-center items-center space-x-2 mb-3">
                            <span className="text-2xl">📧</span>
                            <span className="font-bold text-black text-lg">Email Support</span>
                        </div>
                        <p className="text-lg text-gray-700 font-semibold mb-2">csa22024@gmail.com</p>
                        <p className="text-sm text-gray-500">We typically respond within 24 hours</p>
                    </div>

                    {/* Common Issues */}
                    <div className="bg-yellow-50 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-black mb-2">Quick Help:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Forgot password? Use the reset option on login</li>
                            <li>• Quiz not loading? Check your internet connection</li>
                            <li>• Score not saving? Make sure you're logged in</li>
                        </ul>
                    </div>

                    {/* Instructions */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-black mb-2">How to Contact Us:</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Send us an email with a clear subject line describing your issue. 
                            Include as much detail as possible to help us assist you quickly.
                        </p>
                    </div>

                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="w-full bg-six text-white py-3 rounded-lg font-poppins font-semibold hover:bg-opacity-90 transition-colors duration-200"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}