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
import { fadeInUp } from "../animations/variants";
import { motion } from "framer-motion";
import IconBackground from "./IconBackground";

export default function Profile() {
  const [user, loading] = useAuthState(auth);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");;
  const [loadingName, setLoadingName] = useState(true);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [profileImg, setProfileImg] = useState(
    "https://imgs.search.brave.com/7_-25qcHnU9PLXYYiiK-IwkQx93yFpp__txSD1are3s/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAwLzY0LzY3LzYz/LzM2MF9GXzY0Njc2/MzgzX0xkYm1oaU5N/NllwemIzRk00UFB1/RlA5ckhlN3JpOEp1/LmpwZw"
  ); 

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
            setLastName(userData.lastName || "");
            setEmail(userData.email || user.email || "");
            setProfileImg(userData.profileImg || profileImg);
            } else {
            console.log("No such document!");
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        } finally {
            setLoadingName(false); // ✅ ensure it always stops loading
        }
        } else {
        setLoadingName(false); // ✅ even if no user, stop loading
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
    <div className="relative md:h-screen min-h-screen w-screen flex flex-col justify-center items-center">

      <IconBackground className="absolute -z-0" />

      <motion.div {...fadeInUp} className="bg-five max-w-2xl rounded-3xl p-6 shadow-lg mt-6 mb-24 absolute z-1">
        
        <div className="bg-two flex flex-col items-center justify-center p-6 rounded-3xl shadow-lg mb-6">
            {loadingName ? (
                <div className="relative w-64 h-52 rounded-full bg-two overflow-hidden">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] 
                    bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
                </div>
                ) : (
                <img
                    src={profileImg}
                    alt="Profile"
                    className="w-52 h-52 rounded-full object-cover border-4 border-six shadow-md hover:scale-105 transition-transform duration-300"
                />
            )}
        
          {loadingName ? (
              <div className="relative h-10 w-44 mt-4 rounded-lg bg-two overflow-hidden mb-2">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] 
                  bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
              </div>
            ) : (
          <h1 className="font-poppins text-six md:text-3xl font-bold mt-4 text-center text-2xl">
            {loadingName ? "Loading..." : firstName + " " + lastName || "User"}
          </h1>
            )}

            {loadingName ? (
              <div className="relative h-8 w-44 rounded-lg bg-two overflow-hidden mb-2">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] 
                  bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
              </div>
            ) : (
          <p className="font-poppins text-six italic md:text-lg text-md">
            {loadingName ? "Loading..." : email || "Email"}
          </p>
            )}

        </div>

        <div className="col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div
            onClick={() => setShowAvatarModal(true)}
            className="flex items-center gap-4 p-6 rounded-2xl bg-three shadow-md cursor-pointer hover:bg-four transition"
          >
            <img src={EditAvatar} alt="Edit Avatar" className="w-6 h-6" />
            <h1 className="text-black font-poppins font-semibold">Edit Avatar</h1>
          </div>

          <div
            onClick={() => setShowPasswordModal(true)}
            className="flex items-center gap-4 p-6 rounded-2xl bg-three shadow-md cursor-pointer hover:bg-four transition"
          >
            <img src={EditPassword} alt="Change Password" className="w-6 h-6" />
            <h1 className="text-black font-poppins font-semibold">Change Password</h1>
          </div>

          <div
            onClick={() => setShowLogoutDialog(true)}
            className="flex items-center gap-4 p-6 rounded-2xl bg-three shadow-md cursor-pointer hover:bg-four transition"
          >
            <img src={LogoutIcon} alt="Log Out" className="w-6 h-6" />
            <h1 className="text-black font-poppins font-semibold">Log Out</h1>
          </div>
        </div>
      </motion.div>

      {/* TabBar (responsive) */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white shadow-lg">
        <TabBar />
      </div>
      <div className="hidden md:block w-full max-w-4xl mx-auto mt-8">
        <TabBar />
      </div>

      {/* Logout Confirmation Dialog */}
      {showLogoutDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-11/12 max-w-sm">
            <h2 className="text-xl font-bold text-center mb-4 font-poppins">
              Confirm Logout
            </h2>
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

      {/* Modals */}
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
          onSave={() => setShowPasswordModal(false)}
        />
      )}
    </div>
  );
}
