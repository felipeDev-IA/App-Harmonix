
import React, { useState, useEffect, useMemo } from 'react';
import { NoteName } from '../types';
import { HARMONIC_FIELDS_DISPLAY, HARMONIC_FIELDS_MINOR_DISPLAY } from '../constants';
import { audioService } from '../services/audio';

interface HarmonyTableExerciseProps {
  onComplete: (score: number) => void;
}

type ScaleMode = 'MAJOR' | 'MINOR';

const HarmonyTableExercise: React.FC<HarmonyTableExerciseProps> = ({ onComplete }) => {
  const [scaleMode, setScaleMode] = useState<ScaleMode>('MAJOR');

  // Standardized roots for the chromatic exercise
  const displayRoots: NoteName[] = useMemo(() => {
    if (scaleMode === 'MAJOR') {
      return ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
    } else {
      return ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'G#', 'A', 'Bb', 'B'];
    }
  }, [scaleMode]);
  
  const majorHeaders = [
    "I - Tônica (repouso)",
    "II - Subdominante (Preparação)",
    "III - Tônica fraca",
    "IV - Subdominante (preparação)",
    "V - Dominante (tensão)",
    "VI - Tônica relativa",
    "VII - Dominante (tensão)"
  ];

  const minorHeaders = [
    "Im - Tônica (repouso)",
    "IImd - Subdominante (Preparação)",
    "III - Tônica relativa (Maior)",
    "IVm - Subdominante (preparação)",
    "Vm - Dominante (tensão)",
    "VI - Subdominante",
    "VII - Dominante"
  ];

  const currentHeaders = scaleMode === 'MAJOR' ? majorHeaders : minorHeaders;
  const currentFields = scaleMode === 'MAJOR' ? HARMONIC_FIELDS_DISPLAY : HARMONIC_FIELDS_MINOR_DISPLAY;

  const [userTable, setUserTable] = useState<Record<string, string[]>>({});
  const [feedback, setFeedback] = useState<Record<string, boolean[]>>({});

  useEffect(() => {
    const initial: Record<string, string[]> = {};
    displayRoots.forEach(r => {
      const field = currentFields[r] || currentFields[Object.keys(currentFields)[0]];
      initial[r] = [field[0], ...new Array(6).fill('')];
    });
    setUserTable(initial);
    setFeedback({});
  }, [scaleMode, displayRoots, currentFields]);

  const handleInputChange = (root: string, index: number, value: string) => {
    const newTable = { ...userTable };
    if (!newTable[root]) return;
    newTable[root][index] = value;
    setUserTable(newTable);

    const expected = currentFields[root]?.[index];
    if (!expected) return;

    const isCorrect = value.trim().toLowerCase() === expected.toLowerCase();
    
    if (value.trim().length > 0) {
      if (isCorrect) {
        const rootNote = expected.replace('m', '').replace('d', '') as NoteName;
        audioService.playNote(rootNote);
      }
      setFeedback(prev => {
        const next = { ...prev };
        if (!next[root]) next[root] = new Array(7).fill(false);
        next[root][index] = isCorrect;
        return next;
      });
    }
  };

  const checkAll = () => {
    let correctCount = 0;
    const totalFields = displayRoots.length * 6;
    
    displayRoots.forEach(r => {
      if (!userTable[r]) return;
      userTable[r].forEach((val, idx) => {
        if (idx === 0) return;
        const expected = currentFields[r]?.[idx];
        if (expected && val.trim().toLowerCase() === expected.toLowerCase()) {
          correctCount++;
        }
      });
    });

    if (correctCount === totalFields) {
      onComplete(100);
    } else {
      alert(`Você completou ${correctCount} de ${totalFields} acordes corretamente!`);
    }
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500">
      <div className="text-center space-y-4">
        <h3 className="text-2xl font-black text-slate-800 tracking-tight">Tabela de Campo Harmônico e Funções</h3>
        
        <div className="flex justify-center p-1 bg-slate-200 w-fit mx-auto rounded-xl">
          <button 
            onClick={() => setScaleMode('MAJOR')}
            className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${scaleMode === 'MAJOR' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Modo Maior
          </button>
          <button 
            onClick={() => setScaleMode('MINOR')}
            className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${scaleMode === 'MINOR' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Modo Menor
          </button>
        </div>

        <p className="text-indigo-600 font-bold bg-indigo-50 inline-block px-6 py-2 rounded-full text-sm border border-indigo-100">
          {scaleMode === 'MAJOR' 
            ? 'I, IV e V são acordes MAIORES' 
            : 'I, IV e V são acordes MENORES'}
        </p>
      </div>

      <div className="overflow-x-auto pb-4 custom-scrollbar">
        <div className="min-w-[1000px] bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-[#FFDAB9] border-b border-[#F4A460]">
                <th className="p-4 font-bold text-slate-700 border-r border-[#F4A460] w-24">Grau</th>
                {currentHeaders.map((headerText, i) => (
                  <th key={i} className="p-4 text-center font-bold text-slate-700 text-xs whitespace-nowrap">
                    {headerText}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-[#F0F0F0]">
              {displayRoots.map(root => (
                <tr key={root} className="border-b border-white hover:bg-slate-100 transition-colors">
                  <td className="p-4 font-black text-slate-500 border-r border-white">Notas</td>
                  {userTable[root]?.map((val, idx) => (
                    <td key={idx} className="p-2 text-center">
                      {idx === 0 ? (
                        <div className="w-full p-2 font-bold text-slate-800">{val}</div>
                      ) : (
                        <input
                          type="text"
                          value={val}
                          onChange={(e) => handleInputChange(root, idx, e.target.value)}
                          placeholder="..."
                          className={`w-16 h-10 text-center font-bold rounded-lg border-2 transition-all outline-none
                            ${feedback[root]?.[idx] === true 
                              ? 'border-green-500 bg-green-50 text-green-700' 
                              : feedback[root]?.[idx] === false 
                                ? 'border-red-300 bg-red-50 text-red-600' 
                                : 'border-transparent bg-white/50 focus:bg-white focus:border-indigo-300 text-slate-700'}`}
                        />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-center gap-4 pt-4">
        <button 
          onClick={checkAll}
          className="px-8 py-3 bg-indigo-600 text-white rounded-full font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
        >
          Verificar Tabela
        </button>
      </div>
    </div>
  );
};

export default HarmonyTableExercise;
