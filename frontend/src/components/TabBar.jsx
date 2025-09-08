import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ReactComponent as HomeOutline } from "../assets/home.svg";
import { ReactComponent as ProfileOutline } from "../assets/account-circle.svg";
import { ReactComponent as SettingsOutline } from "../assets/cog.svg";

export default function TabBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { path: "/home", label: "Home", icon: HomeOutline },
    { path: "/profile", label: "Profile", icon: ProfileOutline },
    { path: "/settings", label: "Settings", icon: SettingsOutline },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full h-16 bg-ten flex justify-around items-center shadow-md z-50">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const active = location.pathname === tab.path;

        return (
          <div
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className="relative flex items-center md:flex-row flex-col justify-center cursor-pointer px-4 py-2 min-w-[80px] md:min-w-[100px]" // ✅ force consistent width
          >
            {active && (
              <motion.div
                layoutId="active-pill"
                className="absolute inset-0 bg-six rounded-full"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}

            <div
              className={`relative z-10 flex items-center md:flex-row flex-col gap-1 md:gap-2 transition-all duration-300
                ${active ? "text-two" : "font-poppins text-three"}`}
            >
              <Icon
                alt={tab.label}
                className={`h-6 w-6 transition-colors duration-300 
                  ${active ? "fill-one" : "fill-three"}`}
              />
              <span className="text-xs md:text-sm font-poppins">{tab.label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
