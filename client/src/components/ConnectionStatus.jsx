import useMarketStore from "../store/marketStore";

const ConnectionStatus = () => {
  const connected = useMarketStore((state) => state.connected);

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold tracking-wide transition-all duration-300 shadow-sm ${
        connected
          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-emerald-500/5"
          : "bg-rose-500/10 border-rose-500/30 text-rose-400 shadow-rose-500/5"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          connected ? "bg-emerald-400 animate-pulse" : "bg-rose-400"
        }`}
      ></span>
      <span>{connected ? "Live" : "Offline"}</span>
    </div>
  );
};

export default ConnectionStatus;
