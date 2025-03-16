import { Article, QuizData } from "@/app/types";
import { writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import { join } from "path";
export async function GET(): Promise<NextResponse> {
  try {
    const url = `https://newsapi.org/v2/top-headlines?category=technology&pageSize=5&apiKey=${process.env.NEWS_API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("Failed to fetch news");
    }
    const data = (await res.json()) as { articles: Article[] };
    const validArticles = data.articles.filter(
      (article) => article.content !== null
    );
    if (validArticles.length < 5) {
      throw new Error("nullでないニュースの数が5件未満です");
    }

    const articles: Article[] = validArticles.slice(0, 5).map((article) => ({
      title: article.title,
      content: article.content,
    }));
    const quizData: QuizData = { articles };
    const filePath = join(process.cwd(), "app/data/quiz.json");
    await writeFile(filePath, JSON.stringify(quizData, null, 2));

    return NextResponse.json({ message: "ニュース取得完了", articles });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
