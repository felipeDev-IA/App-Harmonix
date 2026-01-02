
import React from 'react';
import { ViewState } from '../types';

interface NavigationProps {
  currentView: ViewState;
  onViewChange: (view: ViewState) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onViewChange }) => {
  const tabs = [
    { id: 'STUDY', label: 'Estudo', icon: 'M12 19l9 2-9-18-9 18 9-2zm0 0v-8' },
    { id: 'CHALLENGES', label: 'Desafios', icon: 'M12 15l-3-3m0 0l3-3m-3 3h8M5 12a7 7 0 1114 0 7 7 0 01-14 0z' },
    { id: 'PROGRESS', label: 'Evolução', icon: 'M13 17h8m-8-5h8m-8-5h8M3 17l2-2 3 3 5-5' },
    { id: 'PROFILE', label: 'Perfil', icon: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 7a4 4 0 110-8 4 4 0 010 8z' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full md:left-0 md:top-0 md:w-20 md:h-screen bg-white border-t md:border-t-0 md:border-r border-slate-200 p-2 md:p-4 flex flex-row md:flex-col justify-around md:justify-center items-center z-50">
      {/* Desktop Logo Spacer */}
      <div className="hidden md:block absolute top-8 font-black text-indigo-600 -rotate-90 origin-center whitespace-nowrap">
        HARMONIX
      </div>

      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onViewChange(tab.id as ViewState)}
          className={`flex flex-col items-center gap-1 p-2 md:p-3 rounded-2xl transition-all duration-200 group
            ${currentView === tab.id 
              ? 'text-indigo-600 bg-indigo-50' 
              : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="transition-transform group-hover:scale-110"
          >
            <path d={tab.icon} />
          </svg>
          <span className="text-[10px] md:hidden font-bold uppercase tracking-tight">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default Navigation;
