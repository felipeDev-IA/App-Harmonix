
import React, { useState, useEffect } from 'react';
import { ExerciseCategory, UserStats } from '../types';

interface ChallengesViewProps {
  stats: UserStats;
  onStartExercise: (category: ExerciseCategory) => void;
}

interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  category: ExerciseCategory;
  target: number;
  current: number;
  xpReward: number;
  completed: boolean;
}

const ChallengesView: React.FC<ChallengesViewProps> = ({ stats, onStartExercise }) => {
  const [dailyChallenges, setDailyChallenges] = useState<DailyChallenge[]>([
    {
      id: '1',
      title: 'Mestre das Notas',
      description: 'Identifique 5 notas corretamente no pentagrama.',
      category: ExerciseCategory.NOTES,
      target: 5,
      current: 0,
      xpReward: 50,
      completed: false
    },
    {
      id: '2',
      title: 'Explorador de Escalas',
      description: 'Complete uma tabela de escala sem erros.',
      category: ExerciseCategory.SCALES,
      target: 1,
      current: 0,
      xpReward: 100,
      completed: false
    },
    {
      id: '3',
      title: 'Ouvido Absoluto',
      description: 'Pratique intervalos por 3 minutos.',
      category: ExerciseCategory.INTERVALS,
      target: 3,
      current: 0,
      xpReward: 75,
      completed: false
    }
  ]);

  // Simulate progress based on stats history for the current day
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayHistory = stats.history.filter(h => h.date.startsWith(today));

    setDailyChallenges(prev => prev.map(challenge => {
      const relevantActions = todayHistory.filter(h => h.category === challenge.category);
      const current = challenge.category === ExerciseCategory.NOTES ? relevantActions.length : (relevantActions.length > 0 ? 1 : 0);
      return {
        ...challenge,
        current: Math.min(current, challenge.target),
        completed: current >= challenge.target
      };
    }));
  }, [stats.history]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="space-y-2">
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">Desafios 🏆</h2>
        <p className="text-slate-500">Supere seus limites e ganhe recompensas extras todos os dias.</p>
      </header>

      {/* Daily Challenges Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-700">Desafios Diários</h3>
          <span className="text-xs font-bold text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wider">Reinicia em 14h</span>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {dailyChallenges.map((challenge) => (
            <div 
              key={challenge.id} 
              className={`p-5 rounded-3xl border-2 transition-all group ${
                challenge.completed 
                  ? 'bg-emerald-50 border-emerald-100' 
                  : 'bg-white border-slate-100 hover:border-indigo-100'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className={`font-bold ${challenge.completed ? 'text-emerald-700' : 'text-slate-800'}`}>
                      {challenge.title}
                    </h4>
                    {challenge.completed && <span className="text-emerald-500">✓</span>}
                  </div>
                  <p className="text-sm text-slate-500">{challenge.description}</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-indigo-600">+{challenge.xpReward} XP</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-400">
                  <span>PROGRESSO</span>
                  <span>{challenge.current} / {challenge.target}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${challenge.completed ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                    style={{ width: `${(challenge.current / challenge.target) * 100}%` }}
                  />
                </div>
              </div>

              {!challenge.completed && (
                <button 
                  onClick={() => onStartExercise(challenge.category)}
                  className="mt-4 w-full py-2 bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 rounded-xl text-sm font-bold transition-colors"
                >
                  Começar Agora
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Custom Challenge Creation Section */}
      <section className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-slate-200">
        <div className="relative z-10 space-y-6">
          <div className="space-y-2">
            <h3 className="text-2xl font-black italic tracking-tighter">CRIE SEU DESAFIO 🛠️</h3>
            <p className="text-slate-400 text-sm max-w-xs">Monte uma rotina personalizada de treinos para focar onde você mais precisa.</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Harmonia Pesada', icon: '🎸', cat: ExerciseCategory.HARMONY },
              { label: 'Velocidade de Nota', icon: '⚡', cat: ExerciseCategory.NOTES },
              { label: 'Intervalos Ninja', icon: '🥷', cat: ExerciseCategory.INTERVALS },
              { label: 'Mestre das Escalas', icon: '🗺️', cat: ExerciseCategory.SCALES },
            ].map((preset, i) => (
              <button 
                key={i}
                onClick={() => onStartExercise(preset.cat)}
                className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all text-left group"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform">{preset.icon}</span>
                <span className="text-xs font-bold uppercase tracking-tight">{preset.label}</span>
              </button>
            ))}
          </div>

          <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-indigo-900/20 transition-all active:scale-95 border-b-4 border-indigo-800">
            Personalizar Treino Livre
          </button>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-5%] w-32 h-32 bg-purple-500/20 rounded-full blur-2xl" />
      </section>
    </div>
  );
};

export default ChallengesView;
