
import React, { useState, useEffect } from 'react';
import { ViewState, UserStats, ExerciseCategory } from './types';
import Navigation from './components/Navigation';
import Dashboard from './views/Dashboard';
import ExerciseEngine from './components/ExerciseEngine';
import PianoView from './views/PianoView';
import ChallengesView from './views/ChallengesView';
import ProgressView from './views/ProgressView';
import LoginView from './views/LoginView';
import { loadUserStats, saveUserStats, supabase, signOut } from './services/supabase';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('STUDY');
  const [activeCategory, setActiveCategory] = useState<ExerciseCategory | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  
  const [stats, setStats] = useState<UserStats>({
    name: '',
    xp: 0,
    level: 1,
    streak: 0,
    history: []
  });

  const checkUser = async () => {
    setIsLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      const cloudStats = await loadUserStats();
      if (cloudStats) {
        setStats(cloudStats);
      }
      setShowLogin(false);
    } else {
      setShowLogin(true);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    checkUser();

    // Listener para mudanças de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') checkUser();
      if (event === 'SIGNED_OUT') {
        setShowLogin(true);
        setStats({ name: '', xp: 0, level: 1, streak: 0, history: [] });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Sync with Supabase on stats change
  useEffect(() => {
    if (isLoading || showLogin) return; 

    const syncData = async () => {
      setIsSyncing(true);
      await saveUserStats(stats);
      setIsSyncing(false);
    };

    const timer = setTimeout(syncData, 2000);
    return () => clearTimeout(timer);
  }, [stats, isLoading, showLogin]);

  const handleLogout = async () => {
    await signOut();
  };

  const handleExerciseComplete = (score: number) => {
    const newXp = stats.xp + score;
    const newLevel = Math.floor(newXp / 100) + 1;
    
    setStats(prev => {
      const today = new Date().toISOString().split('T')[0];
      const hasActivityToday = prev.history.some(h => h.date.startsWith(today));
      
      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        streak: hasActivityToday ? prev.streak : prev.streak + 1,
        history: [...prev.history, {
          date: new Date().toISOString(),
          score,
          category: activeCategory!
        }]
      };
    });
    
    setCurrentView('STUDY');
    setActiveCategory(null);
  };

  const startExercise = (category: ExerciseCategory) => {
    setActiveCategory(category);
    setCurrentView('EXERCISE');
  };

  const openPianoFree = () => {
    setCurrentView('PIANO_FREE');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0F172A] space-y-4">
        <div className="w-16 h-16 border-4 border-white/10 border-t-indigo-500 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-bold animate-pulse">Iniciando Harmonix...</p>
      </div>
    );
  }

  if (showLogin) {
    return <LoginView onAuthSuccess={checkUser} />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 md:pb-0 md:pl-20">
      {/* Top Header */}
      <div className="flex items-center justify-between p-4 sticky top-0 bg-[#F8FAFC]/80 backdrop-blur-md z-40 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="font-black text-indigo-600 tracking-tighter text-xl">HARMONIX</span>
          <div className={`transition-opacity duration-300 ${isSyncing ? 'opacity-100' : 'opacity-0'}`}>
            <div className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-slate-100 shadow-sm">
            <span className="text-orange-500 font-bold text-sm">🔥 {stats.streak}</span>
            <span className="text-indigo-600 font-bold text-sm">{stats.xp} XP</span>
          </div>
          <button 
            onClick={() => setCurrentView('PROFILE')}
            className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-black text-xs hover:bg-indigo-200 transition-colors"
          >
            {stats.name?.charAt(0).toUpperCase()}
          </button>
        </div>
      </div>

      <main className="max-w-4xl mx-auto p-4 py-8">
        {currentView === 'STUDY' && (
          <Dashboard 
            stats={stats} 
            onSelectCategory={startExercise} 
            onSelectPianoFree={openPianoFree}
          />
        )}

        {currentView === 'PIANO_FREE' && (
          <PianoView onExit={() => setCurrentView('STUDY')} />
        )}

        {currentView === 'CHALLENGES' && (
          <ChallengesView 
            stats={stats}
            onStartExercise={startExercise}
          />
        )}

        {currentView === 'PROGRESS' && (
          <ProgressView stats={stats} />
        )}

        {currentView === 'EXERCISE' && activeCategory && (
          <ExerciseEngine 
            category={activeCategory} 
            onComplete={handleExerciseComplete}
            onExit={() => setCurrentView('STUDY')}
          />
        )}

        {currentView === 'PROFILE' && (
           <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-6">
             <div className="text-7xl">👤</div>
             <div className="text-center">
               <h2 className="text-3xl font-black text-slate-800">{stats.name}</h2>
               <p className="font-medium text-slate-500">Nível {stats.level} • Mestre da Harmonia</p>
             </div>
             
             <div className="flex flex-col gap-3 w-full max-w-xs">
                <button 
                  onClick={() => setCurrentView('STUDY')}
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                >
                  Voltar para o Início
                </button>
                <button 
                  onClick={handleLogout}
                  className="w-full py-3 bg-red-50 text-red-500 rounded-2xl font-bold hover:bg-red-100 transition-all"
                >
                  Sair da Conta
                </button>
             </div>
           </div>
        )}
      </main>

      <Navigation currentView={currentView} onViewChange={setCurrentView} />
    </div>
  );
};

export default App;
