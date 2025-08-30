import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore"; 
import TabBar from "../components/TabBar";
import Logo from "../assets/smartquizlogo.svg";

export default function Home() {
    const [user, loading] = useAuthState(auth);
    const [firstName, setFirstName] = useState("");
    const navigate = useNavigate();

    const goToCategory = () => {
        navigate("/category");
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate("/");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    // 🔹 Fetch firstName from Firestore when user is logged in
    useEffect(() => {
        const fetchUserData = async () => {
            if (user) {
                try {
                    const userRef = doc(db, "users", user.uid); // assuming doc ID = uid
                    const userSnap = await getDoc(userRef);

                    if (userSnap.exists()) {
                        setFirstName(userSnap.data().firstName || "");
                    } else {
                        console.log("No such document!");
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
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
            {/* Logout button */}
            <div className="absolute top-4 right-4">
                <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white font-poppins font-medium px-4 py-2 rounded-lg transition-colors"
                >
                    Logout
                </button>
            </div>

            {/* Welcome message */}
            {user && (
                <div className="absolute top-4 left-4">
                    <p className="font-poppins text-nine text-sm">
                        Welcome, {firstName || "User"}!
                    </p>
                </div>
            )}

            <img src={Logo} alt="logo" className="h-32 w-32 mb-2" />
            <h1 className="font-poppins font-bold text-nine text-3xl mb-10">Study Quiz</h1>

            <button 
                onClick={goToCategory}  
                className="bg-seven font-poppins font-bold text-one text-xl p-4 rounded-3xl hover:bg-blue-600 transition-colors"
            >
                Start Quiz
            </button>

            <div className="fixed bottom-0 left-0 w-full shadow-lg">
                <TabBar />
            </div>
        </div>
    );
}