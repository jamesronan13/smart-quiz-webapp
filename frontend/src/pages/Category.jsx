import { useNavigate } from "react-router-dom";

export default function Category() {

    const navigate = useNavigate();
    const goToQuiz = (category) => {
        navigate(`/quiz/category=${category}`);
    };

    return (
        <div className="h-screen w-screen bg-one flex flex-col justify-center items-center">
            <h1 className="font-poppins font-bold text-nine text-3xl text-primary">Choose a Category</h1>

            <div className="grid grid-cols-2 gap-4 mt-10 text-center">
                <div
                onClick={() => goToQuiz("mathematics")} 
                className="bg-nine rounded-3xl text-one font-poppins font-bold text-xl px-4 py-6 ">
                    Mathematics
                </div>
                <div 
                onClick={() => goToQuiz("english")}
                className="bg-nine rounded-3xl text-one font-poppins font-bold text-xl px-4 py-6 ">
                    English  
                </div>
                <div 
                onClick={() => goToQuiz("science")}
                className="bg-nine rounded-3xl text-one font-poppins font-bold text-xl px-4 py-6 ">
                    Science
                </div>
                <div 
                onClick={() => goToQuiz("randomized")}className="bg-nine rounded-3xl text-one font-poppins font-bold text-xl px-4 py-6">
                    Randomized
                </div>
            </div>
        </div>
    );
}