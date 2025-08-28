import { useNavigate } from "react-router-dom";
import {ReactComponent as HomeOutline} from "../assets/home.svg";
import {ReactComponent as ProfileOutline} from "../assets/account-circle.svg";
import {ReactComponent as SettingsOutline} from "../assets/cog.svg";

export default function TabBar() {

    const navigate = useNavigate();
    const goToHome = () => {
        navigate("/home");
    };
    const goToProfile = () => {
        navigate("/profile");
    };
    const goToSettings = () => {
        navigate("/settings");
    };

  return (
    <div className="fixed bottom-0 left-0 w-full h-16 bg-ten flex justify-around items-center shadow-md">
      
      {/* Home */}
      <div 
        onClick={goToHome}
        className="relative group flex justify-center items-center gap-2 rounded-2xl p-3 transition-all duration-300 cursor-pointer hover:bg-secondary">
        <HomeOutline alt="home" className="h-6 w-6 fill-one" />
        <h1 className="text-one font-poppins hidden md:inline">Home</h1>
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 
                        opacity-0 group-hover:opacity-100 
                        md:hidden bg-ten text-one text-xs
                        font-poppins px-2 py-1 rounded-lg shadow-lg 
                        transition-all duration-300">
          Home
        </div>
      </div>

      {/* Profile */}
      <div
        onClick={goToProfile} 
        className="relative group flex justify-center items-center gap-2 rounded-2xl p-3 transition-all duration-300 cursor-pointer hover:bg-secondary">
        <ProfileOutline alt="profile" className="h-6 w-6 fill-one" />
        <h1 className="text-one font-poppins hidden md:inline">Profile</h1>
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 
                        opacity-0 group-hover:opacity-100 
                        md:hidden bg-ten text-one text-xs 
                        font-poppins px-2 py-1 rounded-lg shadow-lg 
                        transition-all duration-300">
          Profile
        </div>
      </div>

      {/* Settings */}
      <div
        onClick={goToSettings}
        className="relative group flex justify-center items-center gap-2 rounded-2xl p-3 transition-all duration-300 cursor-pointer hover:bg-secondary">
        <SettingsOutline alt="settings" className="h-6 w-6 fill-one" />
        <h1 className="text-one font-poppins hidden md:inline">Settings</h1>
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 
                        opacity-0 group-hover:opacity-100 
                        md:hidden bg-ten text-one text-xs 
                        font-poppins px-2 py-1 rounded-lg shadow-lg 
                        transition-all duration-300">
          Settings
        </div>
      </div>

    </div>
  );
}
