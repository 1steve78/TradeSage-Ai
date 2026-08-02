import React from "react";
import Widget from "../components/Dashboard/Widget";

const ActivityWidget = ({ activities, loading }) => {
    return (
        <div className="col-span-12 lg:col-span-8">
            <Widget title="Recent Activity" loading={loading} className="h-full">
                <div className="space-y-lg relative h-[250px] overflow-y-auto custom-scrollbar">
                    {/* Timeline line */}
                    <div className="absolute left-[11px] top-2 bottom-2 w-px bg-outline-variant"></div>
                    
                    {activities && activities.length > 0 ? (
                        activities.map((tx, i) => (
                            <div key={i} className="relative flex gap-lg pl-8">
                                <div className={`absolute left-0 top-1.5 w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-white
                                    ${tx.type === "BUY" ? "bg-gain" : tx.type === "SELL" ? "bg-loss" : "bg-secondary"}
                                `}>
                                    <span className="material-symbols-outlined text-white text-[14px]">
                                        {tx.type === "BUY" ? "add" : tx.type === "SELL" ? "remove" : "update"}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-body-sm font-bold text-primary">
                                        Order Executed: {tx.type} {tx.quantity} {tx.symbol} @ ₹{tx.price}
                                    </p>
                                    <p className="text-body-sm text-on-surface-variant">
                                        Total Amount: ₹{tx.totalAmount.toLocaleString()}
                                    </p>
                                    <span className="font-label-caps text-[10px] text-outline mt-1 block uppercase">
                                        {new Date(tx.createdAt).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-outline mt-10">No recent activity.</div>
                    )}
                </div>
            </Widget>
        </div>
    );
};

export default ActivityWidget;
