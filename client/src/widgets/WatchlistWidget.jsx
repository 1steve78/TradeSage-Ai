import React from "react";
import Widget from "../components/Dashboard/Widget";
import useMarketStore from "../store/marketStore";

const WatchlistWidget = ({ watchlist, loading }) => {
    // Flatten watchlist stocks if needed or take the first watchlist
    const mainWatchlist = watchlist && watchlist.length > 0 ? watchlist[0].stocks : [];
    // Pull live prices from the market store (fed by Smart API WebSocket)
    const prices = useMarketStore((state) => state.prices);

    const headerRight = (
        <button className="text-secondary font-label-caps text-[11px] flex items-center gap-xs hover:text-primary transition-colors">
            EDIT <span className="material-symbols-outlined text-[16px]">edit</span>
        </button>
    );

    return (
        <div className="col-span-12 lg:col-span-8 overflow-hidden">
            <Widget title="Watchlist" headerRight={headerRight} loading={loading} noPadding className="h-full">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-surface text-secondary font-label-caps text-[11px]">
                            <tr>
                                <th className="px-lg py-sm font-bold">INSTRUMENT</th>
                                <th className="px-lg py-sm font-bold text-right">LAST PRICE</th>
                                <th className="px-lg py-sm font-bold text-right">CHANGE</th>
                                <th className="px-lg py-sm font-bold text-right hidden md:table-cell">VOLUME</th>
                                <th className="px-lg py-sm font-bold text-right">ACTION</th>
                            </tr>
                        </thead>
                        <tbody className="text-body-sm font-data-mono divide-y divide-outline-variant">
                            {mainWatchlist.length > 0 ? (
                                mainWatchlist.slice(0, 5).map((stock, i) => {
                                    // Use live price from Smart API WebSocket if available
                                    const liveData = prices[stock.symbol];
                                    const livePrice = liveData?.price;
                                    const prevPrice = liveData?.previousPrice;
                                    const changePct = livePrice && prevPrice && prevPrice !== 0
                                        ? (((livePrice - prevPrice) / prevPrice) * 100).toFixed(2)
                                        : null;

                                    return (
                                        <tr key={i} className="hover:bg-surface-container-low transition-colors group">
                                            <td className="px-lg py-sm">
                                                <div className="flex items-center gap-md">
                                                    <span className="font-bold text-primary">{stock.symbol}</span>
                                                </div>
                                            </td>
                                            <td className="px-lg py-sm text-right">
                                                {livePrice != null ? `₹${livePrice.toFixed(2)}` : "--"}
                                            </td>
                                            <td className={`px-lg py-sm text-right ${changePct != null ? (Number(changePct) >= 0 ? 'text-gain' : 'text-loss') : 'text-outline'}`}>
                                                {changePct != null
                                                    ? `${Number(changePct) >= 0 ? '+' : ''}${changePct}%`
                                                    : "--"}
                                            </td>
                                            <td className="px-lg py-sm text-right text-outline hidden md:table-cell">--</td>
                                            <td className="px-lg py-sm text-right">
                                                <span className="material-symbols-outlined text-outline cursor-pointer hover:text-primary">more_horiz</span>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-lg py-lg text-center text-outline">
                                        No stocks in watchlist yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Widget>
        </div>
    );
};

export default WatchlistWidget;
