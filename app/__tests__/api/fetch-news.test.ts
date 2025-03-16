import { GET } from "../../api/fetch-news/route"; // 関数名をGETに修正
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { Article } from "@/app/types";

// 標準fetchをモック化
global.fetch = jest.fn();

// writeFileをモック化
jest.mock("fs/promises", () => ({
  writeFile: jest.fn().mockResolvedValue(undefined),
}));

describe("GET /api/fetch-news", () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
    (writeFile as jest.Mock).mockClear();
  });

  it("5件のニュースを取得して保存し、成功レスポンスを返す", async () => {
    // モックデータ
    const mockArticles: Article[] = [
      { title: "News 1" },
      { title: "News 2" },
      { title: "News 3" },
      { title: "News 4" },
      { title: "News 5" },
    ];
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ articles: mockArticles }),
    });

    const response = await GET();
    const json = (await response.json()) as {
      message: string;
      articles: Article[];
    };

    expect(response.status).toBe(200);
    expect(json.message).toBe("ニュース取得完了");
    expect(json.articles.length).toBe(5);
    expect(json.articles[0].title).toBe("News 1");

    // writeFileが正しく呼ばれたか
    expect(writeFile).toHaveBeenCalledWith(
      expect.stringContaining("app/data/quiz.json"),
      JSON.stringify({ articles: mockArticles }, null, 2)
    );
  });

  it("ニュース取得失敗で500エラーを返す", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 400,
      json: () => Promise.resolve({}),
    });

    const response = await GET();
    const json = (await response.json()) as { error: string };

    expect(response.status).toBe(500);
    expect(json.error).toBe("Failed to fetch news");
    expect(writeFile).not.toHaveBeenCalled();
  });

  it("ニュースが5件未満で500エラーを返す", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ articles: [{ title: "News 1" }] }),
    });

    const response = await GET();
    const json = (await response.json()) as { error: string };

    expect(response.status).toBe(500);
    expect(json.error).toBe("ニュースが不足しています");
    expect(writeFile).not.toHaveBeenCalled();
  });
});
