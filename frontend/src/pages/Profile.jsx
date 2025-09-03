import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore"; 
import EditAvatarModal from "../components/AvatarModal";
import EditPasswordModal from "../components/PasswordModal";
import TabBar from "../components/TabBar";
import EditAvatar from "../assets/account.svg"; 
import EditPassword from "../assets/pencil.svg";
import LogoutIcon from "../assets/logout.svg";

export default function Profile() {
    const [user, loading] = useAuthState(auth);
    const [firstName, setFirstName] = useState("");
    const [email, setEmail] = useState("");
    const [loadingName, setLoadingName] = useState(true);
    const [showAvatarModal, setShowAvatarModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const [profileImg, setProfileImg] = useState("https://media.sproutsocial.com/uploads/2022/06/profile-picture.jpeg"); 

    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate("/");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const saveProfileImageToDatabase = async (newImageUrl) => {
        if (user) {
            try {
                const userRef = doc(db, "users", user.uid);
                await updateDoc(userRef, {
                    profileImg: newImageUrl
                });
                console.log("Profile image updated successfully");
            } catch (error) {
                console.error("Error updating profile image:", error);
            }
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            if (user) {
                setLoadingName(true);
                try {
                    const userRef = doc(db, "users", user.uid);
                    const userSnap = await getDoc(userRef);

                    if (userSnap.exists()) {
                        const userData = userSnap.data();
                        setFirstName(userData.firstName || "");
                        setEmail(userData.email || user.email || "");
                        // Load profile image from database, fallback to default if not found
                        setProfileImg(userData.profileImg || "https://media.sproutsocial.com/uploads/2022/06/profile-picture.jpeg");
                    } else {
                        console.log("No such document!");
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                } finally {
                    setLoadingName(false);
                }
            }
        };

        fetchUserData();
    }, [user]);

    if (loading) {
        return (
            <div className="h-screen w-screen bg-one flex justify-center items-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-seven"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-white flex flex-col items-center px-4 md:px-8 py-6">
            
            <div className="w-full max-w-md md:max-w-2xl bg-two rounded-2xl shadow-lg p-6 md:p-10 flex flex-col md:flex-row items-center md:items-start mb-6">
                <img
                    src={profileImg}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-4 border-six shadow-md hover:scale-105 transition-transform duration-300"
                />
                <div className="flex flex-col mt-4 md:mt-0 md:ml-6 text-center md:text-left">
                    {loadingName ? (
                        <div className="relative h-4 w-44 mt-2 rounded-lg bg-two overflow-hidden">
                            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] 
                            bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
                        </div>
                        ) : (
                            <h1 className="font-poppins text-black text-2xl font-bold mt-2">
                                {firstName ? firstName : "User"}
                            </h1>
                        )}

                        {loadingName ? (
                            <div className="relative h-4 w-44 mt-2 rounded-lg bg-two overflow-hidden">
                                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] 
                                bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
                            </div>
                        ) : (
                            <p className="font-poppins text-gray-600">
                                {email ? email : "Email"}
                            </p>
                        )}
                        
                        {loadingName ? (
                            <div className="relative h-4 w-44 mt-2 rounded-lg bg-two overflow-hidden">
                                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] 
                                bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
                            </div>
                        ) : (
                        <div className="border-2 border-four rounded-full h-max w-max px-2 py-1 mt-2">
                            <p className="text-black font-poppins text-sm text-center">Math Wizard 🪄</p>
                        </div>
                        )}

                </div>
            </div>

            <div className="w-full max-w-md md:max-w-2xl bg-two rounded-2xl shadow-lg p-6 flex flex-col gap-4">
                <div 
                    onClick={() => setShowAvatarModal(true)} 
                    className="w-full flex flex-row items-center space-x-4 cursor-pointer rounded-full border-4 border-four p-4 hover:bg-four transition"
                >
                    <img src={EditAvatar} alt="Edit Avatar" className="w-5 h-5 object-cover" />
                    <h1 className="text-black font-poppins text-lg font-semibold">Edit Avatar</h1>
                </div>

                <div 
                    onClick={() => setShowPasswordModal(true)}
                    className="w-full flex flex-row items-center space-x-4 cursor-pointer rounded-full border-4 border-four p-4 hover:bg-four transition"
                >
                    <img src={EditPassword} alt="Change Password" className="w-5 h-5 object-cover" />
                    <h1 className="text-black font-poppins text-lg font-semibold">Change Password</h1>
                </div>

                <div 
                    onClick={() => setShowLogoutDialog(true)} 
                    className="w-full flex flex-row items-center space-x-4 cursor-pointer rounded-full border-4 border-four p-4 hover:bg-four transition"
                >
                    <img src={LogoutIcon} alt="Log Out" className="w-5 h-5 object-cover" />
                    <h1 className="text-black font-poppins text-lg font-semibold">Log Out</h1>
                </div>
            </div>

            <div className="md:hidden fixed bottom-0 left-0 w-full bg-white shadow-lg">
                <TabBar />
            </div>

            <div className="hidden md:block w-full max-w-2xl mt-8">
                <TabBar />
            </div>

            {/* Logout Confirmation Dialog */}
            {showLogoutDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-2xl shadow-lg p-6 w-11/12 max-w-sm">
                        <h2 className="text-xl font-bold text-center mb-4 font-poppins">Confirm Logout</h2>
                        <p className="text-gray-600 text-center mb-6 font-poppins">
                            Are you sure you want to logout?
                        </p>
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={() => setShowLogoutDialog(false)}
                                className="px-6 py-2 bg-gray-200 text-black rounded-full font-poppins font-semibold hover:bg-gray-300 transition"
                            >
                                No
                            </button>
                            <button
                                onClick={() => {
                                    setShowLogoutDialog(false);
                                    handleLogout();
                                }}
                                className="px-6 py-2 bg-red-500 text-white rounded-full font-poppins font-semibold hover:bg-red-600 transition"
                            >
                                Yes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showAvatarModal && (
                <EditAvatarModal
                    currentImg={profileImg}
                    onClose={() => setShowAvatarModal(false)}
                    onSave={async (newImg) => {
                        setProfileImg(newImg);
                        await saveProfileImageToDatabase(newImg);
                        setShowAvatarModal(false);
                    }}
                />
            )}

           {showPasswordModal && (
    <EditPasswordModal
        onClose={() => setShowPasswordModal(false)}
        onSave={(newPassword) => {
            setShowPasswordModal(false);
        }}
    />
)}
        </div>
    );
}