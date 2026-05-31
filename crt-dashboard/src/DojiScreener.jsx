import React, { useState } from 'react';

export default function DojiScreener() {
  // --- Global State Variables ---
  const [currentTimeframe, setCurrentTimeframe] = useState('1D');
  const [currentTab, setCurrentTab] = useState('results');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'symbol', direction: 'asc' });

  // --- Shared Raw Stocks Mock Data Input Vector ---
  const rawStockDatabase = [
    { name: "HDFC Bank Ltd.", symbol: "HDFCBANK", price: 1511.00, chg: 0.07, volume: 4800000, per_chg: "+0.07%", bse_code: "500180", isDoji: { '1D': true, '1W': true, '1M': true } },
    { name: "ICICI Bank Ltd.", symbol: "ICICIBANK", price: 1120.40, chg: 0.64, volume: 3900000, per_chg: "+0.64%", bse_code: "532174", isDoji: { '1D': true, '1W': false, '1M': true } },
    { name: "Reliance Industries Ltd.", symbol: "RELIANCE", price: 2450.50, chg: 0.02, volume: 3400000, per_chg: "+0.02%", bse_code: "500325", isDoji: { '1D': true, '1W': true, '1M': false } },
    { name: "State Bank of India", symbol: "SBIN", price: 780.20, chg: -0.15, volume: 6100000, per_chg: "-0.15%", bse_code: "500112", isDoji: { '1D': true, '1W': true, '1M': false } },
    { name: "Tata Consultancy Services", symbol: "TCS", price: 3851.00, chg: 0.05, volume: 1200000, per_chg: "+0.05%", bse_code: "532540", isDoji: { '1D': true, '1W': false, '1M': false } },
    { name: "Wipro Ltd.", symbol: "WIPRO", price: 432.00, chg: -0.85, volume: 950000, per_chg: "-0.85%", bse_code: "576851", isDoji: { '1D': false, '1W': true, '1M': false } },
    { name: "Infosys Ltd.", symbol: "INFY", price: 1455.00, chg: -1.24, volume: 2100000, per_chg: "-1.24%", bse_code: "500209", isDoji: { '1D': false, '1W': false, '1M': false } }
  ];

  // --- Computational Data Filtering & Processing ---
  const getFilteredData = () => {
    // 1. Technical Rule Filter mapping
    let filtered = rawStockDatabase.filter(stock => stock.isDoji[currentTimeframe]);

    // 2. Search Text Input Filter mapping
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(stock =>
        stock.name.toLowerCase().includes(query) ||
        stock.symbol.toLowerCase().includes(query)
      );
    }

    // 3. Sorting Execution
    filtered.sort((a, b) => {
      let valA = a[sortConfig.key];
      let valB = b[sortConfig.key];

      if (typeof valA === 'string') {
        return sortConfig.direction === 'asc' 
          ? valA.localeCompare(valB) 
          : valB.localeCompare(valA);
      } else {
        return sortConfig.direction === 'asc' ? valA - valB : valB - valA;
      }
    });

    return filtered;
  };

  // --- Control State Toggles Action Handlers ---
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredData = getFilteredData();

  return (
    <div style={{ paddingBottom: '40px', background: '#f8f9fa', minHeight: '100vh', color: '#333' }}>
      {/* Header Bar */}
      <header style={{ backgroundColor: '#2c3e50', color: 'white', padding: '12px 24px', display: 'flex', justifyContent: 'between', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <a href="#" className="logo" style={{ fontSize: '20px', fontWeight: 'bold', color: '#34d399', textDecoration: 'none' }}>
            CHARTINK <span style={{ fontSize: '12px', color: '#cbd5e1', fontWeight: '300' }}>Clone</span>
          </a>
          <nav style={{ display: 'flex', gap: '16px', fontSize: '14px' }}>
            <a href="#" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</a>
            <a href="#" className="active" style={{ color: '#34d399', borderBottom: '2px solid #34d399', textDecoration: 'none', paddingBottom: '4px' }}>Charts</a>
            <a href="#" style={{ color: 'white', textDecoration: 'none' }}>Screeners</a>
            <a href="#" style={{ color: 'white', textDecoration: 'none' }}>Premium</a>
          </nav>
        </div>
        <div>
          <button className="btn-green" style={{ backgroundColor: '#059669', color: 'white', border: 'none', padding: '8px 16px', fontSize: '12px', fontWeight: '600', borderRadius: '4px', cursor: 'pointer' }}>
            Create Scan
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: '1200px', margin: '24px auto', padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Meta Header Panel */}
        <div className="panel meta-panel" style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div className="meta-title">
            <h2 style={{ fontSize: '20px', color: '#1e293b' }}>Doji - 2 Candlestick Screener</h2>
            <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>Filters stocks forming precise equilibrium neutral doji patterns across selected timeframes.</p>
          </div>
        </div>

        {/* Filter Logic Engine */}
        <div className="panel" style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div className="engine-header" style={{ background: '#f8fafc', padding: '12px 16px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'between', alignItems: 'center' }}>
            <div className="engine-title" style={{ fontSize: '11px', fontWeight: 'bold', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Filter Logic Engine</div>
            <div className="timeframe-container" style={{ display: 'flex', background: '#e2e8f0', padding: '2px', borderRadius: '6px', gap: '2px' }}>
              <button className={`tf-btn ${currentTimeframe === '1D' ? 'active' : ''}`} onClick={() => setCurrentTimeframe('1D')} style={{ background: currentTimeframe === '1D' ? 'white' : 'transparent', border: 'none', padding: '4px 12px', fontSize: '12px', fontWeight: '500', color: '#475569', borderRadius: '4px', cursor: 'pointer', boxShadow: currentTimeframe === '1D' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none' }}>Daily</button>
              <button className={`tf-btn ${currentTimeframe === '1W' ? 'active' : ''}`} onClick={() => setCurrentTimeframe('1W')} style={{ background: currentTimeframe === '1W' ? 'white' : 'transparent', border: 'none', padding: '4px 12px', fontSize: '12px', fontWeight: '500', color: '#475569', borderRadius: '4px', cursor: 'pointer', boxShadow: currentTimeframe === '1W' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none' }}>Weekly</button>
              <button className={`tf-btn ${currentTimeframe === '1M' ? 'active' : ''}`} onClick={() => setCurrentTimeframe('1M')} style={{ background: currentTimeframe === '1M' ? 'white' : 'transparent', border: 'none', padding: '4px 12px', fontSize: '12px', fontWeight: '500', color: '#475569', borderRadius: '4px', cursor: 'pointer', boxShadow: currentTimeframe === '1M' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none' }}>Monthly</button>
            </div>
          </div>
          <div className="engine-body" style={{ padding: '16px', background: '#fafbfc', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div className="rule-row" style={{ display: 'flex', gap: '12px', alignItems: 'center', background: 'white', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '6px', fontFamily: 'monospace', fontSize: '13px' }}>
              <span className="badge-pass" style={{ background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0', padding: '2px 6px', fontSize: '11px', fontWeight: 'bold', borderRadius: '4px' }}>Pass</span>
              <span style={{ color: '#334155' }}>Latest Close matches Latest Open within 0.1% of Close (Doji Body Rule)</span>
            </div>
            <div className="rule-row" style={{ display: 'flex', gap: '12px', alignItems: 'center', background: 'white', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '6px', fontFamily: 'monospace', fontSize: '13px' }}>
              <span className="badge-pass" style={{ background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0', padding: '2px 6px', fontSize: '11px', fontWeight: 'bold', borderRadius: '4px' }}>Pass</span>
              <span style={{ color: '#334155' }}>Latest Volume greater than 100,000 (Liquidity Rule)</span>
            </div>
          </div>
        </div>

        {/* Dynamic Tabs Control System */}
        <div className="tabs-row" style={{ display: 'flex', gap: '24px', borderBottom: '1px solid #e2e8f0' }}>
          <button className={`tab-link ${currentTab === 'results' ? 'active' : ''}`} onClick={() => setCurrentTab('results')} style={{ background: 'none', border: 'none', paddingBottom: '8px', fontSize: '14px', fontWeight: '600', color: currentTab === 'results' ? '#059669' : '#64748b', cursor: 'pointer', borderBottom: currentTab === 'results' ? '2px solid #059669' : '2px solid transparent' }}>
            Filtered Stocks (<span>{filteredData.length}</span>)
          </button>
          <button className={`tab-link ${currentTab === 'charts' ? 'active' : ''}`} onClick={() => setCurrentTab('charts')} style={{ background: 'none', border: 'none', paddingBottom: '8px', fontSize: '14px', fontWeight: '600', color: currentTab === 'charts' ? '#059669' : '#64748b', cursor: 'pointer', borderBottom: currentTab === 'charts' ? '2px solid #059669' : '2px solid transparent' }}>
            Multi-Chart Gallery
          </button>
        </div>

        {/* View 1: Filtered Stocks Data Table View */}
        {currentTab === 'results' && (
          <div className="panel">
            <div className="table-tools" style={{ padding: '16px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <input 
                type="text" 
                className="search-input" 
                placeholder="Quick query symbol or company name..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', maxWidth: '300px', padding: '6px 12px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px', outline: 'none' }}
              />
            </div>
            <div className="table-container" style={{ width: '100%', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'center', width: '50px', background: '#f1f5f9', color: '#475569', fontWeight: 'bold', padding: '12px 16px', borderBottom: '1px solid #e2e8f0', fontSize: '11px', textTransform: 'uppercase' }}>Sr.</th>
                    <th onClick={() => handleSort('name')} style={{ background: '#f1f5f9', color: '#475569', fontWeight: 'bold', padding: '12px 16px', borderBottom: '1px solid #e2e8f0', fontSize: '11px', textTransform: 'uppercase', cursor: 'pointer' }}>Stock Name</th>
                    <th onClick={() => handleSort('symbol')} style={{ background: '#f1f5f9', color: '#475569', fontWeight: 'bold', padding: '12px 16px', borderBottom: '1px solid #e2e8f0', fontSize: '11px', textTransform: 'uppercase', cursor: 'pointer' }}>Symbol</th>
                    <th style={{ background: '#f1f5f9', color: '#475569', fontWeight: 'bold', padding: '12px 16px', borderBottom: '1px solid #e2e8f0', fontSize: '11px', textTransform: 'uppercase' }}>Links</th>
                    <th onClick={() => handleSort('price')} style={{ textAlign: 'right', background: '#f1f5f9', color: '#475569', fontWeight: 'bold', padding: '12px 16px', borderBottom: '1px solid #e2e8f0', fontSize: '11px', textTransform: 'uppercase', cursor: 'pointer' }}>Price (INR)</th>
                    <th onClick={() => handleSort('chg')} style={{ textAlign: 'right', background: '#f1f5f9', color: '#475569', fontWeight: 'bold', padding: '12px 16px', borderBottom: '1px solid #e2e8f0', fontSize: '11px', textTransform: 'uppercase', cursor: 'pointer' }}>Chg %</th>
                    <th onClick={() => handleSort('volume')} style={{ textAlign: 'right', background: '#f1f5f9', color: '#475569', fontWeight: 'bold', padding: '12px 16px', borderBottom: '1px solid #e2e8f0', fontSize: '11px', textTransform: 'uppercase', cursor: 'pointer' }}>Volume</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>No equities match the tracking filter criteria setup.</td>
                    </tr>
                  ) : (
                    filteredData.map((stock, index) => (
                      <tr key={stock.symbol} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ textAlign: 'center', fontFamily: 'monospace', color: '#94a3b8', padding: '12px 16px' }}>{index + 1}</td>
                        <td style={{ color: '#0f172a', fontWeight: '600', padding: '12px 16px' }}>{stock.name}</td>
                        <td style={{ padding: '12px 16px' }}><a href="#" style={{ color: '#2563eb', fontWeight: 'bold', textDecoration: 'none' }}>{stock.symbol}</a></td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ fontSize: '11px', color: '#cbd5e1', fontFamily: 'monospace' }}>
                            <a href={`https://bseindia.com/stock-share-price/x/${stock.bse_code}`} target="_blank" rel="noreferrer" style={{ color: '#64748b', textDecoration: 'none' }}>BSE</a> • <a href="#" style={{ color: '#64748b', textDecoration: 'none' }}>Chart</a>
                          </span>
                        </td>
                        <td style={{ textAlign: 'right', fontFamily: 'monospace', fontWeight: '500', padding: '12px 16px' }}>₹{stock.price.toFixed(2)}</td>
                        <td style={{ textAlign: 'right', fontFamily: 'monospace', padding: '12px 16px', color: stock.chg >= 0 ? '#16a34a' : '#dc2626', fontWeight: 'bold' }}>{stock.per_chg}</td>
                        <td style={{ textAlign: 'right', fontFamily: 'monospace', color: '#475569', padding: '12px 16px' }}>{stock.volume.toLocaleString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* View 2: Multi-Chart Gallery Grid View */}
        {currentTab === 'charts' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))', gap: '16px' }}>
            {filteredData.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '32px', color: '#64748b', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                No active charts match the current tracking criteria rules.
              </div>
            ) : (
              filteredData.slice(0, 4).map(stock => (
                <div className="chart-card" key={stock.symbol} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
                  <div className="chart-card-header" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px', marginBottom: '12px', fontSize: '14px', fontWeight: 'bold' }}>
                    <span>{stock.symbol} - {stock.name}</span>
                    <span style={{ color: '#059669' }}>₹{stock.price.toFixed(2)}</span>
                  </div>
                  <div className="chart-canvas-mock" style={{ height: '180px', background: '#0f172a', borderRadius: '6px', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div className="chart-label" style={{ position: 'absolute', top: '8px', left: '12px', color: '#475569', fontFamily: 'monospace', fontSize: '10px' }}>
                      Candlestick Preview ({currentTimeframe})
                    </div>
                    {/* Simulated Candlestick Pattern Shapes */}
                    <div className="doji-wick" style={{ width: '2px', height: '120px', background: '#94a3b8', position: 'absolute' }}></div>
                    <div className="doji-body" style={{ width: '32px', height: '2px', background: 'white', position: 'absolute' }}></div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </main>
    </div>
  );
}