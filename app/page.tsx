import { readFileSync } from "fs";
import { join } from "path";
import { QuizData } from "./types";
import { JSX } from "react";
export default async function Home(): Promise<JSX.Element> {
  const filePath = join(process.cwd(), "app", "data", "quiz.json");
  const quizData: QuizData = JSON.parse(readFileSync(filePath, "utf-8"));

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          今日のITニュース（5件）
        </h1>
        {quizData.articles.map((article, index) => (
          <p key={index} className="text-lg text-gray-700 mb-2">
            <span className="font-semibold">{index + 1}:</span> {article.title}
          </p>
        ))}
      </div>
    </div>
  );
}

export const revalidate = 86400; // 1日ごとに再生成
