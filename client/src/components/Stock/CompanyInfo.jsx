const CompanyInfo = ({ info, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white border border-[#e2e8f0] p-md rounded mb-md animate-pulse">
        <div className="h-4 bg-slate-200 rounded w-1/3 mb-4"></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-8 bg-slate-100 rounded"></div>
          <div className="h-8 bg-slate-100 rounded"></div>
        </div>
      </div>
    );
  }

  if (!info) return null;

  return (
    <div className="bg-white border border-[#e2e8f0] p-md rounded mb-md">
      <h3 className="font-label-caps text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3">
        Company Profile
      </h3>
      <div className="grid grid-cols-2 gap-y-3 gap-x-4">
        <div>
          <p className="text-[10px] text-slate-400 uppercase font-bold mb-0.5">Sector</p>
          <p className="text-xs font-semibold text-[#0f172a]">{info.sector || "--"}</p>
        </div>
        <div>
          <p className="text-[10px] text-slate-400 uppercase font-bold mb-0.5">Industry</p>
          <p className="text-xs font-semibold text-[#0f172a]">{info.industry || "--"}</p>
        </div>
        <div>
          <p className="text-[10px] text-slate-400 uppercase font-bold mb-0.5">Exchange</p>
          <p className="text-xs font-semibold text-[#0f172a]">{info.exchange || "--"}</p>
        </div>
        <div>
          <p className="text-[10px] text-slate-400 uppercase font-bold mb-0.5">Currency</p>
          <p className="text-xs font-semibold text-[#0f172a]">{info.currency || "--"}</p>
        </div>
      </div>
    </div>
  );
};

export default CompanyInfo;
