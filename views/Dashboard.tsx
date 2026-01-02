
import React, { useState, useEffect } from 'react';
import { ExerciseCategory, UserStats } from '../types';
import { getDailyTip } from '../services/gemini';

interface DashboardProps {
  stats: UserStats;
  onSelectCategory: (cat: ExerciseCategory) => void;
  onSelectPianoFree: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ stats, onSelectCategory, onSelectPianoFree }) => {
  const [dailyTip, setDailyTip] = useState<string>("Carregando dica de hoje...");

  useEffect(() => {
    const fetchTip = async () => {
      const tip = await getDailyTip(stats);
      setDailyTip(tip);
    };
    fetchTip();
  }, []);

  const categories = [
    { id: ExerciseCategory.NOTES, label: 'Notas', icon: '🎵', color: 'bg-blue-500', desc: 'Identificação no teclado e pentagrama' },
    { id: ExerciseCategory.SCALES, label: 'Escalas', icon: '🎢', color: 'bg-emerald-500', desc: 'Construção de escalas Maior e Menor' },
    { id: ExerciseCategory.HARMONY, label: 'Campos Harmônicos', icon: '🎹', color: 'bg-amber-500', desc: 'Acordes e funções harmônicas' },
    { id: ExerciseCategory.INTERVALS, label: 'Intervalos', icon: '📐', color: 'bg-purple-500', desc: 'Reconhecimento auditivo e visual' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Olá, {stats.name}! 👋</h1>
          <p className="text-slate-500 text-sm">Pronto para a sua dose diária de teoria?</p>
        </div>
        <div className="text-right">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nível {stats.level}</div>
          <div className="text-indigo-600 font-bold text-lg">{stats.xp} XP</div>
        </div>
      </header>

      <section className="bg-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
             <span className="text-xl">✨</span>
             <h3 className="font-bold text-indigo-100 uppercase text-xs tracking-widest">Dica da IA</h3>
          </div>
          <p className="text-lg font-medium leading-snug max-w-md">"{dailyTip}"</p>
        </div>
        <div className="absolute top-[-20%] right-[-5%] w-40 h-40 bg-white opacity-5 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-5%] w-24 h-24 bg-indigo-400 opacity-20 rounded-full blur-2xl" />
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={onSelectPianoFree}
          className="md:col-span-3 flex items-center justify-between p-6 bg-slate-900 text-white rounded-3xl hover:bg-slate-800 transition-all group overflow-hidden relative"
        >
          <div className="relative z-10">
            <h3 className="text-xl font-bold">Piano de Estudo Livre 🎹</h3>
            <p className="text-slate-400 text-sm">Pratique notas e acordes sem pressão.</p>
          </div>
          <div className="text-4xl group-hover:scale-125 transition-transform relative z-10">➜</div>
          <div className="absolute right-[-20px] bottom-[-20px] text-8xl opacity-10 pointer-events-none">🎹</div>
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-slate-100 hover:border-indigo-200 hover:shadow-md transition-all text-left group"
          >
            <div className={`w-12 h-12 ${cat.color} rounded-xl flex items-center justify-center text-2xl shadow-lg shadow-slate-100 group-hover:scale-110 transition-transform`}>
              {cat.icon}
            </div>
            <div>
              <h3 className="font-bold text-slate-800">{cat.label}</h3>
              <p className="text-slate-500 text-sm">{cat.desc}</p>
            </div>
          </button>
        ))}
      </div>

      <section className="bg-white rounded-2xl p-6 border border-slate-100">
        <h3 className="font-bold text-slate-800 mb-4">Progresso Semanal</h3>
        <div className="flex items-end justify-between h-32 gap-2">
          {[40, 60, 30, 90, 45, 20, 10].map((h, i) => (
            <div key={i} className="flex-1 group relative">
              <div 
                className={`w-full rounded-t-lg bg-slate-100 group-hover:bg-indigo-400 transition-all duration-500`} 
                style={{ height: `${h}%` }}
              />
              <div className="mt-2 text-[10px] text-center font-bold text-slate-400 uppercase">
                {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'][i]}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
