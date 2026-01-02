
import React, { useState, useEffect, useCallback } from 'react';
import { NoteName } from '../types';
import { NOTES, INTERVAL_NAMES } from '../constants';
import { audioService } from '../services/audio';
import Staff from './Staff';
import Piano from './Piano';

interface IntervalExerciseProps {
  onComplete: (score: number) => void;
  onExit: () => void;
}

type ViewMode = 'STAFF' | 'PIANO';

const IntervalExercise: React.FC<IntervalExerciseProps> = ({ onComplete, onExit }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('STAFF');
  const [question, setQuestion] = useState<{
    note1: NoteName;
    note2: NoteName;
    intervalValue: number;
    options: string[];
  } | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const generateQuestion = useCallback(() => {
    setSelectedOption(null);
    setIsCorrect(null);

    // Random base note - limit range to fit on staff/piano nicely
    const note1Index = Math.floor(Math.random() * (NOTES.length - 12)); 
    const note1 = NOTES[note1Index];

    // Random interval from 1 (m2) to 12 (P8)
    const intervalValue = Math.floor(Math.random() * 12) + 1;
    const note2 = NOTES[note1Index + intervalValue];

    const correctAnswer = INTERVAL_NAMES[intervalValue];
    
    // Generate options
    const options = [correctAnswer];
    const allIntervalNames = Object.values(INTERVAL_NAMES);
    while (options.length < 4) {
      const randomOpt = allIntervalNames[Math.floor(Math.random() * allIntervalNames.length)];
      if (!options.includes(randomOpt)) options.push(randomOpt);
    }
    options.sort(() => Math.random() - 0.5);

    setQuestion({ note1, note2, intervalValue, options });
  }, []);

  useEffect(() => {
    generateQuestion();
  }, [generateQuestion]);

  const playInterval = () => {
    if (!question) return;
    audioService.playSequence([question.note1, question.note2], 0.6);
  };

  const handleOptionClick = (option: string) => {
    if (selectedOption !== null || !question) return;
    
    setSelectedOption(option);
    const correct = option === INTERVAL_NAMES[question.intervalValue];
    setIsCorrect(correct);
    if (correct) {
      setScore(s => s + 20);
      playInterval();
    }
  };

  const handleNext = () => {
    if (currentStep >= 4) {
      onComplete(score);
    } else {
      setCurrentStep(s => s + 1);
      generateQuestion();
    }
  };

  if (!question) return <div className="p-10 text-center">Preparando seu ouvido...</div>;

  return (
    <div className="max-w-xl mx-auto p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-6">
        <button onClick={onExit} className="p-2 text-slate-400 hover:text-slate-600">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
        <div className="flex-1 mx-4 h-2 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-purple-500 transition-all duration-300" 
            style={{ width: `${((currentStep + 1) / 5) * 100}%` }}
          />
        </div>
        <div className="text-sm font-semibold text-slate-500">{currentStep + 1}/5</div>
      </div>

      <div className="space-y-6 text-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-slate-800">Qual é este intervalo?</h2>
          <p className="text-slate-400 text-sm font-medium">Ouça e identifique a distância entre as notas.</p>
        </div>
        
        <div className="space-y-4">
          {/* View Toggle */}
          <div className="flex justify-center mb-2">
            <div className="bg-slate-100 p-1 rounded-xl flex gap-1 border border-slate-200">
              <button 
                onClick={() => setViewMode('STAFF')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${viewMode === 'STAFF' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <span>🎼</span> Partitura
              </button>
              <button 
                onClick={() => setViewMode('PIANO')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${viewMode === 'PIANO' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <span>🎹</span> Piano
              </button>
            </div>
          </div>

          <div className="min-h-[160px] flex items-center justify-center bg-white rounded-[2rem] border border-slate-100 shadow-sm p-4">
            {viewMode === 'STAFF' ? (
              <Staff activeNotes={[question.note1, question.note2]} />
            ) : (
              <div className="w-full scale-90">
                <Piano activeNotes={[question.note1, question.note2]} />
              </div>
            )}
          </div>
          
          <button 
            onClick={playInterval}
            className="flex items-center gap-2 mx-auto px-6 py-3 bg-white rounded-full shadow-md text-sm font-black text-purple-600 hover:bg-purple-50 transition-all active:scale-95 border border-purple-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
            Tocar Intervalo
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          {question.options.map((opt) => (
            <button
              key={opt}
              onClick={() => handleOptionClick(opt)}
              disabled={selectedOption !== null}
              className={`p-4 rounded-2xl font-bold text-sm border-2 transition-all duration-200 transform
                ${selectedOption === opt 
                  ? isCorrect 
                    ? 'border-green-500 bg-green-50 text-green-700 scale-105' 
                    : 'border-red-500 bg-red-50 text-red-700 shake'
                  : selectedOption !== null && opt === INTERVAL_NAMES[question.intervalValue]
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-slate-100 hover:border-purple-200 bg-white text-slate-700 active:scale-95'
                }`}
            >
              {opt}
            </button>
          ))}
        </div>

        {isCorrect !== null && (
          <div className="animate-in fade-in slide-in-from-top-2 pt-2">
            <div className={`p-4 rounded-[1.5rem] flex items-center justify-between ${isCorrect ? 'bg-green-100 border border-green-200' : 'bg-red-100 border border-red-200'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                  {isCorrect ? '✓' : '✗'}
                </div>
                <span className={`font-bold text-sm ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                  {isCorrect ? 'Excelente percepção!' : `Era uma ${INTERVAL_NAMES[question.intervalValue]}`}
                </span>
              </div>
              <button 
                onClick={handleNext}
                className="px-6 py-2 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200 text-xs uppercase tracking-widest"
              >
                Próxima
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IntervalExercise;
