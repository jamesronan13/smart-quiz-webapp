import TabBar from "../components/TabBar";

export default function Profile() {
    return (
        <div className="h-screen w-screen bg-one flex justify-center items-center">
            <h1 className="font-poppins text-primary">Profile Page</h1>

            <div className="fixed bottom-0 left-0 w-full bg-white shadow-lg">
                <TabBar />
            </div>
            
        </div>
    );
}