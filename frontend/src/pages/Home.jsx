import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore"; 
import TabBar from "../components/TabBar";
import Logo from "../assets/simplelogo.svg";

export default function Home() {
  const [user, loading] = useAuthState(auth);
  const [firstName, setFirstName] = useState("");
  const [loadingName, setLoadingName] = useState(true);
  const navigate = useNavigate();

  const goToCategory = () => {
    navigate("/category");
  };

  // 🔹 Fetch firstName from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        setLoadingName(true);
        try {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            setFirstName(userSnap.data().firstName || "");
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
    <div className="bg-white h-screen w-screen p-4 md:p-8 flex flex-col pb-16">

      <div className="flex-1 flex flex-col md:flex-row gap-4 pb-16">
        
        <div className="flex-1 flex flex-col gap-4">
          
          <div className="bg-two p-6 md:p-8 rounded-2xl shadow-md h-max w-full">
            {loadingName ? (
              <div className="relative h-8 w-44 rounded-lg bg-two overflow-hidden mb-2">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] 
                  bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
              </div>
            ) : (
              <p className="font-poppins font-bold text-six text-2xl mb-2 md:text-4xl">
                Welcome, {firstName ? firstName + "!" : "User!"}
              </p>
            )}

            {loadingName ? (
              <div className="relative h-8 w-44 rounded-lg bg-two overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] 
                  bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
              </div>
            ) : (
            <p className="font-poppins text-six text-md md:text-lg">Ready to test your brainpower?</p>
            )}

          </div>

          <div className="bg-two p-6 rounded-2xl shadow-md w-full flex-1">
            {loadingName ? (
              <div className="relative h-5 w-44 rounded-lg bg-two overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] 
                  bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
              </div>
            ) : (
              <p className="font-poppins font-bold text-six text-2xl md:text-4xl">
                Dashboard
              </p>
            )}
          </div>
        </div>

        <div className="flex-2 flex justify-center items-center">
          <div className="relative h-full w-full flex flex-col justify-center items-center rounded-3xl shadow-lg overflow-hidden p-6 bg-five">
            
            <div 
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${Logo})`,
                backgroundSize: "cover",
                backgroundPosition: "center left",
                maskImage: "linear-gradient(to right, black 70%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(to right, black 70%, transparent 100%)",
                opacity: 0.1,
              }}
            ></div>

            <div className="relative z-10 flex flex-col justify-center items-center text-center">
              <h1 className="font-poppins font-bold text-one text-3xl md:text-6xl mb-2">
                Sigm4 : Smart Quiz
              </h1>

              <p className="text-one font-poppins italic mb-6">Your journey to smarter learning starts here.</p>

              <button 
                onClick={goToCategory}  
                className="bg-eight font-poppins font-bold text-one text-lg md:text-2xl px-6 py-3 rounded-full hover:bg-ten transition-colors"
              >
                Start Quiz
              </button>
            </div>
          </div>
        </div>
      </div>

        <div className="fixed bottom-0 left-0 w-full h-16 z-50 bg-white shadow-md">
            <TabBar />
        </div>

    </div>
  );
}
