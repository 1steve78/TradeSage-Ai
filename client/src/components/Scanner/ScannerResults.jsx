import React from "react";
import ScannerCard from "./ScannerCard";

const ScannerResults = ({ results, loading }) => {
    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-surface-container-lowest border border-outline-variant rounded-lg p-lg h-64 flex flex-col gap-4">
                        <div className="flex justify-between">
                            <div className="h-6 w-1/3 skeleton rounded"></div>
                            <div className="h-8 w-16 skeleton rounded"></div>
                        </div>
                        <div className="h-4 w-1/2 skeleton rounded"></div>
                        <div className="flex gap-4">
                            <div className="h-4 w-12 skeleton rounded"></div>
                            <div className="h-4 w-12 skeleton rounded"></div>
                        </div>
                        <div className="h-4 w-2/3 skeleton rounded mt-auto"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (!results || results.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-xl border border-dashed border-outline-variant rounded-lg bg-surface-container-lowest mt-lg py-32 text-center">
                <span className="material-symbols-outlined text-[48px] text-outline mb-md">manage_search</span>
                <h3 className="font-title-sm text-lg text-primary mb-sm">No stocks match your filters.</h3>
                <p className="text-body-sm text-on-surface-variant max-w-sm">
                    Try widening your price range, volume requirements, or removing one or more filters to see more results.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-lg mt-lg">
            {results.map((item, index) => (
                <ScannerCard key={index} data={item} />
            ))}
        </div>
    );
};

export default ScannerResults;
