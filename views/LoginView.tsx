
import React, { useState } from 'react';
import { signIn, signUp } from '../services/supabase';

interface LoginViewProps {
  onAuthSuccess: () => void;
}

type AuthMode = 'LOGIN' | 'SIGNUP';

const LoginView: React.FC<LoginViewProps> = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState<AuthMode>('LOGIN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ message: string; code?: string } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const REQUIRED_DOMAIN = '@harmonix.com';

  const validateEmailFormat = (email: string) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    try {
      if (!validateEmailFormat(cleanEmail)) {
        throw new Error('Formato de e-mail inválido.');
      }

      if (!cleanEmail.endsWith(REQUIRED_DOMAIN)) {
        throw new Error(`Utilize obrigatoriamente um e-mail ${REQUIRED_DOMAIN}`);
      }

      if (mode === 'SIGNUP') {
        if (password.length < 6) throw new Error('A senha deve ter pelo menos 6 caracteres.');
        if (!cleanName) throw new Error('Por favor, informe seu nome para o perfil.');
        
        const { data, error: signUpError } = await signUp(cleanEmail, password, cleanName);
        
        if (signUpError) {
          if (signUpError.message.includes('already registered')) {
            throw new Error('Este usuário já existe. Tente fazer login.');
          }
          throw signUpError;
        }
        
        if (data?.session) {
          onAuthSuccess();
        } else {
          setEmailSent(true);
        }
      } else {
        const { error: signInError } = await signIn(cleanEmail, password);
        if (signInError) {
          if (signInError.message.includes('Invalid login credentials')) {
            throw new Error('Usuário ou senha incorretos.');
          }
          if (signInError.message.includes('Email not confirmed')) {
            setError({
              message: 'E-mail não confirmado.',
              code: 'EMAIL_NOT_CONFIRMED'
            });
            setLoading(false);
            return;
          }
          throw signInError;
        }
        onAuthSuccess();
      }
    } catch (err: any) {
      setError({ message: err.message || 'Erro ao conectar com o servidor.' });
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen fixed inset-0 z-[100] bg-[#020617] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/[0.03] backdrop-blur-xl border border-white/10 p-10 rounded-[3rem] text-center space-y-6 animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto text-4xl animate-bounce">
            🎼
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Cadastro Iniciado</h2>
          <p className="text-slate-400">
            O usuário <span className="text-indigo-400 font-bold">{email}</span> foi criado.
          </p>
          <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl text-amber-200 text-xs text-left space-y-2">
            <p className="font-bold">⚠️ Nota para o desenvolvedor:</p>
            <p>Se o login falhar por "Email not confirmed", desative a opção <b>"Confirm Email"</b> nas configurações de Auth do seu painel Supabase.</p>
          </div>
          <button 
            onClick={() => { setEmailSent(false); setMode('LOGIN'); }}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg"
          >
            Ir para o Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen fixed inset-0 z-[100] bg-[#020617] flex items-center justify-center p-4 overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px]" />
      
      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-10 animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="relative inline-block group">
            <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 rounded-full group-hover:opacity-40 transition-opacity"></div>
            <div className="relative inline-flex items-center justify-center w-24 h-24 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-[2.5rem] shadow-2xl mb-6 rotate-6 group-hover:rotate-0 transition-all duration-500">
               <span className="text-5xl drop-shadow-lg">🎹</span>
            </div>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter mb-2">HARMONIX</h1>
          <p className="text-slate-400 font-medium text-lg">Acesso exclusivo @harmonix.com</p>
        </div>

        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-8 rounded-[3rem] shadow-2xl space-y-6 animate-in zoom-in-95 duration-500">
          <div className="flex p-1.5 bg-black/40 rounded-2xl border border-white/5">
            <button 
              onClick={() => { setMode('LOGIN'); setError(null); }}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${mode === 'LOGIN' ? 'bg-white text-indigo-900 shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Entrar
            </button>
            <button 
              onClick={() => { setMode('SIGNUP'); setError(null); }}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${mode === 'SIGNUP' ? 'bg-white text-indigo-900 shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Cadastro
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'SIGNUP' && (
              <div className="space-y-1 group">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2 group-focus-within:text-indigo-400 transition-colors">Nome Completo</label>
                <input 
                  type="text" 
                  required
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-5 py-4 bg-white/5 border border-white/10 focus:border-indigo-500 focus:bg-white/10 rounded-2xl outline-none transition-all font-bold text-white placeholder:text-slate-700"
                />
              </div>
            )}

            <div className="space-y-1 group">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2 group-focus-within:text-indigo-400 transition-colors">E-mail Corporativo</label>
              <input 
                type="email" 
                required
                placeholder={`usuario${REQUIRED_DOMAIN}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 bg-white/5 border border-white/10 focus:border-indigo-500 focus:bg-white/10 rounded-2xl outline-none transition-all font-bold text-white placeholder:text-slate-700"
              />
            </div>

            <div className="space-y-1 group">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2 group-focus-within:text-indigo-400 transition-colors">Senha</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-4 bg-white/5 border border-white/10 focus:border-indigo-500 focus:bg-white/10 rounded-2xl outline-none transition-all font-bold text-white placeholder:text-slate-700 pr-12"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-indigo-400 transition-colors p-1"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {error && (
              <div className={`p-4 rounded-2xl text-[11px] font-bold animate-in shake duration-300 border ${
                error.code === 'EMAIL_NOT_CONFIRMED' 
                ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' 
                : 'bg-red-500/10 border-red-500/20 text-red-400'
              }`}>
                <div className="flex gap-2 items-start">
                  <span className="text-base">⚠️</span>
                  <div className="space-y-1">
                    <p>{error.message}</p>
                    {error.code === 'EMAIL_NOT_CONFIRMED' && (
                      <p className="font-normal opacity-80 leading-relaxed">
                        Como você está usando @harmonix.com, desative a opção <b>"Confirm email"</b> nas configurações de Auth do Supabase para logar sem verificação.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-indigo-900/50 transition-all active:scale-[0.98] flex items-center justify-center gap-3 mt-4"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{mode === 'LOGIN' ? 'Acessar Harmonix' : 'Criar Perfil'}</span>
                  <span className="text-lg">✨</span>
                </>
              )}
            </button>
          </form>
          
          <p className="text-center text-[9px] text-slate-600 font-bold uppercase tracking-widest">
            Apenas endereços @harmonix.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
