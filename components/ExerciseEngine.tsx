
import React, { useState, useEffect, useCallback } from 'react';
import { Exercise, ExerciseCategory, NoteName, ViewState } from '../types';
import { NOTES } from '../constants';
import { audioService } from '../services/audio';
import Piano from './Piano';
import Staff from './Staff';
import { getMusicExplanation } from '../services/gemini';
import ScaleTableExercise from './ScaleTableExercise';
import HarmonyTableExercise from './HarmonyTableExercise';
import IntervalExercise from './IntervalExercise';

interface ExerciseEngineProps {
  category: ExerciseCategory;
  onComplete: (score: number) => void;
  onExit: () => void;
}

type ViewMode = 'STAFF' | 'PIANO';

const ExerciseEngine: React.FC<ExerciseEngineProps> = ({ category, onComplete, onExit }) => {
  const [showBriefing, setShowBriefing] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('STAFF');

  const briefings: Record<ExerciseCategory, { title: string; desc: string; goals: string[], icon: string }> = {
    [ExerciseCategory.NOTES]: {
      title: 'Identificação de Notas',
      desc: 'As notas musicais são o alfabeto da música. Neste módulo, você vai treinar a leitura no pentagrama (Clave de Sol) e a localização das teclas no piano.',
      goals: ['Leitura de partitura', 'Localização visual no piano', 'Reconhecimento de acidentes (# e b)'],
      icon: '🎵'
    },
    [ExerciseCategory.SCALES]: {
      title: 'Construção de Escalas',
      desc: 'Escalas são sequências de notas com distâncias específicas (Tons e Semitons). Elas definem o "clima" da música (Maior para alegria, Menor para introspecção).',
      goals: ['Fórmulas de escalas', 'Prática de todas as tonalidades', 'Memorização de tons e semitons'],
      icon: '🎢'
    },
    [ExerciseCategory.HARMONY]: {
      title: 'Campos Harmônicos',
      desc: 'O campo harmônico é o conjunto de acordes que podem ser formados a partir de uma escala. Cada acorde tem uma "função" (repouso, preparação ou tensão).',
      goals: ['Formação de acordes', 'Funções harmônicas', 'Progressões lógicas'],
      icon: '🎹'
    },
    [ExerciseCategory.INTERVALS]: {
      title: 'Percepção de Intervalos',
      desc: 'Intervalos são a distância entre duas notas. Entendê-los é o segredo para tirar músicas de ouvido e compreender a relação entre as melodias.',
      goals: ['Reconhecimento auditivo', 'Visualização no pentagrama', 'Cálculo de semitons'],
      icon: '📐'
    },
    [ExerciseCategory.SCALE_TABLE]: {
       title: 'Tabela de Escalas',
       desc: 'Um exercício intensivo para mapear todas as notas de todas as escalas.',
       goals: ['Agilidade mental', 'Domínio teórico total'],
       icon: '📊'
    }
  };

  const generateExercise = useCallback(() => {
    setSelectedOption(null);
    setIsCorrect(null);

    const randomNote = NOTES[Math.floor(Math.random() * NOTES.length)];
    const options = [randomNote];
    while(options.length < 4) {
      const opt = NOTES[Math.floor(Math.random() * NOTES.length)];
      if(!options.includes(opt)) options.push(opt);
    }
    options.sort(() => Math.random() - 0.5);

    setExercise({
      id: Math.random().toString(),
      category,
      question: `Qual nota está representada no pentagrama?`,
      correctAnswer: randomNote,
      options,
      audioHint: [randomNote],
    });
  }, [category]);

  useEffect(() => {
    const specializedCategories = [ExerciseCategory.SCALES, ExerciseCategory.HARMONY, ExerciseCategory.INTERVALS];
    if (!specializedCategories.includes(category)) {
      generateExercise();
    }
  }, [category, generateExercise]);

  const handleOptionClick = (option: string) => {
    if (selectedOption !== null) return;
    
    setSelectedOption(option);
    const correct = option === exercise?.correctAnswer;
    setIsCorrect(correct);
    if (correct) {
      setScore(s => s + 10);
      audioService.playNote(exercise?.correctAnswer as NoteName);
    } else {
      audioService.playNote(option as NoteName, 0.2);
    }
  };

  const handleNext = () => {
    if (currentStep >= 4) {
      onComplete(score);
    } else {
      setCurrentStep(s => s + 1);
      generateExercise();
    }
  };

  if (showBriefing) {
    const info = briefings[category];
    return (
      <div className="max-w-xl mx-auto p-6 bg-white rounded-[2.5rem] shadow-2xl shadow-indigo-100 border border-indigo-50 animate-in zoom-in-95 duration-500">
        <div className="space-y-8 py-4">
          <div className="text-center space-y-4">
            <div className="w-24 h-24 bg-indigo-50 rounded-3xl flex items-center justify-center text-5xl mx-auto shadow-inner">
              {info.icon}
            </div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">{info.title}</h2>
          </div>

          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
            <h4 className="text-xs font-black text-indigo-500 uppercase tracking-widest mb-2">O que você vai praticar</h4>
            <p className="text-slate-600 leading-relaxed font-medium">
              {info.desc}
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Objetivos do Treino</h4>
            <div className="grid grid-cols-1 gap-2">
              {info.goals.map((goal, i) => (
                <div key={i} className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
                  <div className="w-6 h-6 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-[10px] font-bold">
                    ✓
                  </div>
                  <span className="text-sm font-bold text-slate-700">{goal}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <button 
              onClick={() => setShowBriefing(false)}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-indigo-200 transition-all active:scale-95"
            >
              Começar Exercício
            </button>
            <button 
              onClick={onExit}
              className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-2xl font-bold text-sm transition-all"
            >
              Voltar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Specialized Exercise Routers
  if (category === ExerciseCategory.SCALES) {
    return (
      <div className="max-w-5xl mx-auto p-4 animate-in slide-in-from-bottom-4 duration-500">
        <div className="mb-6">
          <button onClick={onExit} className="p-2 text-slate-400 hover:text-slate-600 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Sair do Treino
          </button>
        </div>
        <ScaleTableExercise onComplete={onComplete} />
      </div>
    );
  }

  if (category === ExerciseCategory.HARMONY) {
    return (
      <div className="max-w-5xl mx-auto p-4 animate-in slide-in-from-bottom-4 duration-500">
        <div className="mb-6">
          <button onClick={onExit} className="p-2 text-slate-400 hover:text-slate-600 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Sair do Treino
          </button>
        </div>
        <HarmonyTableExercise onComplete={onComplete} />
      </div>
    );
  }

  if (category === ExerciseCategory.INTERVALS) {
    return (
      <IntervalExercise onComplete={onComplete} onExit={onExit} />
    );
  }

  if (!exercise) return <div className="p-8 text-center">Carregando exercício...</div>;

  const correctNote = exercise.correctAnswer as NoteName;

  return (
    <div className="max-w-xl mx-auto p-4 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-8">
        <button onClick={onExit} className="p-2 text-slate-400 hover:text-slate-600">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
        <div className="flex-1 mx-4 h-2 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-500 transition-all duration-300" 
            style={{ width: `${((currentStep + 1) / 5) * 100}%` }}
          />
        </div>
        <div className="text-sm font-semibold text-slate-500">{currentStep + 1}/5</div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-800 text-center">
          {viewMode === 'STAFF' ? 'Qual nota está no pentagrama?' : 'Identifique a nota pelo som'}
        </h2>
        
        <div className="flex flex-col items-center gap-4">
          {/* Toggle View Mode */}
          <div className="bg-slate-100 p-1 rounded-xl flex gap-1 border border-slate-200 shadow-inner mb-2">
            <button 
              onClick={() => setViewMode('STAFF')}
              className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-2 ${viewMode === 'STAFF' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <span>🎼</span> Partitura
            </button>
            <button 
              onClick={() => setViewMode('PIANO')}
              className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-2 ${viewMode === 'PIANO' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <span>🎹</span> Piano
            </button>
          </div>

          <div className="w-full bg-white rounded-3xl border border-slate-100 shadow-sm p-8 flex items-center justify-center min-h-[160px]">
            {viewMode === 'STAFF' ? (
              <Staff activeNote={correctNote} />
            ) : (
              <div className="w-full scale-90 origin-center">
                {/* O teclado agora é passado sem notas ativas para evitar spoilers */}
                <Piano activeNotes={[]} successNotes={[]} errorNotes={[]} />
              </div>
            )}
          </div>

          <button 
            onClick={() => audioService.playNote(correctNote)}
            className="flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-md text-sm font-black text-indigo-600 hover:bg-indigo-50 transition-all border border-indigo-50 active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
            Ouvir Nota
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {exercise.options.map((opt) => (
            <button
              key={opt}
              onClick={() => handleOptionClick(opt)}
              disabled={selectedOption !== null}
              className={`p-5 rounded-2xl font-black text-xl border-2 transition-all duration-200 transform
                ${selectedOption === opt 
                  ? isCorrect 
                    ? 'border-green-500 bg-green-50 text-green-700 scale-105 shadow-lg shadow-green-100' 
                    : 'border-red-500 bg-red-50 text-red-700 animate-shake'
                  : selectedOption !== null && opt === exercise.correctAnswer
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-slate-100 hover:border-indigo-200 bg-white text-slate-700 active:scale-95 hover:shadow-md'
                }`}
            >
              {opt}
            </button>
          ))}
        </div>

        {isCorrect !== null && (
          <div className="animate-in fade-in slide-in-from-top-2 pt-4">
            <div className={`p-5 rounded-[2rem] flex items-center justify-between border ${isCorrect ? 'bg-green-100 border-green-200' : 'bg-red-100 border-red-200'}`}>
              <div className="flex items-center gap-4">
                 <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isCorrect ? 'bg-green-500' : 'bg-red-500'} text-white shadow-lg`}>
                    {isCorrect ? '✓' : '✗'}
                 </div>
                 <div className="flex flex-col">
                   <span className={`font-black text-lg ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                     {isCorrect ? 'Excelente!' : 'Ops!'}
                   </span>
                   {!isCorrect && <span className="text-red-600 text-xs font-bold">A nota era {exercise.correctAnswer}</span>}
                 </div>
              </div>
              <button 
                onClick={handleNext}
                className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 active:scale-95"
              >
                {currentStep >= 4 ? 'Finalizar' : 'Próxima'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseEngine;
