import { Link } from 'react-router-dom'

function Login() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12 text-slate-100">
      <section className="w-full max-w-md rounded-[2rem] border border-white/10 bg-slate-950/55 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur">
        <p className="text-sm uppercase tracking-[0.25em] text-cyan-200">Login</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Welcome back</h1>
        <p className="mt-3 text-slate-300">
          This is the placeholder login screen for TradeSage-AI authentication.
        </p>
        <div className="mt-6 rounded-2xl border border-dashed border-white/15 p-4 text-sm text-slate-400">
          Add your form fields here when you build auth.
        </div>
        <p className="mt-6 text-sm text-slate-300">
          Need an account?{' '}
          <Link className="text-cyan-300 hover:text-cyan-200" to="/register">
            Create one
          </Link>
        </p>
      </section>
    </main>
  )
}

export default Login
