import { NavLink, Outlet, useLocation } from 'react-router-dom';
import ConnectionStatus from '../components/ConnectionStatus';
import SearchBar from '../components/SearchBar/SearchBar';

const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: 'grid_view' },
  { label: 'Market', to: '/watchlist', icon: 'monitoring' },
  { label: 'Orders', to: '/orders', icon: 'receipt_long' },
  { label: 'Portfolio', to: '/portfolio', icon: 'account_balance_wallet' },
  { label: 'Insights', to: '/insights', icon: 'insights', isPlaceholder: true },
];

function AppLayout() {
  const location = useLocation();

  // Get human readable title based on active path
  const getPageTitle = () => {
    const activeItem = navItems.find(item => item.to === location.pathname);
    return activeItem ? activeItem.label : 'Terminal X';
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#191c1e] flex font-sans antialiased">
      {/* Fixed Left Sidebar */}
      <aside className="w-64 border-r border-[#e2e8f0] bg-white h-screen fixed left-0 top-0 flex flex-col justify-between p-6 z-30">
        <div className="space-y-8">
          {/* Logo / Brand Header */}
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[32px] text-[#0f172a] font-bold">
              query_stats
            </span>
            <div>
              <h2 className="text-sm font-bold text-[#0f172a] uppercase tracking-wide leading-none">
                Institutional Terminal
              </h2>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1 block">
                Verified Account
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.isPlaceholder ? '#' : item.to}
                onClick={(e) => item.isPlaceholder && e.preventDefault()}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded text-sm font-semibold tracking-wide transition-all ${
                    !item.isPlaceholder && isActive
                      ? 'bg-slate-100 text-[#0f172a]'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  } ${item.isPlaceholder ? 'opacity-50 cursor-not-allowed' : ''}`
                }
              >
                <span className="material-symbols-outlined text-xl">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom Actions & Settings */}
        <div className="space-y-4 pt-6 border-t border-[#e2e8f0]">
          {/* Execute Trade Action Button */}
          <button className="w-full bg-[#0f172a] text-white text-xs font-bold uppercase tracking-wider py-3 rounded hover:bg-slate-800 transition active:scale-[0.98] cursor-pointer">
            Execute Trade
          </button>

          <div className="flex flex-col gap-1 text-slate-500 text-sm font-semibold">
            <NavLink
              to="#"
              onClick={(e) => e.preventDefault()}
              className="flex items-center gap-3 px-4 py-2.5 rounded hover:bg-slate-50 hover:text-slate-900 transition"
            >
              <span className="material-symbols-outlined text-lg">settings</span>
              Settings
            </NavLink>
            <NavLink
              to="#"
              onClick={(e) => e.preventDefault()}
              className="flex items-center gap-3 px-4 py-2.5 rounded hover:bg-slate-50 hover:text-slate-900 transition"
            >
              <span className="material-symbols-outlined text-lg">support</span>
              Support
            </NavLink>
          </div>
        </div>
      </aside>

      {/* Main Workspace Frame */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-[#e2e8f0] bg-white flex items-center justify-between px-8 sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-[#0f172a] tracking-tight">
              Terminal X
            </h1>
            <span className="text-slate-300">/</span>
            <span className="text-sm font-semibold text-slate-500">{getPageTitle()}</span>
          </div>

          {/* Search bar & User controls */}
          <div className="flex items-center gap-6">
            <div className="w-80">
              <SearchBar />
            </div>

            {/* Notification and status controls */}
            <div className="flex items-center gap-4 text-slate-600">
              <button className="p-1.5 hover:bg-slate-100 rounded transition relative cursor-pointer">
                <span className="material-symbols-outlined text-xl">notifications</span>
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
              </button>
              <button className="p-1.5 hover:bg-slate-100 rounded transition cursor-pointer">
                <span className="material-symbols-outlined text-xl">cast</span>
              </button>
              
              {/* Live Status indicator */}
              <ConnectionStatus />
            </div>

            {/* User Profile Info */}
            <div className="flex items-center gap-3 pl-4 border-l border-[#e2e8f0]">
              <div className="text-right">
                <h4 className="text-xs font-bold text-[#0f172a] leading-none">
                  ALEXANDER_V
                </h4>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1 block">
                  Institutional Tier
                </span>
              </div>
              <div className="h-8 w-8 rounded-full bg-[#dae2fd] border border-[#bec6e0] flex items-center justify-center font-bold text-xs text-[#131b2e]">
                AV
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Outlet Body */}
        <main className="p-8 flex-1 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
