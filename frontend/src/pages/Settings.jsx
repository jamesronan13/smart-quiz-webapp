import TabBar from "../components/TabBar.jsx";

export default function Settings() {
    return (
        <div className="h-screen w-screen bg-one flex justify-center items-center">
            <h1 className="font-poppins text-primary">Settings</h1>

            <div className="fixed bottom-0 left-0 w-full bg-white shadow-lg">
                <TabBar />
            </div>
            
        </div>
    );
}