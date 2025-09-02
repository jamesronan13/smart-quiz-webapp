import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore"; 
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
    const [profileImg, setProfileImg] = useState("https://media.sproutsocial.com/uploads/2022/06/profile-picture.jpeg"); //Placeholder
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate("/");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    // Fetching
    useEffect(() => {
        const fetchUserData = async () => {
            if (user) {
                setLoadingName(true);
                try {
                    const userRef = doc(db, "users", user.uid);
                    const userSnap = await getDoc(userRef);

                    if (userSnap.exists()) {
                        setFirstName(userSnap.data().firstName || "");
                        setEmail(userSnap.data().email || user.email || "");
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
        <div className="h-screen w-screen bg-one flex flex-col justify-center items-center">

            <div className="w-80 md:w-[500px] bg-white rounded-lg shadow-lg p-10 flex flex-col justify-center items-center mb-6">
                <img
                    src={profileImg}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-4 border-six shadow-md hover:scale-105 transition-transform duration-300"
                />

                {loadingName ? (
                    <div className="relative h-4 w-44 mt-4 rounded-lg bg-two overflow-hidden">
                        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] 
                        bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
                    </div>
                ) : (
                    <h1 className="font-poppins text-black text-2xl font-bold mt-4">
                        {firstName ? firstName : "User"}
                    </h1>
                )}

                {loadingName ? (
                    <div className="relative h-4 w-44 mt-4 rounded-lg bg-two overflow-hidden">
                        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] 
                        bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
                    </div>
                ) : (
                    <p className="font-poppins text-gray-600">
                        {email ? email : "Email"}
                    </p>
                )}
            </div>

            <div className="w-80 md:w-[500px] bg-white rounded-lg shadow-lg p-8 gap-2 flex flex-col justify-center items-center">
                <div 
                    onClick={() => setShowAvatarModal(true)} 
                    className="w-full flex flex-row justify-center items-center space-x-4 cursor-pointer rounded-lg border-2 border-six p-4"
                >
                    <img src={EditAvatar} alt="Edit Avatar" className="w-5 h-5 object-cover hover:scale-105 transition-transform duration-300" />
                    <h1 className="text-black font-poppins text-lg font-semibold">Edit Avatar</h1>
                </div>

                <div 
                    onClick={() => setShowPasswordModal(true)}
                    className="w-full flex flex-row justify-center items-center space-x-4 cursor-pointer rounded-lg border-2 border-six p-4">
                    <img src={EditPassword} alt="Change Password" className="w-5 h-5 object-cover hover:scale-105 transition-transform duration-300" />
                    <h1 className="text-black font-poppins text-lg font-semibold">Change Password</h1>
                </div>

                <div onClick={handleLogout} className="w-full flex flex-row justify-center items-center space-x-4 cursor-pointer rounded-lg border-2 border-six p-4">
                    <img src={LogoutIcon} alt="Log Out" className="w-5 h-5 object-cover hover:scale-105 transition-transform duration-300" />
                    <h1 className="text-black font-poppins text-lg font-semibold">Log Out</h1>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 w-full bg-white shadow-lg">
                <TabBar />
            </div>

            {showAvatarModal && (
                <EditAvatarModal
                    currentImg={profileImg}
                    onClose={() => setShowAvatarModal(false)}
                    onSave={(newImg) => {
                        setProfileImg(newImg);
                        setShowAvatarModal(false);
                    }}
                />
            )}

            {showPasswordModal && (
                <EditPasswordModal
                    currentPassword={password}
                    onClose={() => setShowPasswordModal(false)}
                    onSave={(newPassword) => {
                        setPassword(newPassword);
                        setShowPasswordModal(false);
                    }}
                />
            )}
        </div>
    );
}
