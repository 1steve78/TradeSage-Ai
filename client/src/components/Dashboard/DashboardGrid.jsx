import React from "react";

const DashboardGrid = ({ children }) => {
    return (
        <div className="max-w-[1400px] mx-auto p-lg space-y-gutter">
            {children}
        </div>
    );
};

export const DashboardRow = ({ children }) => (
    <div className="grid grid-cols-12 gap-gutter">
        {children}
    </div>
);

export default DashboardGrid;
