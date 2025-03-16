export interface Article {
  title: string;
  content: string;
  description?: string;
}
export interface QuizData {
  articles: Article[];
}
export interface QuizItem {
  question: string;
  answer: string;
  option: string[]; //本当はoptionsだが，Groqがどうしてもoptionをかえすため
  advice: string;
}
export interface QuizWithQuestions {
  quizzes: { title: string; quiz: QuizItem }[];
}
