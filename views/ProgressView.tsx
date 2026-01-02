
import React, { useState, useEffect, useMemo } from 'react';
import { UserStats, ExerciseCategory } from '../types';
import { getProgressInsights } from '../services/gemini';

interface ProgressViewProps {
  stats: UserStats;
}

const ProgressView: React.FC<ProgressViewProps> = ({ stats }) => {
  const [aiInsight, setAiInsight] = useState<string>("Analisando seu desempenho...");

  useEffect(() => {
    const fetchInsight = async () => {
      if (stats.history.length === 0) {
        setAiInsight("Comece a praticar para que eu possa analisar sua evolução!");
        return;
      }
      const insight = await getProgressInsights(stats.history);
      setAiInsight(insight);
    };
    fetchInsight();
  }, [stats.history]);

  // Calculations for charts
  const categoryMastery = useMemo(() => {
    const totals: Record<string, number> = {
      [ExerciseCategory.NOTES]: 0,
      [ExerciseCategory.SCALES]: 0,
      [ExerciseCategory.HARMONY]: 0,
      [ExerciseCategory.INTERVALS]: 0
    };

    stats.history.forEach(h => {
      if (totals[h.category] !== undefined) {
        totals[h.category] += h.score;
      }
    });

    const maxScore = Math.max(...Object.values(totals), 500); // Baseline max for percentage
    return Object.entries(totals).map(([cat, score]) => ({
      name: cat,
      score,
      percentage: Math.min((score / maxScore) * 100, 100)
    }));
  }, [stats.history]);

  const categoryConfig: Record<string, { label: string; color: string }> = {
    [ExerciseCategory.NOTES]: { label: 'Notas', color: 'bg-blue-500' },
    [ExerciseCategory.SCALES]: { label: 'Escalas', color: 'bg-emerald-500' },
    [ExerciseCategory.HARMONY]: { label: 'Campos Harmônicos', color: 'bg-amber-500' },
    [ExerciseCategory.INTERVALS]: { label: 'Intervalos', color: 'bg-purple-500' }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      <header className="space-y-2">
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">Sua Evolução 📈</h2>
        <p className="text-slate-500">Acompanhe seu crescimento e domine a linguagem da música.</p>
      </header>

      {/* Highlights */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'XP TOTAL', value: stats.xp, color: 'text-indigo-600' },
          { label: 'NÍVEL', value: stats.level, color: 'text-emerald-600' },
          { label: 'TREINOS', value: stats.history.length, color: 'text-blue-600' },
          { label: 'OFENSIVA', value: `${stats.streak}d`, color: 'text-orange-500' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm text-center">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</div>
            <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* AI Insight Card */}
      <section className="bg-white rounded-[2rem] p-8 border-2 border-indigo-50 relative overflow-hidden group shadow-xl shadow-indigo-50/50">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-indigo-200 shrink-0 animate-pulse">
            🧠
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-slate-800 uppercase text-xs tracking-widest">Análise de Performance IA</h3>
            <p className="text-lg text-slate-700 font-medium leading-snug italic">
              "{aiInsight}"
            </p>
          </div>
        </div>
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
          </svg>
        </div>
      </section>

      {/* Category Mastery Chart */}
      <section className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
          <span>🎯</span> Domínio por Área
        </h3>
        <div className="space-y-6">
          {categoryMastery.map((cat) => (
            <div key={cat.name} className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <span className="text-sm font-bold text-slate-600">{categoryConfig[cat.name]?.label || cat.name}</span>
                <span className="text-xs font-black text-indigo-500">{cat.score} XP</span>
              </div>
              <div className="h-4 bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-0.5">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${categoryConfig[cat.name]?.color || 'bg-slate-400'}`}
                  style={{ width: `${cat.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Study History Simple List */}
      <section className="bg-slate-900 rounded-[2rem] p-6 text-white overflow-hidden">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <span>🕒</span> Atividade Recente
        </h3>
        <div className="space-y-3">
          {stats.history.slice(-5).reverse().map((h, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${categoryConfig[h.category]?.color || 'bg-white'}`} />
                <span className="text-sm font-medium">{categoryConfig[h.category]?.label || h.category}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-slate-400">
                  {new Date(h.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                </span>
                <span className="text-sm font-bold text-emerald-400">+{h.score} XP</span>
              </div>
            </div>
          ))}
          {stats.history.length === 0 && (
            <p className="text-center py-4 text-slate-500 text-sm">Nenhuma atividade registrada ainda.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProgressView;
