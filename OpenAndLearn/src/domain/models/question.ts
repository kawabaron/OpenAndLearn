export type DifficultyLevel = 'beginner' | 'intermediate' | 'mixed';

export type QuestionItem = {
  id: string;
  prompt: string;
  choices: string[]; // length = 4
  answerIndex: number; // 0..3
  explanation: string;
  level: Exclude<DifficultyLevel, 'mixed'>;
  tags: string[];
};
