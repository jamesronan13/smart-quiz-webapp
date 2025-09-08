import { useState } from "react";
import TabBar from "../components/TabBar";
import AboutModal from "../components/AboutModal";
import ContactModal from "../components/ContactModal";
import TermsModal from "../components/TermsModal";
import { fadeInUp } from "../animations/Animations";
import { motion } from "framer-motion";
import IconBackground from "./IconBackground";


export default function Settings() {
    const [showAboutModal, setShowAboutModal] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [showContactModal, setShowContactModal] = useState(false);

    return (
        <div className="relative h-screen w-screen flex flex-col justify-center items-center">

            <IconBackground className="absolute -z-0" />
            
            <motion.div {...fadeInUp} className="bg-five max-w-2xl rounded-3xl p-6 shadow-lg mt-6 mb-24 absolute z-1">

            {/* Header */}
            <div className="w-80 md:w-[500px] bg-two rounded-3xl shadow-lg p-8 flex flex-col justify-center items-center mb-6">
                <h1 className="font-poppins text-black text-3xl font-bold">Settings</h1>
                <p className="font-poppins text-gray-600 text-center mt-2">
                    Manage your app preferences and information
                </p>
            </div>

            {/* Settings Options */}
            <div className="w-80 md:w-[500px] bg-two rounded-3xl shadow-lg p-8 gap-2 flex flex-col justify-center items-center">
                
                {/* About the App */}
                <div 
                    onClick={() => setShowAboutModal(true)} 
                    className="w-full flex flex-row justify-center items-center space-x-4 cursor-pointer rounded-full border-4 border-six p-4 hover:bg-gray-50 transition-colors duration-200"
                >
                    <span className="text-2xl">📖</span>
                    <h1 className="text-black font-poppins text-lg font-semibold">About the App</h1>
                </div>

                {/* Terms & Conditions */}
                <div 
                    onClick={() => setShowTermsModal(true)}
                    className="w-full flex flex-row justify-center items-center space-x-4 cursor-pointer rounded-full border-4 border-six p-4 hover:bg-gray-50 transition-colors duration-200"
                >
                    <span className="text-2xl">📜</span>
                    <h1 className="text-black font-poppins text-lg font-semibold">Terms & Conditions</h1>
                </div>

                {/* Contact Support */}
                <div 
                    onClick={() => setShowContactModal(true)}
                    className="w-full flex flex-row justify-center items-center space-x-4 cursor-pointer rounded-full border-4 border-six p-4 hover:bg-gray-50 transition-colors duration-200"
                >
                    <span className="text-2xl">📨</span>
                    <h1 className="text-black font-poppins text-lg font-semibold">Contact Support</h1>
                </div>

            </div>

            </motion.div>

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