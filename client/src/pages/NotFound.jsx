import { Link } from 'react-router-dom'
import { useEffect } from 'react'

export default function NotFound() {
  useEffect(() => {
    document.title = '404 Page Not Found — Persona'
  }, [])

  return (
    <div className="min-h-screen bg-[#121214] text-[#f4f4f6] flex items-center justify-center p-4">
      <div className="max-w-md w-full rounded-2xl bg-[#19191d] border border-[#26262e] p-8 text-center shadow-xl animate-fade-in">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center text-2xl font-black">
          404
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight">
          Discussion Not Found
        </h1>
        <p className="text-zinc-400 text-xs mt-2 leading-relaxed">
          The page or discussion you are looking for has been moved, removed, or does not exist.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-full text-xs font-extrabold text-slate-950 bg-amber-500 hover:bg-amber-400 transition-all uppercase tracking-wider shadow-md"
          >
            ← Return to Home Feed
          </Link>
        </div>
      </div>
    </div>
  )
}
