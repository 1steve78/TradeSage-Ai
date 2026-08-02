import React from "react";
import WidgetSkeleton from "./WidgetSkeleton";

const Widget = ({ title, loading, children, className = "", noPadding = false, headerRight }) => {
    return (
        <div className={`bg-surface-container-lowest border border-outline-variant rounded-lg flex flex-col ${noPadding ? '' : 'p-lg'} ${className}`}>
            {title && (
                <div className={`flex justify-between items-center ${noPadding ? 'px-lg py-md border-b border-outline-variant bg-surface-container-lowest' : 'mb-md'}`}>
                    <h3 className="font-title-sm text-title-sm">{title}</h3>
                    {headerRight && <div>{headerRight}</div>}
                </div>
            )}
            <div className={`flex-1 ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
                {loading ? <WidgetSkeleton /> : children}
            </div>
        </div>
    );
};

export default Widget;
