import { useState } from "react";

export default function AboutModal({ onClose }) {
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