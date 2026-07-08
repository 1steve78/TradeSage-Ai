import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12 text-slate-100">
      <section className="w-full max-w-lg rounded-[2rem] border border-white/10 bg-slate-950/55 p-8 text-center shadow-2xl shadow-slate-950/40 backdrop-blur">
        <p className="text-sm uppercase tracking-[0.25em] text-cyan-200">404</p>
        <h1 className="mt-3 text-4xl font-semibold text-white">Page not found</h1>
        <p className="mt-4 text-slate-300">
          The route you requested does not exist in the current TradeSage-AI app shell.
        </p>
        <Link
          to="/dashboard"
          className="mt-6 inline-flex rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
        >
          Go to dashboard
        </Link>
      </section>
    </main>
  )
}

export default NotFound
