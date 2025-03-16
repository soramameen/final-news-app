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
      const prompt = `以下のニュースタイトルと内容から、ITエンジニア向けのクイズを1問生成し、質問、正解、3つの選択肢（正解を含む）、ワンポイントアドバイスをJSON形式で返してください。
必ず守る条件：
**返答としてJSONデータのみを返し、説明文や余計なテキストは一切含めないでください。**
JSON形式: {"question": "質問文", "answer": "正解", "option": ["選択肢1", "選択肢2", "選択肢3"], "advice": "短いアドバイス"}
- 質問、正解、選択肢、アドバイスはすべて日本語で、自然で簡潔に。
- 質問はニュースに基づき、IT技術やトレンドに関する実践的知識を問うものに。
- 選択肢は正解を1つ含み、他の2つは関連性が高く教育的で紛らわしい誤りに。正解位置はランダムに。
- アドバイスはエンジニア向けに、具体的で実践的な技術的洞察を20～30文字で（例: 技術名や手法を含む）。
- 文法的に正しく、曖昧さや冗長さを避ける。ニュースの内容から逸脱しない。
ダメな例: {"question": "AIが仕事を奪うと懸念されている職業は何ですか？", "answer": "声優", "option": ["声優", "医者", "教師"], "advice": "AIはすごいね"}
タイトル: ${article.title}
大まかな内容: ${article.description}
細かい内容: ${article.content}`;

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
      console.log(`Groq content for ${article.title}:`, content);

      const quizContent = JSON.parse(content);

      return {
        title: article.title,
        quiz: {
          question: quizContent.question,
          answer: quizContent.answer,
          option: quizContent.option,
          advice: quizContent.advice,
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
