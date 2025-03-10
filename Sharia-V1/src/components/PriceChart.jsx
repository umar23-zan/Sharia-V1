import { useState, useEffect } from 'react';
import { AreaChart, Area, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const PriceChart = ({ symbol }) => {
  const [priceData, setPriceData] = useState([]);
  const [metaData, setMetaData] = useState({});
  const [timeframe, setTimeframe] = useState('3M');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPriceHistory = async () => {
      try {
        // Convert timeframe to API period format
        const periodMap = {
          '1D': '1d',
          '1W': '1w',
          '1M': '1mo',
          '3M': '3mo',
          '6M': '6mo',
          '1Y': '1y'
        };
        
        const period = periodMap[timeframe];
        const response = await axios.get(
          `http://13.201.131.141:5000/api/price-history/${symbol}?period=${period}`
        );
        
        setPriceData(response.data.prices);
        setMetaData(response.data.meta);
      } catch (error) {
        console.error('Error fetching price history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPriceHistory();
  }, [symbol, timeframe]);

  const timeframes = ['1D','1M', '3M', '6M', '1Y'];

  if (loading) {
    return <div className="h-48 flex items-center justify-center">Loading chart...</div>;
  }

  const isPositive = metaData.priceChange >= 0;

  const getPreviousHour = () => {
    const now = new Date();
    now.setHours(now.getHours() - 1);
    return now.toLocaleString();
  };

  return (
    <div className="bg-white">
       <div className="text-xs text-gray-500 p-2">
        Last Updated: {getPreviousHour()}
      </div>
      <div className="flex gap-3 mb-4 text-sm">
        {timeframes.map((tf) => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf)}
            className={`px-2 py-1 rounded-md ${
              timeframe === tf
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            {tf}
          </button>
        ))}
      </div>
      {/* Price and Change Display */}
      <div className="mb-2 text-center">
        <div className="flex items-baseline gap-2 justify-center">
          <span className="text-2xl font-semibold">₹{metaData.lastPrice?.toFixed(2)}</span>
          <span className="text-xs text-gray-500">.00</span>
        </div>
        <div className={`text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {isPositive ? '↑' : '↓'} {Math.abs(metaData.priceChange).toFixed(2)} ({Math.abs(metaData.priceChangePercent)}%)
        </div>
      </div>  

      {/* Chart */}
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={priceData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isPositive ? '#22C55E' : '#EF4444'} stopOpacity={0.1}/>
                <stop offset="95%" stopColor={isPositive ? '#22C55E' : '#EF4444'} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white shadow-lg rounded-lg p-2 text-sm">
                      <div className="font-medium">₹{data.price.toFixed(2)}</div>
                      <div className="text-gray-500">
                        {timeframe === '1D' 
                          ? new Date(data.date).toLocaleTimeString()
                          : new Date(data.date).toLocaleDateString()}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke={isPositive ? '#22C55E' : '#EF4444'}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorPrice)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PriceChart;