const InstitutionalNews = () => {
  const news = [
    { time: "14:20", source: "REUTERS", headline: "Fed hints at potential rate plateau through Q3." },
    { time: "13:45", source: "BLOOMBERG", headline: "BlackRock expands tokenized fund offerings." },
    { time: "12:10", source: "CNBC", headline: "Tech sector rally continues despite valuation concerns." },
    { time: "11:30", source: "WSJ", headline: "Oil prices stabilize as global supply concerns ease slightly." },
  ];

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-[4px] p-6 space-y-4">
      <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
        Institutional News
      </h3>

      <div className="space-y-4">
        {news.map((item, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex gap-2 text-[9px] font-bold tracking-wider">
              <span className="text-slate-400 font-mono">{item.time}</span>
              <span className="text-slate-300">•</span>
              <span className="text-cyan-700">{item.source}</span>
            </div>
            <p className="text-xs font-semibold text-slate-700 hover:text-[#0f172a] transition leading-normal cursor-pointer">
              {item.headline}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InstitutionalNews;
