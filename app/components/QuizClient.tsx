"use client";
import { useState } from "react";
import { QuizWithQuestions } from "@/app/types";

interface QuizClientProps {
  initialQuizData: QuizWithQuestions;
}

export default function QuizClient({ initialQuizData }: QuizClientProps) {
  const [screen, setScreen] = useState<
    "title" | "quiz" | "feedback" | "result"
  >("title");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  // 現在の日付を取得（例: "3月15日"）
  const today = new Date();
  const month = today.getMonth() + 1; // 0ベースなので+1
  const day = today.getDate();
  const dateString = `${month}月${day}日のITニュースクイズ`;

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setScreen("feedback");
  };

  const handleNext = () => {
    if (selectedAnswer !== null) {
      setUserAnswers([...userAnswers, selectedAnswer]);
      setSelectedAnswer(null);
      if (currentQuestion < initialQuizData.quizzes.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setScreen("quiz");
      } else {
        setScreen("result");
      }
    }
  };

  // タイトル画面
  if (screen === "title") {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {dateString}
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            ITトレンドを学べる5問のクイズに挑戦！
          </p>
          <p className="text-sm text-gray-500 mb-6">
            ※AI生成のため、誤りがある場合があります
          </p>
          <button
            onClick={() => setScreen("quiz")}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            スタート
          </button>
        </div>
      </div>
    );
  }

  // クイズ画面
  if (screen === "quiz") {
    const currentQuiz = initialQuizData.quizzes[currentQuestion];
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {dateString} ({currentQuestion + 1}/{initialQuizData.quizzes.length}
            )
          </h1>
          <p className="text-lg text-gray-700 mb-4">
            {currentQuiz.quiz.question}
          </p>
          <div className="space-y-2">
            {currentQuiz.quiz.option.map((opt, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(opt)}
                className="w-full p-3 text-left bg-gray-200 rounded hover:bg-gray-300 transition-colors"
              >
                {opt}
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-500 italic mt-4">
            出典: {currentQuiz.title}
          </p>
        </div>
      </div>
    );
  }

  // 即時フィードバック画面
  if (screen === "feedback") {
    const currentQuiz = initialQuizData.quizzes[currentQuestion];
    const isCorrect = selectedAnswer === currentQuiz.quiz.answer;
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {isCorrect ? "正解！" : "不正解"}
          </h1>
          <p className="text-lg text-gray-700 mb-2">
            問題: {currentQuiz.quiz.question}
          </p>
          <p className="text-md mb-2">
            あなたの回答: {selectedAnswer}{" "}
            {!isCorrect && `(正解: ${currentQuiz.quiz.answer})`}
          </p>
          {currentQuiz.quiz.advice && (
            <p className="text-sm text-gray-600 italic mb-4">
              アドバイス: {currentQuiz.quiz.advice}
            </p>
          )}
          <button
            onClick={handleNext}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            {currentQuestion < initialQuizData.quizzes.length - 1
              ? "次の問題へ"
              : "結果を見る"}
          </button>
        </div>
      </div>
    );
  }

  // 総合フィードバック（結果画面）
  if (screen === "result") {
    const score = userAnswers.filter(
      (answer, i) => answer === initialQuizData.quizzes[i].quiz.answer
    ).length;
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            総合フィードバック
          </h1>
          <p className="text-lg text-gray-700 mb-4">
            スコア: {score} / {initialQuizData.quizzes.length}
          </p>
          <div className="space-y-4 mb-6">
            {initialQuizData.quizzes.map((quiz, index) => (
              <div key={index}>
                <p className="text-md font-semibold">
                  {index + 1}: {quiz.quiz.question}
                </p>
                <p className="text-sm">
                  あなたの回答: {userAnswers[index]}{" "}
                  {userAnswers[index] === quiz.quiz.answer ? (
                    <span className="text-green-600">✔ 正解</span>
                  ) : (
                    <span className="text-red-600">
                      ✘ 不正解 (正解: {quiz.quiz.answer})
                    </span>
                  )}
                </p>
                {quiz.quiz.advice && (
                  <p className="text-sm text-gray-600 italic">
                    アドバイス: {quiz.quiz.advice}
                  </p>
                )}
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mb-6">
            ※AI生成のため、誤りがある場合があります。参考程度にどうぞ。
          </p>
          <button
            onClick={() => {
              setScreen("title");
              setCurrentQuestion(0);
              setUserAnswers([]);
            }}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            タイトルに戻る
          </button>
        </div>
      </div>
    );
  }

  return null;
}
