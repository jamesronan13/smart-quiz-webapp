import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, getDoc, collection, getDocs, query, orderBy } from "firebase/firestore"; 
import TabBar from "../components/TabBar";
import Logo from "../assets/simplelogo.svg";

export default function Home() {
  const [user, loading] = useAuthState(auth);
  const [firstName, setFirstName] = useState("");
  const [loadingName, setLoadingName] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalQuizzes: 0,
    averageScore: 0,
    recentQuizzes: [],
    categoryStats: {},
    loading: true
  });
  const navigate = useNavigate();

  const goToCategory = () => {
    navigate("/category");
  };

  // 🔹 Fetch firstName
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        setLoadingName(true);
        try {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            setFirstName(userSnap.data().firstName || "");
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

  // 🔹 Fetch Dashboard Data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setDashboardData(prev => ({ ...prev, loading: true }));

        const resultsQuery = query(
          collection(db, "quizResults"),
          orderBy("completedAt", "desc")
        );
        
        const resultsSnapshot = await getDocs(resultsQuery);
        const allResults = [];
        
        resultsSnapshot.forEach((doc) => {
          const data = doc.data();
          allResults.push({
            id: doc.id,
            ...data,
            completedAt: data.completedAt?.toDate() || new Date()
          });
        });

        const totalQuizzes = allResults.length;
        const averageScore = totalQuizzes > 0 
          ? Math.round(allResults.reduce((sum, result) => sum + result.percentage, 0) / totalQuizzes)
          : 0;

        const recentQuizzes = allResults.slice(0, 5);

        const categoryStats = {};
        allResults.forEach(result => {
          const category = result.category || 'Unknown';
          if (!categoryStats[category]) {
            categoryStats[category] = {
              total: 0,
              totalScore: 0,
              averageScore: 0,
              bestScore: 0
            };
          }
          categoryStats[category].total++;
          categoryStats[category].totalScore += result.percentage;
          categoryStats[category].averageScore = Math.round(
            categoryStats[category].totalScore / categoryStats[category].total
          );
          categoryStats[category].bestScore = Math.max(
            categoryStats[category].bestScore, 
            result.percentage
          );
        });

        setDashboardData({
          totalQuizzes,
          averageScore,
          recentQuizzes,
          categoryStats,
          loading: false
        });

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setDashboardData(prev => ({ ...prev, loading: false }));
      }
    };

    fetchDashboardData();
  }, []);

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 90) return "text-green-600 bg-green-100";
    if (percentage >= 80) return "text-blue-600 bg-blue-100";
    if (percentage >= 70) return "text-yellow-600 bg-yellow-100";
    if (percentage >= 60) return "text-orange-600 bg-orange-100";
    return "text-red-600 bg-red-100";
  };

  const getScoreEmoji = (percentage) => {
    if (percentage >= 90) return "🏆";
    if (percentage >= 80) return "🎉";
    if (percentage >= 70) return "👏";
    if (percentage >= 60) return "👍";
    return "📚";
  };

  if (loading) {
    return (
      <div className="h-screen w-screen bg-one flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-seven"></div>
      </div>
    );
  }

  return (
    <div className="bg-white h-screen w-screen p-4 md:p-8 flex flex-col pb-16 overflow-hidden">

      {/* Grid Layout: left small column, right wide dashboard */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden pb-16">

        {/* Left Column (Welcome + Start Quiz) */}
        <div className="flex flex-col gap-6">
          {/* Welcome */}
          <div className="bg-two p-6 md:p-8 rounded-2xl shadow-md">
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
            <p className="font-poppins text-six text-md md:text-lg">
              Ready to test your brainpower?
            </p>
          </div>

          {/* Start Quiz */}
          <div className="relative flex flex-col justify-center items-center rounded-3xl shadow-lg overflow-hidden p-6 bg-five h-full">
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
            <div className="relative z-10 text-center">
              <h1 className="font-poppins font-bold text-one text-3xl md:text-4xl mb-2">
                Sigm4 : Smart Quiz
              </h1>
              <p className="text-one font-poppins italic mb-6">
                Your journey to smarter learning starts here.
              </p>
              <button 
                onClick={goToCategory}  
                className="bg-eight font-poppins font-bold text-one text-lg md:text-xl px-6 py-3 rounded-full hover:bg-ten transition-colors"
              >
                Start Quiz
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (Dashboard, wider) */}
        <div className="md:col-span-2 bg-two p-6 rounded-2xl scrollbar-hide shadow-md flex flex-col overflow-hidden">
          <p className="font-poppins font-bold text-six text-2xl md:text-4xl mb-4">
            Dashboard
          </p>

          <div className="flex-1 overflow-y-auto">
            {dashboardData.loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-six"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <p className="font-poppins text-gray-600 text-sm">Total Quizzes</p>
                    <p className="font-poppins font-bold text-six text-2xl">{dashboardData.totalQuizzes}</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <p className="font-poppins text-gray-600 text-sm">Average Score</p>
                    <p className="font-poppins font-bold text-six text-2xl">{dashboardData.averageScore}%</p>
                  </div>
                </div>

                {/* Category Performance */}
                {Object.keys(dashboardData.categoryStats).length > 0 && (
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-poppins font-semibold text-six text-lg mb-3">Category Performance</h3>
                    <div className="space-y-2">
                      {Object.entries(dashboardData.categoryStats).map(([category, stats]) => (
                        <div key={category} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                          <div>
                            <span className="font-poppins text-sm font-medium text-gray-700">
                              {category === 'randomized' ? 'Mixed Categories' : category}
                            </span>
                            <p className="font-poppins text-xs text-gray-500">{stats.total} quiz{stats.total !== 1 ? 'es' : ''}</p>
                          </div>
                          <div className="text-right">
                            <span className={`font-poppins text-sm font-bold px-2 py-1 rounded-full ${getScoreColor(stats.averageScore)}`}>
                              {stats.averageScore}%
                            </span>
                            <p className="font-poppins text-xs text-gray-500 mt-1">Best: {stats.bestScore}%</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent Quizzes */}
                {dashboardData.recentQuizzes.length > 0 && (
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-poppins font-semibold text-six text-lg mb-3">Recent Quizzes</h3>
                    <div className="space-y-3">
                      {dashboardData.recentQuizzes.map((quiz, index) => (
                        <div key={quiz.id || index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                          <div className="flex-1 flex items-center gap-2">
                            <span className="text-lg">{getScoreEmoji(quiz.percentage)}</span>
                            <div>
                              <p className="font-poppins text-sm font-medium text-gray-700">
                                {quiz.displayCategory || quiz.category || 'Quiz'}
                              </p>
                              <p className="font-poppins text-xs text-gray-500">{formatDate(quiz.completedAt)}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`font-poppins text-sm font-bold px-2 py-1 rounded-full ${getScoreColor(quiz.percentage)}`}>
                              {quiz.percentage}%
                            </span>
                            <p className="font-poppins text-xs text-gray-500 mt-1">
                              {quiz.score}/{quiz.totalQuestions}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {dashboardData.totalQuizzes === 0 && (
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                    <div className="text-4xl mb-2">📊</div>
                    <p className="font-poppins text-gray-600 text-sm mb-2">No quiz data yet</p>
                    <p className="font-poppins text-gray-500 text-xs">Take your first quiz to see your progress here!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 w-full h-16 z-50 bg-white shadow-md">
        <TabBar />
      </div>
    </div>
  );
}
