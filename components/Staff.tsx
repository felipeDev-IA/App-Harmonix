
import React from 'react';
import { NoteName } from '../types';

interface StaffProps {
  activeNote?: NoteName;
  activeNotes?: NoteName[];
}

const Staff: React.FC<StaffProps> = ({ activeNote, activeNotes = [] }) => {
  // Combine single activeNote into the array if present
  const notesToDraw = activeNote ? [...activeNotes, activeNote] : activeNotes;

  const notePositions: Record<NoteName, number> = {
    'C': 90, 'C#': 90, 'Db': 90, 'B#': 90,
    'D': 80, 'D#': 80, 'Eb': 80,
    'E': 70, 'Fb': 70,
    'F': 60, 'F#': 60, 'Gb': 60, 'E#': 60,
    'G': 50, 'G#': 50, 'Ab': 50,
    'A': 40, 'A#': 40, 'Bb': 40,
    'B': 30, 'Cb': 30
  };

  const lines = [20, 40, 60, 80, 100];

  return (
    <div className="w-full h-40 flex items-center justify-center bg-white rounded-2xl shadow-sm border border-slate-100 p-4 relative">
      <svg width="240" height="120" viewBox="0 0 240 120">
        <text x="5" y="85" fontSize="60" fill="#0F172A" className="select-none">𝄞</text>
        
        {lines.map((y, i) => (
          <line key={i} x1="0" y1={y} x2="240" y2={y} stroke="#CBD5E1" strokeWidth="1.5" />
        ))}

        {notesToDraw.map((note, idx) => {
          const yPos = notePositions[note];
          const xOffset = idx * 30; // Separate notes slightly if multiple
          return (
            <g key={`${note}-${idx}`} transform={`translate(${xOffset}, 0)`}>
              {(note.includes('#') || note.includes('b')) && (
                <text x="100" y={yPos + 5} fontSize="20" fill="#6366F1" fontWeight="bold">
                  {note.includes('#') ? '#' : 'b'}
                </text>
              )}
              <ellipse 
                cx="125" 
                cy={yPos} 
                rx="8" 
                ry="6" 
                fill="#6366F1"
                transform={`rotate(-20, 125, ${yPos})`}
              />
              {(note === 'C' || note === 'C#' || note === 'Db' || note === 'B#') && (
                 <line x1="110" y1="90" x2="140" y2="90" stroke="#0F172A" strokeWidth="2" />
              )}
              <line 
                x1="133" 
                y1={yPos} 
                x2="133" 
                y2={yPos - 40} 
                stroke="#0F172A" 
                strokeWidth="2" 
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default Staff;
