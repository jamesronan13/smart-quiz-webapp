export default function TermsModal({ onClose }) {
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