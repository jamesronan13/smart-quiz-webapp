import { useNavigate } from "react-router-dom";
import TabBar from "../components/TabBar";
import Logo from "../assets/smartquizlogo.svg";

export default function Home() {

    const navigate = useNavigate();
    const goToCategory = () => {
        navigate("/category");
    };
    
    return (
        <div className="h-screen w-screen bg-one flex flex-col justify-center items-center">
            <img src={Logo} alt="logo" className="h-32 w-32 mb-2" />
            <h1 className="font-poppins font-bold text-nine text-3xl mb-10">Study Quiz</h1>

            <button
            onClick={goToCategory} 
            className="bg-seven font-poppins font-bold text-one text-xl p-4 rounded-3xl">Start</button>

            <div className="fixed bottom-0 left-0 w-full shadow-lg">
                <TabBar />
            </div>
            
        </div>
    );
}