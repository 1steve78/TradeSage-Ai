import { NavLink, Outlet } from 'react-router-dom'

const navItems = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Portfolio', to: '/portfolio' },
  { label: 'Orders', to: '/orders' },
  { label: 'Watchlist', to: '/watchlist' },
]

function AppLayout() {
  return (
    <main className="min-h-screen px-6 py-8 text-slate-100">
      <div className="mx-auto max-w-6xl">
        <header className="rounded-[2rem] border border-white/10 bg-slate-950/55 p-6 shadow-2xl shadow-slate-950/40 backdrop-blur">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <span className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-sm font-medium tracking-wide text-cyan-200">
                TradeSage-AI
              </span>
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-white md:text-5xl">
                  Trading workspace shell
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                  The router is ready with core pages for dashboard, portfolio,
                  orders, watchlist, login, and registration.
                </p>
              </div>
            </div>

            <nav className="flex flex-wrap gap-3">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `rounded-full px-4 py-2 text-sm font-medium transition ${
                      isActive
                        ? 'bg-cyan-400 text-slate-950'
                        : 'bg-white/8 text-slate-200 ring-1 ring-white/10 hover:bg-white/14'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </header>

        <section className="mt-8">
          <Outlet />
        </section>
      </div>
    </main>
  )
}

export default AppLayout
