import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, doc, getDoc, query, where, addDoc, serverTimestamp } from "firebase/firestore";

export default function Quiz() {
    const { category } = useParams();
    const navigate = useNavigate();
    
    const [questions, setQuestions] = useState([]);
    const [originalQuestions, setOriginalQuestions] = useState([]); // Store original unshuffled questions
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState("");
    const [userAnswers, setUserAnswers] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [quizStartTime, setQuizStartTime] = useState(null);
    
    // Timer states
    const [timeLeft, setTimeLeft] = useState(15);
    const [isTimerActive, setIsTimerActive] = useState(false);
    const timerRef = useRef(null);
    const questionStartTime = useRef(null);

    useEffect(() => {
        fetchQuestions();
        setQuizStartTime(new Date());
    }, [category]);

    // Timer effect
    useEffect(() => {
        if (isTimerActive && timeLeft > 0) {
            timerRef.current = setTimeout(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
        } else if (isTimerActive && timeLeft === 0) {
            // Time's up - auto advance with no answer (counted as wrong)
            handleTimeUp();
        }

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [timeLeft, isTimerActive]);

    // Start timer when question changes
    useEffect(() => {
        if (questions.length > 0 && !showResult && !loading) {
            startTimer();
        }
    }, [currentQuestion, questions.length, showResult, loading]);

    const startTimer = () => {
        setTimeLeft(15);
        setIsTimerActive(true);
        questionStartTime.current = new Date();
    };

    const stopTimer = () => {
        setIsTimerActive(false);
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
    };

    const handleTimeUp = () => {
        stopTimer();
        
        // Save empty answer (will be counted as wrong)
        const newAnswers = [...userAnswers];
        newAnswers[currentQuestion] = ""; // No answer selected
        setUserAnswers(newAnswers);

        // Move to next question or finish quiz
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer("");
        } else {
            // Quiz finished, calculate score
            calculateScore(newAnswers);
        }
    };

    const shuffleArray = (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    const fetchQuestionsFromAllCategories = async () => {
        try {
            console.log("Fetching questions for randomized quiz...");
            let allQuestions = [];
            const categories = ['Math', 'English', 'Science'];

            for (const cat of categories) {
                let categoryQuestions = [];

                // Method 1: Try fetching from a single document named by category
                try {
                    const quizDoc = await getDoc(doc(db, "quizzes", cat));
                    
                    if (quizDoc.exists()) {
                        const data = quizDoc.data();
                        if (data.questions && Array.isArray(data.questions)) {
                            categoryQuestions = data.questions.map(q => ({ ...q, category: cat }));
                        }
                    }
                } catch (docError) {
                    console.log(`Document approach failed for ${cat}:`, docError.message);
                }

                // Method 2: If no questions found, try querying collection
                if (categoryQuestions.length === 0) {
                    try {
                        const q = query(
                            collection(db, "questions"), 
                            where("category", "==", cat)
                        );
                        const querySnapshot = await getDocs(q);
                        
                        querySnapshot.forEach((doc) => {
                            categoryQuestions.push({ 
                                id: doc.id, 
                                ...doc.data(), 
                                category: cat 
                            });
                        });
                    } catch (collectionError) {
                        console.log(`Collection approach failed for ${cat}:`, collectionError.message);
                    }
                }

                // Method 3: If still no questions, try fetching all from a general collection
                if (categoryQuestions.length === 0) {
                    try {
                        const allQuestionsSnapshot = await getDocs(collection(db, "allQuestions"));
                        allQuestionsSnapshot.forEach((doc) => {
                            const questionData = doc.data();
                            if (questionData.category === cat) {
                                categoryQuestions.push({ 
                                    id: doc.id, 
                                    ...questionData, 
                                    category: cat 
                                });
                            }
                        });
                    } catch (generalError) {
                        console.log(`General collection approach failed for ${cat}:`, generalError.message);
                    }
                }

                // Add valid questions from this category
                const validQuestions = categoryQuestions.filter(q => 
                    q.question && q.options && Array.isArray(q.options) && q.answer
                );
                
                allQuestions = allQuestions.concat(validQuestions);
                console.log(`Found ${validQuestions.length} valid questions for ${cat}`);
            }

            console.log(`Total questions found: ${allQuestions.length}`);
            
            if (allQuestions.length === 0) {
                return [];
            }

            // Shuffle all questions and take up to 20
            const shuffledQuestions = shuffleArray(allQuestions);
            return shuffledQuestions.slice(0, Math.min(20, shuffledQuestions.length));
            
        } catch (error) {
            console.error("Error fetching randomized questions:", error);
            throw error;
        }
    };

    const fetchCategoryQuestions = async (categoryName) => {
        let fetchedQuestions = [];

        // Method 1: Try fetching from a single document named by category
        try {
            const quizDoc = await getDoc(doc(db, "quizzes", categoryName));
            
            if (quizDoc.exists()) {
                const data = quizDoc.data();
                fetchedQuestions = data.questions || [];
                console.log(`Found ${fetchedQuestions.length} questions in document approach`);
            }
        } catch (docError) {
            console.log("Document approach failed:", docError.message);
        }

        // Method 2: If no questions found, try querying collection
        if (fetchedQuestions.length === 0) {
            try {
                const q = query(
                    collection(db, "questions"), 
                    where("category", "==", categoryName)
                );
                const querySnapshot = await getDocs(q);
                
                querySnapshot.forEach((doc) => {
                    fetchedQuestions.push({ id: doc.id, ...doc.data() });
                });
                console.log(`Found ${fetchedQuestions.length} questions in collection approach`);
            } catch (collectionError) {
                console.log("Collection approach failed:", collectionError.message);
            }
        }

        // Method 3: If still no questions, try fetching all from a general collection
        if (fetchedQuestions.length === 0) {
            try {
                const allQuestionsSnapshot = await getDocs(collection(db, "allQuestions"));
                allQuestionsSnapshot.forEach((doc) => {
                    const questionData = doc.data();
                    if (questionData.category === categoryName) {
                        fetchedQuestions.push({ id: doc.id, ...questionData });
                    }
                });
                console.log(`Found ${fetchedQuestions.length} questions in general collection`);
            } catch (generalError) {
                console.log("General collection approach failed:", generalError.message);
            }
        }

        return fetchedQuestions;
    };

    const fetchQuestions = async () => {
        try {
            setLoading(true);
            setError(null);
            
            let fetchedQuestions = [];

            if (category === "randomized") {
                fetchedQuestions = await fetchQuestionsFromAllCategories();
            } else {
                console.log(`Fetching questions from specific category: ${category}`);
                fetchedQuestions = await fetchCategoryQuestions(category);
            }

            console.log("Final questions array:", fetchedQuestions);

            if (fetchedQuestions.length === 0) {
                setError(`No questions found for ${category === "randomized" ? "randomized quiz" : category}. Please check if the data exists in Firestore.`);
            } else {
                // Ensure questions have the required structure
                const validQuestions = fetchedQuestions.filter(q => 
                    q.question && q.options && Array.isArray(q.options) && q.answer
                );
                
                if (validQuestions.length === 0) {
                    setError(`Questions found for ${category} but they don't have the proper structure (question, options, answer).`);
                } else {
                    // Store original questions and shuffle them
                    setOriginalQuestions(validQuestions);
                    setQuestions(shuffleArray(validQuestions));
                }
            }
        } catch (err) {
            console.error(`Error fetching ${category} questions:`, err);
            setError(`Failed to load quiz questions: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerSelect = (answer) => {
        setSelectedAnswer(answer);
    };

    const handleNext = () => {
        stopTimer();
        
        // Save the current answer
        const newAnswers = [...userAnswers];
        newAnswers[currentQuestion] = selectedAnswer;
        setUserAnswers(newAnswers);

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            // Reset selected answer for next question
            setSelectedAnswer("");
        } else {
            // Quiz finished, calculate score
            calculateScore(newAnswers);
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            stopTimer();
            
            // Save current answer before going back
            const newAnswers = [...userAnswers];
            newAnswers[currentQuestion] = selectedAnswer;
            setUserAnswers(newAnswers);
            
            setCurrentQuestion(currentQuestion - 1);
            // Load the previous answer
            setSelectedAnswer(newAnswers[currentQuestion - 1] || "");
        }
    };

    const saveQuizResult = async (finalScore, finalAnswers) => {
        try {
            setIsSaving(true);
            
            const quizEndTime = new Date();
            const timeTaken = Math.round((quizEndTime - quizStartTime) / 1000); // in seconds

            // Calculate detailed results
            const detailedResults = questions.map((question, index) => ({
                question: question.question,
                category: question.category || category,
                userAnswer: finalAnswers[index] || null,
                correctAnswer: question.answer,
                isCorrect: finalAnswers[index] === question.answer,
                options: question.options,
                answeredInTime: finalAnswers[index] !== null && finalAnswers[index] !== ""
            }));

            // Calculate category breakdown for randomized quiz
            const categoryStats = {};
            if (category === "randomized") {
                detailedResults.forEach(result => {
                    const cat = result.category || "Unknown";
                    if (!categoryStats[cat]) {
                        categoryStats[cat] = { total: 0, correct: 0 };
                    }
                    categoryStats[cat].total++;
                    if (result.isCorrect) {
                        categoryStats[cat].correct++;
                    }
                });
            }

            const quizResult = {
                category: category,
                displayCategory: getDisplayCategory(),
                score: finalScore,
                totalQuestions: questions.length,
                percentage: Math.round((finalScore / questions.length) * 100),
                timeTaken: timeTaken, // in seconds
                completedAt: serverTimestamp(),
                startedAt: quizStartTime,
                detailedResults: detailedResults,
                categoryStats: category === "randomized" ? categoryStats : null,
                userAgent: navigator.userAgent, // Optional: to track device/browser
                quizType: category === "randomized" ? "mixed" : "category-specific",
                timedQuiz: true, // Indicate this was a timed quiz
                timePerQuestion: 15 // seconds
            };

            // Save to Firestore
            const docRef = await addDoc(collection(db, "quizResults"), quizResult);
            console.log("Quiz result saved with ID: ", docRef.id);
        } catch (error) {
            console.error("Error saving quiz result:", error);
            // Don't show error to user, just log it - the quiz completion should still work
        } finally {
            setIsSaving(false);
        }
    };

    const calculateScore = async (answers) => {
        stopTimer();
        
        let correctCount = 0;
        questions.forEach((question, index) => {
            if (answers[index] === question.answer) {
                correctCount++;
            }
        });
        
        setScore(correctCount);
        setShowResult(true);

        // Save the result to Firebase
        await saveQuizResult(correctCount, answers);
    };

    const restartQuiz = () => {
        stopTimer();
        setCurrentQuestion(0);
        setSelectedAnswer("");
        setUserAnswers([]);
        setShowResult(false);
        setScore(0);
        setQuizStartTime(new Date()); // Reset start time
        setTimeLeft(15);
        setIsTimerActive(false);
        
     
        if (category === "randomized") {
            fetchQuestions();
        } else {
            
            setQuestions(shuffleArray(originalQuestions));
        }
    };

    const goToCategories = () => {
        stopTimer();
        navigate("/category");
    };


    const goToHome = () => {
        stopTimer();
        navigate("/home");
    };

    const getDisplayCategory = () => {
        if (category === "randomized") {
            return "Mixed Categories";
        }
        return category;
    };

    // Timer display component
    const TimerDisplay = () => {
        const getTimerColor = () => {
            if (timeLeft <= 3) return "text-red-600 bg-red-100 border-red-300";
            if (timeLeft <= 7) return "text-yellow-600 bg-yellow-100 border-yellow-300";
            return "text-green-600 bg-green-100 border-green-300";
        };

        const getProgressColor = () => {
            if (timeLeft <= 3) return "bg-red-500";
            if (timeLeft <= 7) return "bg-yellow-500";
            return "bg-green-500";
        };

        return (
            <div className="flex items-center space-x-3">
                <div className={`px-4 py-2 rounded-full border-2 font-bold ${getTimerColor()}`}>
                    <span className="text-lg">{timeLeft}s</span>
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div 
                        className={`h-full transition-all duration-1000 ease-linear ${getProgressColor()}`}
                        style={{ width: `${(timeLeft / 15) * 100}%` }}
                    />
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="h-screen w-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center">
                <div className="text-center bg-white rounded-2xl p-8 shadow-xl">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-six mb-4 mx-auto"></div>
                    <p className="font-poppins text-gray-700 text-xl font-medium">
                        Loading {category === "randomized" ? "randomized" : category} quiz...
                    </p>
                    <p className="font-poppins text-six text-sm mt-2">This may take a moment...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-screen w-screen bg-gradient-to-br from-red-50 to-pink-100 flex justify-center items-center">
                <div className="text-center max-w-md px-4 bg-white rounded-2xl p-8 shadow-xl">
                    <div className="text-6xl mb-4">⚠️</div>
                    <p className="font-poppins text-red-600 text-xl mb-4 font-medium">{error}</p>
                    <div className="space-y-3">
                        <button 
                            onClick={() => {
                                setError(null);
                                fetchQuestions();
                            }}
                            className="block w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-poppins font-medium px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-105"
                        >
                            Try Again
                        </button>
                        <button 
                            onClick={goToCategories}
                            className="block w-full bg-gray-500 hover:bg-gray-600 text-white font-poppins font-medium px-6 py-3 rounded-xl transition-all duration-200"
                        >
                            Back to Categories
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (questions.length === 0) {
        return (
            <div className="h-screen w-screen bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center items-center">
                <div className="text-center bg-white rounded-2xl p-8 shadow-xl">
                    <div className="text-6xl mb-4">📚</div>
                    <p className="font-poppins text-six text-xl mb-4 font-medium">
                        No questions available for {getDisplayCategory()}
                    </p>
                    <button 
                        onClick={goToCategories}
                        className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-poppins font-medium px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-105"
                    >
                        Back to Categories
                    </button>
                </div>
            </div>
        );
    }

    if (showResult) {
        const percentage = Math.round((score / questions.length) * 100);

        const getEmoji = () => {
            if (percentage >= 90) return "🏆";
            if (percentage >= 80) return "🎉";
            if (percentage >= 70) return "👏";
            if (percentage >= 60) return "👍";
            return "📚";
        };

        const getMessage = () => {
            if (percentage >= 90) return "Excellent work!";
            if (percentage >= 80) return "Great job!";
            if (percentage >= 70) return "Good effort!";
            if (percentage >= 60) return "Not bad!";
            return "Keep practicing!";
        };

        const getGradientColor = () => {
            if (percentage >= 90) return "from-yellow-400 to-orange-500";
            if (percentage >= 80) return "from-green-400 to-green-600";
            if (percentage >= 70) return "from-blue-400 to-blue-600";
            if (percentage >= 60) return "from-indigo-400 to-indigo-600";
            return "from-gray-400 to-gray-600";
        };

        // For randomized quizzes, show breakdown by category
        const getCategoryBreakdown = () => {
            if (category !== "randomized") return null;
            
            const breakdown = {};
            questions.forEach((question, index) => {
                const questionCategory = question.category || "Unknown";
                if (!breakdown[questionCategory]) {
                    breakdown[questionCategory] = { total: 0, correct: 0 };
                }
                breakdown[questionCategory].total++;
                if (userAnswers[index] === question.answer) {
                    breakdown[questionCategory].correct++;
                }
            });
            
            return breakdown;
        };

        const categoryBreakdown = getCategoryBreakdown();

        return (
            <div className="h-screen w-screen bg-gradient-to-br from-purple-50 to-pink-100 flex justify-center items-center px-4">
                <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
                    <h2 className="font-poppins font-bold text-2xl text-gray-800 mb-6">Quiz Complete!</h2>
                    
                    {/* Show saving indicator */}
                    {isSaving && (
                        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                                <span className="font-poppins text-sm text-blue-700">Saving results...</span>
                            </div>
                        </div>
                    )}
                    
                    <div className="mb-6">
                        <div className="text-6xl mb-4">{getEmoji()}</div>
                        <div className={`bg-gradient-to-r ${getGradientColor()} text-white rounded-2xl p-4 mb-4`}>
                            <p className="font-poppins text-xl font-bold mb-1">
                                {score} out of {questions.length}
                            </p>
                            <p className="font-poppins text-2xl font-bold">
                                {percentage}%
                            </p>
                        </div>
                        <p className="font-poppins text-lg font-medium text-gray-700">
                            {getMessage()}
                        </p>
                        <p className="font-poppins text-sm text-gray-500 mt-2">
                            ⏱️ Timed Quiz (15s per question)
                        </p>
                    </div>

                    {/* Category breakdown for randomized quiz */}
                    {categoryBreakdown && (
                        <div className="mb-6 text-left bg-gray-50 rounded-lg p-4">
                            <h3 className="font-poppins font-semibold text-sm text-gray-700 mb-2 text-center">
                                Performance by Category:
                            </h3>
                            {Object.entries(categoryBreakdown).map(([cat, stats]) => (
                                <div key={cat} className="flex justify-between items-center py-1">
                                    <span className="font-poppins text-sm text-gray-600">{cat}:</span>
                                    <span className="font-poppins text-sm font-medium">
                                        {stats.correct}/{stats.total} ({Math.round((stats.correct / stats.total) * 100)}%)
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="space-y-3">
                        <button 
                            onClick={restartQuiz}
                            disabled={isSaving}
                            className={`w-full font-poppins font-medium py-3 rounded-xl transition-all duration-200 transform ${
                                isSaving 
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                                    : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white hover:scale-105"
                            }`}
                        >
                            {category === "randomized" ? "Take New Random Quiz" : "Take Quiz Again"}
                        </button>
                        <button 
                            onClick={goToCategories}
                            disabled={isSaving}
                            className={`w-full font-poppins font-medium py-3 rounded-xl transition-all duration-200 ${
                                isSaving 
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                                    : "bg-gray-500 hover:bg-gray-600 text-white"
                            }`}
                        >
                            Choose Another Category
                        </button>
                        {/* NEW: Back to Home button */}
                        <button 
                            onClick={goToHome}
                            disabled={isSaving}
                            className={`w-full font-poppins font-medium py-3 rounded-xl transition-all duration-200 transform ${
                                isSaving 
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                                    : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white hover:scale-105"
                            }`}
                        >
                            🏠 Back to Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const currentQ = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
        <div className="h-screen w-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
            {/* Header */}
            <div className="bg-white shadow-lg px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center mb-3">
                    <h1 className="font-poppins font-bold text-xl text-gray-800">
                        {getDisplayCategory()} Quiz
                    </h1>
                    <span className="font-poppins text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                        {currentQuestion + 1} of {questions.length}
                    </span>
                </div>
                
                {/* Timer Display */}
                <div className="mb-3">
                    <TimerDisplay />
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                    <div 
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out shadow-sm"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>

                {/* Show current question category for randomized quiz */}
                {category === "randomized" && currentQ?.category && (
                    <div className="mt-3">
                        <span className="inline-block bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-poppins font-medium border border-indigo-200">
                            {currentQ.category}
                        </span>
                    </div>
                )}
            </div>

            {/* Question Content */}
            <div className="flex-1 flex justify-center items-center px-4 py-8">
                <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl border border-gray-200">
                    <h2 className="font-poppins font-semibold text-xl text-gray-800 mb-8 text-center leading-relaxed">
                        {currentQ?.question}
                    </h2>

                    <div className="space-y-4 mb-8">
                        {currentQ?.options?.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleAnswerSelect(option)}
                                className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 font-poppins transform hover:scale-102 ${
                                    selectedAnswer === option
                                        ? "border-indigo-500 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 shadow-lg"
                                        : "border-gray-200 hover:border-indigo-300 text-gray-700 hover:bg-gray-50 hover:shadow-md"
                                }`}
                            >
                                <span className="font-bold mr-3 text-indigo-600">
                                    {String.fromCharCode(65 + index)}.
                                </span>
                                {option}
                            </button>
                        ))}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between">
                        <button 
                            onClick={handlePrevious}
                            disabled={currentQuestion === 0}
                            className={`font-poppins font-medium px-6 py-3 rounded-xl transition-all duration-200 ${
                                currentQuestion === 0 
                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                                    : "bg-gray-500 hover:bg-gray-600 text-white transform hover:scale-105 shadow-lg"
                            }`}
                        >
                            Previous
                        </button>

                        <button 
                            onClick={handleNext}
                            disabled={!selectedAnswer}
                            className={`font-poppins font-medium px-6 py-3 rounded-xl transition-all duration-200 ${
                                !selectedAnswer 
                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                                    : "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white transform hover:scale-105 shadow-lg"
                            }`}
                        >
                            {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
                        </button>
                    </div>
                </div>
            </div>


            {/* Footer */}
            <div className="bg-white px-6 py-4 border-t border-gray-200 shadow-lg">
                <div className="flex justify-center">
                    <button 
                        onClick={goToCategories}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-poppins font-medium px-4 py-2 rounded-xl transition-all duration-200 text-sm transform hover:scale-105"
                    >
                        Back to Categories
                    </button>
                </div>
            </div>
        </div>
    );
}