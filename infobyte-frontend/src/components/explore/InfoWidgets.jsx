import React from 'react';
import { CloudSun, TrendingUp, Trophy, Dot } from 'lucide-react';

// Static mockup as live data is not possible
function WeatherWidget() {
  return (
    <a 
      href="https://weather.com" 
      target="_blank" 
      rel="noopener noreferrer"
      className="bg-navy-800/75 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-4 flex-1 flex flex-col justify-between hover:border-accent-blue/75 transition-colors"
    >
      <div>
        <span className="text-sm text-gray-400">Current Weather</span>
        <p className="text-xs text-gray-500">Meenachil, KL</p>
      </div>
      <div className="flex items-center justify-between my-2">
        <span className="text-4xl font-bold">25°<span className="text-2xl">C</span></span>
        <CloudSun size={40} className="text-amber-400" />
      </div>
      <div className="text-xs text-gray-400 space-y-1">
        <p>Feels like: 28°</p>
        <p>Wind: 3 km/h | Humidity: 95%</p>
      </div>
    </a>
  );
}

// Static mockup
function StockWidget() {
  return (
    <a 
      href="https://www.google.com/finance/" 
      target="_blank" 
      rel="noopener noreferrer"
      className="bg-navy-800/75 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-4 flex-1 hover:border-accent-blue/75 transition-colors"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-400">Markets</span>
        <TrendingUp size={16} className="text-green-500" />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">NIFTY</span>
          <span className="text-sm text-green-500">+0.54%</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">SENSEX</span>
          <span className="text-sm text-green-500">+0.62%</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">GOLD</span>
          <span className="text-sm text-red-500">-1.56%</span>
        </div>
      </div>
    </a>
  );
}

// Static mockup
function CricketWidget() {
  return (
    <a 
      href="https://www.espncricinfo.com/" 
      target="_blank" 
      rel="noopener noreferrer"
      className="bg-navy-800/75 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-4 flex-1 hover:border-accent-blue/75 transition-colors"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-400">ICC World Cup</span>
        <span className="text-red-500 text-xs font-medium flex items-center"><Dot />LIVE</span>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium flex items-center gap-2">
            <img src="https://b.fssta.com/uploads/application/soccer/team-logos/India.png" alt="IND" className="w-5 h-5 rounded-full" />
            IND
          </span>
          <span className="text-sm font-bold">264/8 <span className="text-xs font-normal text-gray-400">(48.4)</span></span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium flex items-center gap-2">
            <img src="https://b.fssta.com/uploads/application/soccer/team-logos/South-Africa.png" alt="SA" className="w-5 h-5 rounded-full" />
            SA
          </span>
          <span className="text-sm font-bold">263 <span className="text-xs font-normal text-gray-400">(50)</span></span>
        </div>
      </div>
      <p className="text-xs text-green-500 mt-2">India won by 2 wickets</p>
    </a>
  );
}


export default function InfoWidgets() {
  return (
    <div className="flex flex-col md:flex-row gap-6">
      <WeatherWidget />
      <StockWidget />
      <CricketWidget />
    </div>
  );
}