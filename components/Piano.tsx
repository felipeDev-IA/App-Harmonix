
import React from 'react';
import { NoteName } from '../types';
import { audioService } from '../services/audio';

interface PianoProps {
  onNoteClick?: (note: NoteName) => void;
  activeNotes?: NoteName[]; // Notas em destaque durante a pergunta
  successNotes?: NoteName[]; // Notas em destaque após acerto
  errorNotes?: NoteName[]; // Notas em destaque após erro
}

const Piano: React.FC<PianoProps> = ({ 
  onNoteClick, 
  activeNotes = [], 
  successNotes = [], 
  errorNotes = [] 
}) => {
  const whiteNotes: NoteName[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const blackNotes: (NoteName | null)[] = ['C#', 'D#', null, 'F#', 'G#', 'A#'];

  const handlePress = (note: NoteName) => {
    audioService.playNote(note);
    if (onNoteClick) onNoteClick(note);
  };

  const getMarkerColor = (note: NoteName) => {
    if (successNotes.includes(note)) return "bg-green-500 shadow-sm shadow-green-200";
    if (errorNotes.includes(note)) return "bg-red-500 shadow-sm shadow-red-200";
    if (activeNotes.includes(note)) return "bg-indigo-500 shadow-sm shadow-indigo-200";
    return null;
  };

  const getLabelClass = (note: NoteName) => {
    if (successNotes.includes(note)) return "text-green-600 font-black scale-110";
    if (errorNotes.includes(note)) return "text-red-600 font-black scale-110";
    if (activeNotes.includes(note)) return "text-indigo-600 font-black scale-110";
    return "text-slate-300";
  };

  return (
    <div className="relative flex justify-center w-full max-w-2xl mx-auto h-48 select-none bg-white rounded-3xl p-4">
      {/* Container das teclas */}
      <div className="relative flex w-full h-full shadow-lg rounded-xl border border-slate-200 bg-white overflow-hidden">
        {/* White Keys */}
        {whiteNotes.map((note) => {
          const marker = getMarkerColor(note);
          return (
            <div
              key={note}
              onClick={() => handlePress(note)}
              className="flex-1 relative border-r last:border-r-0 cursor-pointer bg-white hover:bg-slate-50 active:bg-slate-100 transition-colors flex flex-col items-center justify-end pb-3"
            >
              {marker && (
                <div className={`w-2 h-2 rounded-full mb-2 animate-pulse ${marker}`} />
              )}
              <span className={`text-[10px] uppercase tracking-tighter transition-all duration-300 ${getLabelClass(note)}`}>
                {note}
              </span>
            </div>
          );
        })}

        {/* Black Keys */}
        <div className="absolute top-0 left-0 w-full h-2/3 pointer-events-none flex px-[4%]">
          {blackNotes.map((note, idx) => {
            const marker = note ? getMarkerColor(note) : null;
            return (
              <div key={idx} className="flex-1 relative">
                {note && (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePress(note);
                    }}
                    className="absolute right-0 translate-x-1/2 w-[60%] h-full rounded-b-lg cursor-pointer pointer-events-auto bg-slate-900 hover:bg-slate-800 active:bg-slate-700 transition-all shadow-md z-10 flex flex-col items-center pt-2"
                  >
                    {marker && (
                      <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${marker}`} />
                    )}
                  </div>
                )}
              </div>
            );
          })}
          <div className="flex-1" />
        </div>
      </div>
    </div>
  );
};

export default Piano;
