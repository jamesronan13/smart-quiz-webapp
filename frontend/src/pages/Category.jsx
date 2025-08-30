import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export default function Category() {
    const navigate = useNavigate();
    const [availableCategories, setAvailableCategories] = useState({
        Math: true,
        English: true,
        Science: true,
        randomized: false
    });
    const [loading, setLoading] = useState(true);
    const [totalQuestions, setTotalQuestions] = useState(0);

    useEffect(() => {
        checkAvailableCategories();
    }, []);

    const checkAvailableCategories = async () => {
        try {
            const categories = { Math: false, English: false, Science: false, randomized: false };
            let totalQuestionsCount = 0;
            
            // Check if categories have questions available
            const categoryChecks = ['Math', 'English', 'Science'];
            
            for (const category of categoryChecks) {
                try {
                    let categoryQuestionCount = 0;
                    
                    // Try multiple collection patterns to check for questions
                    const collections = ['quizzes', 'questions', 'allQuestions'];
                    
                    for (const collectionName of collections) {
                        try {
                            const snapshot = await getDocs(collection(db, collectionName));
                            let hasQuestions = false;
                            
                            snapshot.forEach((doc) => {
                                const data = doc.data();
                                if (doc.id === category || data.category === category) {
                                    hasQuestions = true;
                                    if (data.questions && Array.isArray(data.questions)) {
                                        categoryQuestionCount += data.questions.length;
                                    } else if (data.question && data.options && data.answer) {
                                        categoryQuestionCount += 1;
                                    }
                                } else if (data.questions && data.questions.length > 0) {
                                    hasQuestions = true;
                                    categoryQuestionCount += data.questions.length;
                                }
                            });
                            
                            if (hasQuestions) {
                                categories[category] = true;
                                totalQuestionsCount += categoryQuestionCount;
                                break;
                            }
                        } catch (error) {
                            console.log(`Error checking ${collectionName}:`, error.message);
                        }
                    }
                } catch (error) {
                    console.log(`Error checking category ${category}:`, error.message);
                }
            }
            
            // Enable randomized if we have questions from multiple categories or at least 20 questions total
            const availableCategoriesCount = Object.values(categories).filter(Boolean).length;
            if (availableCategoriesCount >= 2 || totalQuestionsCount >= 20) {
                categories.randomized = true;
            }
            
            setAvailableCategories(categories);
            setTotalQuestions(totalQuestionsCount);
        } catch (error) {
            console.log("Error checking categories:", error.message);
            // Default to showing all categories if check fails
            setAvailableCategories({
                Math: true,
                English: true,
                Science: true,
                randomized: false
            });
        } finally {
            setLoading(false);
        }
    };

    const goToQuiz = (category) => {
        if (availableCategories[category]) {
            navigate(`/quiz/${category}`);
        }
    };

    const getCategoryStyle = (category, isComingSoon = false) => {
        if (isComingSoon && !availableCategories[category]) {
            return "bg-gray-400 rounded-3xl text-one font-poppins font-bold text-xl px-6 py-8 cursor-not-allowed opacity-50";
        }
        
        if (!availableCategories[category]) {
            return "bg-gray-400 rounded-3xl text-one font-poppins font-bold text-xl px-6 py-8 cursor-not-allowed opacity-50";
        }
        
        return "bg-nine rounded-3xl text-one font-poppins font-bold text-xl px-6 py-8 cursor-pointer hover:bg-gray-700 transition-colors transform hover:scale-105 duration-200";
    };

    const getCategoryTooltip = (category) => {
        if (category === "randomized") {
            if (availableCategories.randomized) {
                return "Mix of questions from all available categories";
            } else {
                return "Need questions from multiple categories to enable randomized mode";
            }
        }
        
        if (!availableCategories[category]) {
            return "No questions available";
        }
        
        return `Click to start ${category} quiz`;
    };

    if (loading) {
        return (
            <div className="h-screen w-screen bg-one flex justify-center items-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mb-4 mx-auto"></div>
                    <p className="font-poppins text-primary text-xl">Loading categories...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen w-screen bg-one flex flex-col justify-center items-center">
            <h1 className="font-poppins font-bold text-nine text-3xl text-primary mb-10">Choose a Category</h1>

            <div className="grid grid-cols-2 gap-6 mt-4 text-center max-w-md w-full px-4">
                <div 
                    onClick={() => goToQuiz("Math")}  
                    className={getCategoryStyle("Math")}
                    title={getCategoryTooltip("Math")}
                > 
                    Mathematics
                    {!availableCategories.Math && (
                        <div className="text-sm font-normal mt-1">(No questions)</div>
                    )}
                </div> 
                
                <div  
                    onClick={() => goToQuiz("English")} 
                    className={getCategoryStyle("English")}
                    title={getCategoryTooltip("English")}
                > 
                    English
                    {!availableCategories.English && (
                        <div className="text-sm font-normal mt-1">(No questions)</div>
                    )}
                </div> 
                
                <div  
                    onClick={() => goToQuiz("Science")} 
                    className={getCategoryStyle("Science")}
                    title={getCategoryTooltip("Science")}
                > 
                    Science
                    {!availableCategories.Science && (
                        <div className="text-sm font-normal mt-1">(No questions)</div>
                    )}
                </div> 
                
                <div  
                    onClick={() => goToQuiz("randomized")}
                    className={getCategoryStyle("randomized")}
                    title={getCategoryTooltip("randomized")}
                > 
                    Randomized<br />
                    {!availableCategories.randomized && (
                        <span className="text-sm font-normal">(Not Available)</span>
                    )}
                </div> 
            </div> 

            {/* Status message */}
            <div className="mt-6 text-center max-w-md px-4">
                <p className="font-poppins text-sm text-gray-600">
                    {Object.values(availableCategories).filter(Boolean).length === 0 
                        ? "No quiz categories are currently available. Please check your Firebase setup."
                        : "Click on any available category to start your quiz!"
                    }
                </p>
            </div>

            {/* Back button */} 
            <button  
                onClick={() => navigate("/home")} 
                className="mt-8 bg-gray-500 hover:bg-gray-600 text-white font-poppins font-medium px-6 py-2 rounded-lg transition-colors" 
            > 
                Back to Home 
            </button> 
        </div> 
    ); 
}