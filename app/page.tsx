import { readFileSync } from "fs";
import { join } from "path";
import { QuizWithQuestions } from "./types"; // QuizWithQuestions型を使用
import { JSX } from "react";

export default async function Home(): Promise<JSX.Element> {
  const filePath = join(
    process.cwd(),
    "app",
    "data",
    "quiz-with-questions.json"
  );
  const quizData: QuizWithQuestions = JSON.parse(
    readFileSync(filePath, "utf-8")
  );

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          今日のITクイズ（5問）
        </h1>
        {quizData.quizzes.map((quizItem, index) => (
          <div key={index} className="mb-4">
            <p className="text-lg text-gray-700 font-semibold">
              {index + 1}: {quizItem.quiz.question}
            </p>
            <p className="text-md text-gray-600">
              正解: {quizItem.quiz.answer}
            </p>
            <p className="text-sm text-gray-500 italic">
              出典: {quizItem.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export const revalidate = 86400; // 1日ごとに再生成
