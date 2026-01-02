
export type NoteName = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B' | 'Bb' | 'Eb' | 'Ab' | 'Db' | 'Gb' | 'Cb' | 'Fb' | 'B#' | 'E#';

export enum ExerciseCategory {
  NOTES = 'NOTES',
  INTERVALS = 'INTERVALS',
  SCALES = 'SCALES',
  HARMONY = 'HARMONY',
  SCALE_TABLE = 'SCALE_TABLE'
}

export interface UserStats {
  name?: string;
  xp: number;
  level: number;
  streak: number;
  history: {
    date: string;
    score: number;
    category: ExerciseCategory;
  }[];
}

export interface Exercise {
  id: string;
  category: ExerciseCategory;
  question: string;
  options: string[];
  correctAnswer: string;
  audioHint?: NoteName[];
  explanation?: string;
  tableData?: {
    root: NoteName;
    intervals: string[];
    expectedNotes: string[];
  };
}

export type ViewState = 'LOGIN' | 'STUDY' | 'CHALLENGES' | 'PROGRESS' | 'PROFILE' | 'EXERCISE' | 'PIANO_FREE';
