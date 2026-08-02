import React, { useState, useEffect, useCallback } from "react";
import FilterPanel from "../components/Scanner/FilterPanel";
import ScannerResults from "../components/Scanner/ScannerResults";
import { getScannerResults } from "../services/scannerApi";

const Scanner = () => {
    const [filters, setFilters] = useState({
        priceMin: "",
        priceMax: "",
        minVolume: "",
        sector: "All",
        sentiment: "All",
        sortBy: "Highest Score"
    });
    
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchResults = useCallback(async () => {
        try {
            setLoading(true);
            const res = await getScannerResults(filters);
            setResults(res.data?.results || []);
        } catch (err) {
            console.error("Scanner Error:", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    // Re-fetch when filters change
    useEffect(() => {
        // debounce slightly so typing in price doesn't spam requests immediately
        const timer = setTimeout(() => {
            fetchResults();
        }, 300);
        return () => clearTimeout(timer);
    }, [fetchResults]);

    const handleFilterChange = (name, value) => {
        if (name === "reset") {
            setFilters({
                priceMin: "",
                priceMax: "",
                minVolume: "",
                sector: "All",
                sentiment: "All",
                sortBy: "Highest Score"
            });
        } else {
            setFilters(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    return (
        <div className="max-w-[1400px] mx-auto p-lg">
            <div className="mb-lg">
                <h1 className="font-display-lg text-[28px] font-black text-on-surface">AI Market Scanner</h1>
                <p className="text-body-sm text-on-surface-variant mt-1">Discover opportunities using technical, fundamental, and AI sentiment indicators.</p>
            </div>

            <FilterPanel filters={filters} onFilterChange={handleFilterChange} />
            
            {error && (
                <div className="p-md mb-md bg-loss/10 text-loss rounded border border-loss/20">
                    Failed to load scanner results: {error.toString()}
                </div>
            )}

            <div className="flex justify-between items-center mb-md">
                <span className="font-label-caps text-[12px] text-secondary">
                    {loading ? "SCANNING MARKET..." : `${results.length} OPPORTUNITIES FOUND`}
                </span>
                <span className="font-label-caps text-[10px] text-outline">AUTO-REFRESH: 5 MIN</span>
            </div>

            <ScannerResults results={results} loading={loading} />
        </div>
    );
};

export default Scanner;
