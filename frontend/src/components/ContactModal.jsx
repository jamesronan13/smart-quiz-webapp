import { useState } from "react";

export default function ContactModal({ onClose }) {
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