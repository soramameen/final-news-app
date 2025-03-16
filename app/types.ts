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
  options?: string[];
}
export interface QuizWithQuestions {
  quizzes: { title: string; quiz: QuizItem }[];
}
