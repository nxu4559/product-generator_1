import { useState } from 'react';
import BatchProcessor from './BatchProcessor';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">
          Counter App
        </h1>

        <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl p-6 mb-6">
          <p className="text-6xl font-bold text-center text-gray-800">
            {count}
          </p>
        </div>

        <button
          onClick={() => setCount(count + 1)}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-4 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all mb-3"
        >
          Click Me! ✨
        </button>

        <button
          onClick={() => setCount(0)}
          className="w-full bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-300 transition-all"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState('counter');

  return (
    <div>
      {/* Tab Navigation */}
      <div className="bg-gray-800 p-4 flex gap-4 justify-center">
        <button
          onClick={() => setActiveTab('counter')}
          className={`px-6 py-3 rounded-lg font-bold transition-all ${
            activeTab === 'counter'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
          }`}
        >
          📊 Counter App
        </button>

        <button
          onClick={() => setActiveTab('batch')}
          className={`px-6 py-3 rounded-lg font-bold transition-all ${
            activeTab === 'batch'
              ? 'bg-pink-500 text-white'
              : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
          }`}
        >
          ⚡ Batch Process
        </button>
      </div>

      {/* Show the selected app */}
      {activeTab === 'counter' && <Counter />}
      {activeTab === 'batch' && <BatchProcessor />}
    </div>
  );
}

export default App;
