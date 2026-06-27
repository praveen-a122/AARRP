export const theme = {
  colors: {
    background: '#0b0f19',
    surface: '#111827',
    primary: '#6366f1',
    accent: '#06b6d4',
    success: '#10b981',
    error: '#ef4444',
  },
  transitions: {
    default: 'transition-all duration-200 ease-in-out',
  },
  classes: {
    card: 'bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-xl p-6 shadow-xl hover:border-slate-700 transition-all',
    buttonPrimary: 'bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-500 text-white font-medium py-2.5 px-5 rounded-lg shadow-lg shadow-indigo-500/25 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2',
    buttonSecondary: 'bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium py-2.5 px-5 rounded-lg border border-slate-700 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2',
    input: 'w-full bg-slate-950/50 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-500',
  }
};
