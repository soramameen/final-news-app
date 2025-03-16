import { NextResponse } from "next/server";
import { join } from "path";
import { readFileSync } from "fs";
import { QuizData, QuizWithQuestions } from "@/app/types";
import { writeFile } from "fs/promises";

export async function GET(): Promise<NextResponse> {
  try {
    const inputFilePath = join(process.cwd(), "app/data/quiz.json");
    const quizData: QuizData = JSON.parse(readFileSync(inputFilePath, "utf-8"));

    // 5件の記事からクイズを生成するPromiseの配列
    const quizPromises = quizData.articles.map(async (article) => {
      const prompt = `以下のニュースタイトルと内容から簡単なIT関連のクイズを1問生成し、質問と正解をJSON形式で返してください。
      必ず守る条件：
      **返答としてJSONデータのみを返し、説明文や余計なテキストは一切含めないでください。**
      JSON形式: {"question": "質問文", "answer": "正解"}
      すべて日本語で、自然で簡潔な文にしてください。
      タイトルと内容を読んでいない人が問題を通してIT関連の知識を学べるようにしてください。
      エンジニアにとって実用的で意味のある情報（技術、トレンド、影響など）を含め、無関係な雑学は避けてください。
      ダメな例: {"question": "AIが仕事を奪うと懸念されている職業は何ですか？", "answer": "声優"}
      タイトル: ${article.title}
      内容: ${article.content}`;

      const groqRes = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "llama3-8b-8192",
            messages: [{ role: "user", content: prompt }],
          }),
        }
      );

      if (!groqRes.ok) throw new Error(`クイズ生成に失敗: ${article.title}`);

      const groqData = await groqRes.json();
      const content = groqData.choices[0].message.content;
      console.log(`Groq content for ${article.title}:`, content); // デバッグ用

      const quizContent = JSON.parse(content);

      return {
        title: article.title,
        quiz: {
          question: quizContent.question,
          answer: quizContent.answer,
        },
      };
    });

    // すべてのクイズを並行処理
    const quizzes = await Promise.all(quizPromises);

    const quizWithQuestions: QuizWithQuestions = { quizzes };

    const outputFilePath = join(
      process.cwd(),
      "app/data/quiz-with-questions.json"
    );
    await writeFile(outputFilePath, JSON.stringify(quizWithQuestions, null, 2));

    return NextResponse.json({
      message: "クイズ生成完了（5件）",
      quiz: quizWithQuestions.quizzes,
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
