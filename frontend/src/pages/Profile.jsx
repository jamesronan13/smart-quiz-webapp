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
import { fadeInUp } from "../animations/Animations";
import { motion } from "framer-motion";
import IconBackground from "./IconBackground";

const DEFAULT_IMG =
  "https://imgs.search.brave.com/7_-25qcHnU9PLXYYiiK-IwkQx93yFpp__txSD1are3s/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAwLzY0LzY3LzYz/LzM2MF9GXzY0Njc2/MzgzX0xkYm1oaU5N/NllwemIzRk00UFB1/RlA5ckhlN3JpOEp1/LmpwZw";

export default function Profile() {
  const [user, loading] = useAuthState(auth);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [loadingName, setLoadingName] = useState(true);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [profileImg, setProfileImg] = useState(DEFAULT_IMG);
  const [uploading, setUploading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Reset all states when logging out
      setFirstName("");
      setLastName("");
      setEmail("");
      setProfileImg(DEFAULT_IMG);
      setCurrentUserId(null);
      setLoadingName(true);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Convert File to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Save image data to Firestore
  const saveProfileImageToDatabase = async (imageData) => {
    if (!user) return;

    setUploading(true);

    try {
      let imageToSave = imageData;

      if (imageData instanceof File) {
        console.log("Converting file to base64...");
        imageToSave = await fileToBase64(imageData);
      }

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        profileImg: imageToSave,
        updatedAt: new Date().toISOString(),
      });

      console.log("Profile image updated successfully in Firestore");

      // Update state immediately
      setProfileImg(imageToSave);

      return imageToSave;
    } catch (error) {
      console.error("Error updating profile image:", error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  // Reset states when user changes
  useEffect(() => {
    if (!user) {
      // Reset all states when no user
      setFirstName("");
      setLastName("");
      setEmail("");
      setProfileImg(DEFAULT_IMG);
      setCurrentUserId(null);
      setLoadingName(false);
    } else if (currentUserId && currentUserId !== user.uid) {
      // Reset states when switching to a different user
      setFirstName("");
      setLastName("");
      setEmail("");
      setProfileImg(DEFAULT_IMG);
      setLoadingName(true);
    }
    setCurrentUserId(user?.uid || null);
  }, [user?.uid, currentUserId]);

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
            
            // Handle profile image with better fallback logic
            if (userData.profileImg && userData.profileImg !== DEFAULT_IMG) {
              setProfileImg(userData.profileImg);
            } else {
              setProfileImg(DEFAULT_IMG);
            }
          } else {
            console.log("No user document found for:", user.uid);
            setFirstName("");
            setLastName("");
            setEmail(user.email || "");
            setProfileImg(DEFAULT_IMG);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setProfileImg(DEFAULT_IMG);
        } finally {
          setLoadingName(false);
        }
      } else {
        setLoadingName(false);
      }
    };

    // Only fetch if user exists and has changed
    if (user) {
      fetchUserData();
    }
  }, [user?.uid]); // Only depend on user.uid to avoid unnecessary refetches

  if (loading) {
    return (
      <div className="h-screen w-screen bg-one flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-seven"></div>
      </div>
    );
  }

  // If no user is authenticated, redirect or show login prompt
  if (!user) {
    navigate("/");
    return null;
  }

  return (
    <div className="relative md:h-screen min-h-screen w-screen flex flex-col justify-center items-center">
      <IconBackground className="absolute -z-0" />

      <motion.div
        {...fadeInUp}
        className="bg-five max-w-2xl rounded-3xl p-6 shadow-lg mt-6 mb-24 absolute z-1"
      >
        <div className="bg-two flex flex-col items-center justify-center p-6 rounded-3xl shadow-lg mb-6">
          {loadingName || uploading ? (
            <div className="relative w-64 h-52 rounded-full bg-two overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] 
                bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
              {uploading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full">
                  <div className="text-white text-sm font-poppins">Saving...</div>
                </div>
              )}
            </div>
          ) : (
            <img
              src={profileImg}
              alt="Profile"
              className="w-52 h-52 rounded-full object-cover border-4 border-six shadow-md hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                console.log("Image failed to load, using default");
                e.target.src = DEFAULT_IMG;
                setProfileImg(DEFAULT_IMG);
              }}
            />
          )}

          {loadingName ? (
            <div className="relative h-10 w-44 mt-4 rounded-lg bg-two overflow-hidden mb-2">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] 
                bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
            </div>
          ) : (
            <h1 className="font-poppins text-six md:text-3xl font-bold mt-4 text-center text-2xl">
              {(firstName && lastName) ? `${firstName} ${lastName}` : "User"}
            </h1>
          )}

          {loadingName ? (
            <div className="relative h-8 w-44 rounded-lg bg-two overflow-hidden mb-2">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] 
                bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
            </div>
          ) : (
            <p className="font-poppins text-six italic md:text-lg text-md">
              {email || "Email"}
            </p>
          )}
        </div>

        <div className="col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div
            onClick={() => !uploading && setShowAvatarModal(true)}
            className={`flex items-center gap-4 p-6 rounded-2xl bg-three shadow-md cursor-pointer hover:bg-four transition ${
              uploading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <img src={EditAvatar} alt="Edit Avatar" className="w-6 h-6" />
            <h1 className="text-black font-poppins font-semibold">
              {uploading ? "Saving..." : "Edit Avatar"}
            </h1>
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

      {/* TabBar */}
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
          onSave={async (newImgData) => {
            try {
              await saveProfileImageToDatabase(newImgData);
              setShowAvatarModal(false);
            } catch (error) {
              console.error("Error saving profile image:", error);
              alert("Failed to save profile image. Please try again.");
            }
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