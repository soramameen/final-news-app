export interface Article {
  title: string;
  content?: string;
}
export interface QuizData {
  articles: Article[];
}
export interface QuizItem {
  question: string;
  answer: string;
  option?: string[]; //本当はoptionsだが，Groqがどうしてもoptionをかえすため
}
export interface QuizWithQuestions {
  quizzes: { title: string; quiz: QuizItem }[];
}
