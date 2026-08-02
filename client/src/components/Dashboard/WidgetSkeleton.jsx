import React from "react";

const WidgetSkeleton = () => {
    return (
        <div className="w-full h-full flex flex-col gap-4">
            <div className="h-6 w-1/3 skeleton rounded"></div>
            <div className="h-4 w-1/2 skeleton rounded"></div>
            <div className="flex-1 min-h-[100px] w-full skeleton rounded"></div>
        </div>
    );
};

export default WidgetSkeleton;
