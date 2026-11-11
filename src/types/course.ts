export type Course = {
  id: number;
  title: string;
  category: string;
  instructor: string;
  duration: string;
  level: string;
  description: string;
  color: string;
  icon: string;
  lessons: string[];
};

export type LessonProgress = Record<number, number[]>;
