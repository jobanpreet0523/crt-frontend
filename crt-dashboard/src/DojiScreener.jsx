import React, { useState, useEffect } from 'react';
import { fetchDojiScan } from './api'; // Pulls from your live Render URL

export default function DojiScreener() {
  const [timeframe, setTimeframe] = useState('1D');
  const [screenerStocks, setScreenerStocks] = useState([]);
  const [screenerLoading, setScreenerLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // 🏁 AUTOMATIC INITIAL LOAD: Fetch data immediately when page loads
  useEffect(() => {
    loadScreenerData(timeframe);
  }, [timeframe]);

  const loadScreenerData = async (selectedTimeframe) => {
    setScreenerLoading(true);
    try {
      const response = await fetchDojiScan(selectedTimeframe);
      if (response.ok) {
        setScreenerStocks(response.results || []);
      } else {
        console.error("API Error:", response.error);
      }
    } catch (err) {
      console.error("Failed fetching stocks:", err);
    } finally {
      setScreenerLoading(false);
    }
  };

  // Filter stocks based on search input
  const filteredStocks = screenerStocks.filter(stock => 
    stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stock.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6 font-sans">
      {/* Header Panel */}
      <div className="max-w-6xl mx-auto bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6 shadow-xl">
        <h1 className="text-2xl font-bold text-white mb-2">Doji - 2 Candlestick Screener</h1>
        <p className="text-sm text-gray-400">
          Filters stocks forming precise equilibrium neutral doji patterns across selected timeframes.
        </p>
      </div>

      {/* Filter Logic Panel */}
      <div className="max-w-6xl mx-auto bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6 shadow-xl">
        <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Filter Logic Engine</h2>
          
          {/* Timeframe Selectors */}
          <div className="flex space-x-1 bg-gray-900 p-1 rounded-md border border-gray-700">
            {['1D', '1W', '1M'].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-4 py-1.5 text-xs font-medium rounded transition-colors ${
                  timeframe === tf 
                    ? 'bg-blue-600 text-white shadow' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                {tf === '1D' ? 'Daily' : tf === '1W' ? 'Weekly' : 'Monthly'}
              </button>
            ))}
          </div>
        </div>

        {/* Math Rules Criteria display */}
        <div className="space-y-3 mb-2">
          <div className="flex items-center space-x-3 bg-gray-900/50 p-3 rounded border border-gray-800 text-xs text-gray-300">
            <span className="bg-green-900/80 text-green-400 font-bold px-2 py-0.5 rounded border border-green-700/50 text-[10px]">PASS</span>
            <span>Latest Close matches Latest Open within 0.1% of Close (Doji Body Rule)</span>
          </div>
          <div className="flex items-center space-x-3 bg-gray-900/50 p-3 rounded border border-gray-800 text-xs text-gray-300">
            <span className="bg-green-900/80 text-green-400 font-bold px-2 py-0.5 rounded border border-green-700/50 text-[10px]">PASS</span>
            <span>Latest Volume greater than 100,000 (Liquidity Rule)</span>
          </div>
        </div>
      </div>

      {/* Main Stock Table Display */}
      <div className="max-w-6xl mx-auto bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden">
        
        {/* Table Filter Options */}
        <div className="p-4 bg-gray-800/50 border-b border-gray-700 flex justify-between items-center">
          <div className="text-sm font-semibold text-emerald-400 border-b-2 border-emerald-500 pb-4 -mb-4 px-2">
            Filtered Stocks ({filteredStocks.length})
          </div>
          <input
            type="text"
            placeholder="Quick query symbol or company name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-gray-900 text-gray-200 text-xs rounded border border-gray-700 px-3 py-2 w-64 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Data Grid matrix */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-900/40 text-gray-400 text-[11px] font-semibold uppercase tracking-wider border-b border-gray-700">
                <th className="p-4 w-16 text-center">Sr.</th>
                <th className="p-4">Stock Name</th>
                <th className="p-4">Symbol</th>
                <th className="p-4">Price (INR)</th>
                <th className="p-4">Chg %</th>
                <th className="p-4 text-right pr-6">Volume</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/60 text-xs">
              {screenerLoading ? (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-gray-400 tracking-wide">
                    <div className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500 mr-3 align-middle"></div>
                    Scanning market data matrices...
                  </td>
                </tr>
              ) : filteredStocks.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-gray-500">
                    No equities matched the specified Doji neutral rules inside this window.
                  </td>
                </tr>
              ) : (
                filteredStocks.map((stock, index) => (
                  <tr key={stock.symbol} className="hover:bg-gray-700/30 transition-colors">
                    <td className="p-4 text-center text-gray-500 font-medium">{index + 1}</td>
                    <td className="p-4 font-semibold text-white">{stock.name}</td>
                    <td className="p-4 text-blue-400 font-bold tracking-wide">{stock.symbol}</td>
                    <td className="p-4 font-mono text-gray-200">₹{parseFloat(stock.price).toFixed(2)}</td>
                    <td className={`p-4 font-bold font-mono ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {stock.change >= 0 ? `+${stock.change.toFixed(2)}%` : `${stock.change.toFixed(2)}%`}
                    </td>
                    <td className="p-4 text-right pr-6 font-mono text-gray-300">
                      {stock.volume.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}