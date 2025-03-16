import { readFileSync } from "fs";
import { join } from "path";
import { QuizWithQuestions } from "./types";
import QuizClient from "@/app/components/QuizClient"; // クライアントコンポーネントを分離

// サーバーコンポーネント（データ取得）
export default async function Home() {
  const filePath = join(
    process.cwd(),
    "app",
    "data",
    "quiz-with-questions.json"
  );
  const quizData: QuizWithQuestions = JSON.parse(
    readFileSync(filePath, "utf-8")
  );

  return <QuizClient initialQuizData={quizData} />;
}

export const revalidate = 86400; // 1日ごとに再生成
