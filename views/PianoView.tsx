
import React from 'react';
import Piano from '../components/Piano';

interface PianoViewProps {
  onExit: () => void;
}

const PianoView: React.FC<PianoViewProps> = ({ onExit }) => {
  return (
    <div className="flex flex-col h-[70vh] justify-center space-y-8 animate-in fade-in zoom-in-95 duration-300">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">Piano Livre</h2>
        <p className="text-slate-500">Toque as notas para treinar seu ouvido ou compor melodias.</p>
      </div>
      
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
        <Piano />
      </div>

      <div className="flex justify-center">
        <button 
          onClick={onExit}
          className="px-8 py-3 bg-slate-800 text-white rounded-full font-bold hover:bg-slate-900 transition-all shadow-lg active:scale-95"
        >
          Voltar ao Início
        </button>
      </div>
    </div>
  );
};

export default PianoView;
