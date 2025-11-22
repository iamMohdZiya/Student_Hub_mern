export default function LoadingSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="flex flex-col items-center gap-5 text-center">
        <div className="relative">
          <div className="h-20 w-20 rounded-full border-4 border-white/10" />
          <div className="absolute inset-0 h-20 w-20 rounded-full border-4 border-transparent border-t-indigo-400 border-r-purple-500 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 text-lg font-bold text-white shadow-lg shadow-indigo-900/40">
              SN
            </div>
          </div>
        </div>
        <div>
          <p className="gradient-text text-lg font-semibold">Loading your experience</p>
          <p className="text-sm text-slate-400">Hang tight, we are preparing the dashboard.</p>
        </div>
      </div>
    </div>
  );
}
