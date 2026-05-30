import React, { useState, useEffect } from 'react';
import { fetchDojiScan } from './api'; // Connects directly to your backend API layer

export default function DojiScreener() {
  // Active state trackers
  const [timeframe, setTimeframe] = useState('1D');
  const [screenerStocks, setScreenerStocks] = useState([]);
  const [screenerLoading, setScreenerLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('table'); // Toggles: 'table' or 'gallery'

  // Automatic side-effect: Fetches fresh cloud data whenever the selected timeframe updates
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
        console.error("API Response Failure:", response.error);
      }
    } catch (err) {
      console.error("Failed to execute data matrices fetch:", err);
    } finally {
      setScreenerLoading(false);
    }
  };

  // FUNCTIONAL: Filters out matching tickers instantly as you type inside the input box
  const filteredStocks = screenerStocks.filter(stock => 
    stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stock.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6 font-sans">
      
      {/* Top Main Information Banner */}
      <div className="max-w-6xl mx-auto bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6 shadow-xl">
        <h1 className="text-2xl font-bold text-white mb-2">Doji - 2 Candlestick Screener</h1>
        <p className="text-sm text-gray-400">
          Filters stocks forming precise equilibrium neutral doji patterns across selected timeframes.
        </p>
      </div>

      {/* Logic Filter Rules Display Card */}
      <div className="max-w-6xl mx-auto bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6 shadow-xl">
        <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Filter Logic Engine</h2>
          
          {/* Functional Timeframe Buttons */}
          <div className="flex space-x-1 bg-gray-900 p-1 rounded-md border border-gray-700">
            {['1D', '1W', '1M'].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-4 py-1.5 text-xs font-medium rounded transition-all duration-150 ${
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

        {/* Condition Check Blocks */}
        <div className="space-y-3">
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

      {/* Main Interactive Workspace Area */}
      <div className="max-w-6xl mx-auto bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden">
        
        {/* Navigation Tabs Bar and Search Input */}
        <div className="p-4 bg-gray-800/50 border-b border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
          
          {/* Tab Selection Switches */}
          <div className="flex space-x-6 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('table')}
              className={`pb-2 text-sm font-semibold transition-all ${
                activeTab === 'table'
                  ? 'text-emerald-400 border-b-2 border-emerald-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Filtered Stocks ({filteredStocks.length})
            </button>
            <button
              onClick={() => setActiveTab('gallery')}
              className={`pb-2 text-sm font-semibold transition-all ${
                activeTab === 'gallery'
                  ? 'text-emerald-400 border-b-2 border-emerald-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Multi-Chart Gallery
            </button>
          </div>

          {/* Real-time Filter Input Box */}
          <input
            type="text"
            placeholder="Quick query symbol or company name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-gray-900 text-gray-200 text-xs rounded border border-gray-700 px-3 py-2 w-full sm:w-64 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* View Switch Logic Implementation */}
        {activeTab === 'table' ? (
          /* TAB 1: Main Analytical Grid Table Layout */
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-900/40 text-gray-400 text-[11px] font-semibold uppercase tracking-wider border-b border-gray-700">
                  <th className="p-4 w-16 text-center">Sr.</th>
                  <th className="p-4">Stock Name</th>
                  <th className="p-4">Symbol</th>
                  <th className="p-4">Links</th>
                  <th className="p-4">Price (INR)</th>
                  <th className="p-4">Chg %</th>
                  <th className="p-4 text-right pr-6">Volume</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/60 text-xs">
                {screenerLoading ? (
                  <tr>
                    <td colSpan="7" className="p-12 text-center text-gray-400 tracking-wide">
                      <div className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500 mr-3 align-middle"></div>
                      Scanning live market metrics matrices...
                    </td>
                  </tr>
                ) : filteredStocks.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-12 text-center text-gray-500">
                      No equities matched the specified Doji search parameters in this dataset.
                    </td>
                  </tr>
                ) : (
                  filteredStocks.map((stock, index) => (
                    <tr key={stock.symbol} className="hover:bg-gray-700/30 transition-colors">
                      <td className="p-4 text-center text-gray-500 font-medium">{index + 1}</td>
                      <td className="p-4 font-semibold text-white">{stock.name}</td>
                      
                      {/* FUNCTIONAL: Dynamic external chart linking trigger anchor */}
                      <td className="p-4 text-blue-400 font-bold tracking-wide">
                        <a 
                          href={`https://www.tradingview.com/symbols/NSE-${stock.symbol}/`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline hover:text-blue-300"
                        >
                          {stock.symbol}
                        </a>
                      </td>
                      
                      {/* FUNCTIONAL: Sub-market link setup matrix */}
                      <td className="p-4 text-xs text-gray-400">
                        <span className="text-gray-600">BSE •</span>{' '}
                        <a 
                          href={`https://www.tradingview.com/symbols/NSE-${stock.symbol}/`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline font-medium"
                        >
                          Chart
                        </a>
                      </td>

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
        ) : (
          /* TAB 2: Dynamic Chart Gallery Visualization Deck */
          <div className="p-6 bg-gray-900/30">
            {filteredStocks.length === 0 ? (
              <div className="p-12 text-center text-gray-500 text-xs">
                No charts available because no equities match the current logic criteria filter.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredStocks.map((stock) => (
                  <div key={stock.symbol} className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden shadow-md">
                    <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex justify-between items-center">
                      <span className="font-bold text-xs text-white tracking-wide">{stock.name} ({stock.symbol})</span>
                      <span className={`text-[11px] font-mono font-bold ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        ₹{stock.price} ({stock.change >= 0 ? `+${stock.change}%` : `${stock.change}%`})
                      </span>
                    </div>
                    {/* Embedded Chart Frame Container Panel */}
                    <div className="w-full h-64 bg-gray-950 flex flex-col items-center justify-center p-4 text-center">
                      <p className="text-xs text-gray-400 mb-3">Interactive {timeframe} Candlestick Chart Window</p>
                      <a
                        href={`https://www.tradingview.com/symbols/NSE-${stock.symbol}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[11px] px-4 py-2 rounded shadow transition-all"
                      >
                        Launch Interactive Technical View
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}