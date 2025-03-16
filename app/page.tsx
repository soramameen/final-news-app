import { readFileSync } from "fs";
import { join } from "path";
import { QuizWithQuestions } from "./types";
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
          今日のITクイズ（5問・3択）
        </h1>
        {quizData.quizzes.map((quizItem, index) => (
          <div key={index} className="mb-6">
            <p className="text-lg text-gray-700 font-semibold">
              {index + 1}: {quizItem.quiz.question}
            </p>
            <ul className="list-disc ml-6 text-md text-gray-600">
              {quizItem.quiz.option.map((opt, optIndex) => (
                <li
                  key={optIndex}
                  className={
                    opt === quizItem.quiz.answer
                      ? "font-bold text-green-600"
                      : ""
                  }
                >
                  {opt} {opt === quizItem.quiz.answer ? "(正解)" : ""}
                </li>
              ))}
            </ul>
            <p className="text-sm text-gray-500 italic mt-2">
              出典: {quizItem.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export const revalidate = 86400; // 1日ごとに再生成
