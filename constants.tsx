
import React from 'react';
import { NoteName } from './types';

export const NOTES: NoteName[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const NOTE_FREQUENCIES: Record<string, number> = {
  'C': 261.63, 'C#': 277.18, 'Db': 277.18,
  'D': 293.66, 'D#': 311.13, 'Eb': 311.13,
  'E': 329.63, 'Fb': 329.63, 'E#': 349.23,
  'F': 349.23, 'F#': 369.99, 'Gb': 369.99,
  'G': 392.00, 'G#': 415.30, 'Ab': 415.30,
  'A': 440.00, 'A#': 466.16, 'Bb': 466.16,
  'B': 493.88, 'Cb': 246.94, 'B#': 261.63
};

export const INTERVAL_NAMES: Record<number, string> = {
  1: 'Segunda Menor',
  2: 'Segunda Maior',
  3: 'Terça Menor',
  4: 'Terça Maior',
  5: 'Quarta Justa',
  6: 'Trítono',
  7: 'Quinta Justa',
  8: 'Sexta Menor',
  9: 'Sexta Maior',
  10: 'Sétima Menor',
  11: 'Sétima Maior',
  12: 'Oitava Justa'
};

// Comprehensive Major Scales Display
export const MAJOR_SCALES_DISPLAY: Record<string, string[]> = {
  'C': ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
  'Db': ['Db', 'Eb', 'F', 'Gb', 'Ab', 'Bb', 'C'],
  'D': ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'],
  'Eb': ['Eb', 'F', 'G', 'Ab', 'Bb', 'C', 'D'],
  'E': ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#'],
  'F': ['F', 'G', 'A', 'Bb', 'C', 'D', 'E'],
  'F#': ['F#', 'G#', 'A#', 'B', 'C#', 'D#', 'E#'],
  'G': ['G', 'A', 'B', 'C', 'D', 'E', 'F#'],
  'Ab': ['Ab', 'Bb', 'C', 'Db', 'Eb', 'F', 'G'],
  'A': ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#'],
  'Bb': ['Bb', 'C', 'D', 'Eb', 'F', 'G', 'A'],
  'B': ['B', 'C#', 'D#', 'E', 'F#', 'G#', 'A#']
};

// Natural Minor Scales Display
export const MINOR_SCALES_DISPLAY: Record<string, string[]> = {
  'C': ['C', 'D', 'Eb', 'F', 'G', 'Ab', 'Bb'],
  'C#': ['C#', 'D#', 'E', 'F#', 'G#', 'A', 'B'],
  'D': ['D', 'E', 'F', 'G', 'A', 'Bb', 'C'],
  'Eb': ['Eb', 'F', 'Gb', 'Ab', 'Bb', 'Cb', 'Db'],
  'E': ['E', 'F#', 'G', 'A', 'B', 'C', 'D'],
  'F': ['F', 'G', 'Ab', 'Bb', 'C', 'Db', 'Eb'],
  'F#': ['F#', 'G#', 'A', 'B', 'C#', 'D', 'E'],
  'G': ['G', 'A', 'Bb', 'C', 'D', 'Eb', 'F'],
  'G#': ['G#', 'A#', 'B', 'C#', 'D#', 'E', 'F#'],
  'A': ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
  'Bb': ['Bb', 'C', 'Db', 'Eb', 'F', 'Gb', 'Ab'],
  'B': ['B', 'C#', 'D', 'E', 'F#', 'G', 'A']
};

export const HARMONIC_FIELDS_DISPLAY: Record<string, string[]> = {
  'C': ['C', 'Dm', 'Em', 'F', 'G', 'Am', 'Bmd'],
  'Db': ['Db', 'Ebm', 'Fm', 'Gb', 'Ab', 'Bbm', 'Cmd'],
  'D': ['D', 'Em', 'F#m', 'G', 'A', 'Bm', 'C#md'],
  'Eb': ['Eb', 'Fm', 'Gm', 'Ab', 'Bb', 'Cm', 'Dmd'],
  'E': ['E', 'F#m', 'G#m', 'A', 'B', 'C#m', 'D#md'],
  'F': ['F', 'Gm', 'Am', 'Bb', 'C', 'Dm', 'Emd'],
  'F#': ['F#', 'G#m', 'A#m', 'B', 'C#', 'D#m', 'E#md'],
  'G': ['G', 'Am', 'Bm', 'C', 'D', 'Em', 'F#md'],
  'Ab': ['Ab', 'Bbm', 'Cm', 'Db', 'Eb', 'Fm', 'Gmd'],
  'A': ['A', 'Bm', 'C#m', 'D', 'E', 'F#m', 'G#md'],
  'Bb': ['Bb', 'Cm', 'Dm', 'Eb', 'F', 'Gm', 'Amd'],
  'B': ['B', 'C#m', 'D#m', 'E', 'F#', 'G#m', 'A#md']
};

export const HARMONIC_FIELDS_MINOR_DISPLAY: Record<string, string[]> = {
  'C': ['Cm', 'Dmd', 'Eb', 'Fm', 'Gm', 'Ab', 'Bb'],
  'C#': ['C#m', 'D#md', 'E', 'F#m', 'G#m', 'A', 'B'],
  'D': ['Dm', 'Emd', 'F', 'Gm', 'Am', 'Bb', 'C'],
  'Eb': ['Ebm', 'Fmd', 'Gb', 'Abm', 'Bbm', 'Cb', 'Db'],
  'E': ['Em', 'F#md', 'G', 'Am', 'Bm', 'C', 'D'],
  'F': ['Fm', 'Gmd', 'Ab', 'Bbm', 'Cm', 'Db', 'Eb'],
  'F#': ['F#m', 'G#md', 'A', 'Bm', 'C#m', 'D', 'E'],
  'G': ['Gm', 'Amd', 'Bb', 'Cm', 'Dm', 'Eb', 'F'],
  'G#': ['G#m', 'A#md', 'B', 'C#m', 'D#m', 'E', 'F#'],
  'A': ['Am', 'Bmd', 'C', 'Dm', 'Em', 'F', 'G'],
  'Bb': ['Bbm', 'Cmd', 'Db', 'Ebm', 'Fm', 'Gb', 'Ab'],
  'B': ['Bm', 'C#md', 'D', 'Em', 'F#m', 'G', 'A']
};

export const INTERVAL_PATTERNS = {
  MAJOR: ['T', 'T', 'ST', 'T', 'T', 'T', 'ST'],
  MINOR: ['T', 'ST', 'T', 'T', 'ST', 'T', 'T']
};

export const COLORS = {
  primary: '#6366F1',
  secondary: '#14B8A6',
  background: '#F8FAFC',
  text: '#0F172A',
  error: '#EF4444',
  success: '#22C55E'
};
