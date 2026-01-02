
import React, { useState, useEffect, useMemo } from 'react';
import { NoteName } from '../types';
import { MAJOR_SCALES_DISPLAY, MINOR_SCALES_DISPLAY, INTERVAL_PATTERNS } from '../constants';
import { audioService } from '../services/audio';

interface ScaleTableExerciseProps {
  onComplete: (score: number) => void;
}

type ScaleMode = 'MAJOR' | 'MINOR';

const ScaleTableExercise: React.FC<ScaleTableExerciseProps> = ({ onComplete }) => {
  const [scaleMode, setScaleMode] = useState<ScaleMode>('MAJOR');
  
  // Expanded roots to include accidentals
  const roots: NoteName[] = useMemo(() => 
    scaleMode === 'MAJOR' 
      ? ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B']
      : ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'G#', 'A', 'Bb', 'B'],
    [scaleMode]
  );

  const degrees = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
  
  const intervals = scaleMode === 'MAJOR' ? INTERVAL_PATTERNS.MAJOR : INTERVAL_PATTERNS.MINOR;
  const currentScales = scaleMode === 'MAJOR' ? MAJOR_SCALES_DISPLAY : MINOR_SCALES_DISPLAY;

  // State for the user's inputs: Record<RootNote, ArrayOfEnteredNotes>
  const [userTable, setUserTable] = useState<Record<string, string[]>>({});
  const [feedback, setFeedback] = useState<Record<string, boolean[]>>({});

  // Reset/Initialize table when switching modes or on mount
  useEffect(() => {
    const initial: Record<string, string[]> = {};
    roots.forEach(r => {
      // Find the correct scale for the root. If root isn't in currentScales, it's a fallback logic or we need to ensure constants.tsx has it.
      const startNote = currentScales[r] ? r : Object.keys(currentScales)[0];
      initial[r] = [r, ...new Array(6).fill('')];
    });
    setUserTable(initial);
    setFeedback({});
  }, [scaleMode, roots, currentScales]);

  const handleInputChange = (root: string, index: number, value: string) => {
    const newTable = { ...userTable };
    if (!newTable[root]) return;
    newTable[root][index] = value.trim();
    setUserTable(newTable);

    // Immediate validation
    const expectedScale = currentScales[root];
    if (!expectedScale) return;
    
    const expected = expectedScale[index];
    const isCorrect = value.trim().toUpperCase() === expected.toUpperCase();
    
    if (value.length > 0) {
      if (isCorrect) {
        audioService.playNote(expected as NoteName);
      }
      setFeedback(prev => {
        const newFeedback = { ...prev };
        if (!newFeedback[root]) newFeedback[root] = new Array(7).fill(false);
        newFeedback[root][index] = isCorrect;
        return newFeedback;
      });
    }
  };

  const checkAll = () => {
    let correctCount = 0;
    let totalFields = roots.length * 6; // 6 fields per row (I is fixed)
    
    roots.forEach(r => {
      const scale = currentScales[r];
      if (!scale || !userTable[r]) return;
      
      userTable[r].forEach((val, idx) => {
        if (idx === 0) return;
        if (val.toUpperCase() === scale[idx].toUpperCase()) {
          correctCount++;
        }
      });
    });

    if (correctCount === totalFields) {
      onComplete(100);
    } else {
      alert(`Você acertou ${correctCount} de ${totalFields} notas na escala ${scaleMode === 'MAJOR' ? 'Maior' : 'Menor'}!`);
    }
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500">
      <div className="text-center mb-4 space-y-4">
        <h3 className="text-2xl font-black text-slate-800">Tabela de Intervalos Completa</h3>
        
        <div className="flex justify-center p-1 bg-slate-200 w-fit mx-auto rounded-xl">
          <button 
            onClick={() => setScaleMode('MAJOR')}
            className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${scaleMode === 'MAJOR' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Escala Maior
          </button>
          <button 
            onClick={() => setScaleMode('MINOR')}
            className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${scaleMode === 'MINOR' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Escala Menor
          </button>
        </div>
        
        <p className="text-slate-500">Preencha as notas incluindo os acidentes (ex: C#, Bb, F#).</p>
      </div>

      <div className="overflow-x-auto pb-4 custom-scrollbar">
        <div className="min-w-[800px] bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-orange-100 border-b border-orange-200">
                <th className="p-4 font-bold text-slate-700 border-r border-orange-200 w-24">Grau</th>
                {degrees.map(d => (
                  <th key={d} className="p-4 text-center font-bold text-slate-700">{d}</th>
                ))}
              </tr>
              <tr className="bg-blue-50 border-b border-blue-100">
                <th className="p-3 font-bold text-blue-700 border-r border-blue-100">Intervalo</th>
                <th className="bg-white"></th>
                {intervals.map((int, i) => (
                  <th key={i} className="p-3 text-center font-bold text-blue-600">{int}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {roots.map(root => (
                <tr key={root} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 font-black text-slate-400 border-r border-slate-100">{root}</td>
                  {userTable[root]?.map((val, idx) => (
                    <td key={idx} className="p-2 text-center">
                      {idx === 0 ? (
                        <div className="w-full p-2 font-bold text-slate-800 bg-slate-100 rounded-lg">{val}</div>
                      ) : (
                        <input
                          type="text"
                          value={val}
                          onChange={(e) => handleInputChange(root, idx, e.target.value)}
                          placeholder="?"
                          className={`w-12 h-10 text-center font-bold rounded-lg border-2 transition-all outline-none
                            ${feedback[root]?.[idx] === true 
                              ? 'border-green-500 bg-green-50 text-green-700' 
                              : feedback[root]?.[idx] === false 
                                ? 'border-red-300 bg-red-50 text-red-600' 
                                : 'border-slate-100 focus:border-indigo-300 focus:bg-indigo-50 text-slate-700'}`}
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
          Verificar Respostas
        </button>
      </div>
    </div>
  );
};

export default ScaleTableExercise;
