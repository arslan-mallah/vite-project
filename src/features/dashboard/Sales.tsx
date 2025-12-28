import React, { useState } from 'react';

const Sales: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Invoices');

  const tabs = ['Invoices', 'Return Invoice', 'Purchases', 'Expenses', 'Renewal'];

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans" dir="ltr">
      {/* Tabs Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                w-44 h-10 flex items-center justify-center
                text-sm font-semibold rounded-lg transition-all duration-200
                ${
                  activeTab === tab
                    ? `
                      bg-blue-600 text-white
                      shadow-lg shadow-blue-600/30
                      ring-1 ring-blue-500
                    `
                    : `
                      bg-gray-50 text-gray-700
                      shadow-sm border border-gray-200
                      hover:bg-gray-100 hover:shadow-md
                    `
                }
              `}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {tabs.map(tab => (
          activeTab === tab && (
            <div key={tab} className="flex flex-col items-center justify-center h-64 text-gray-400">
              <p className="text-sm font-medium">No Data Available for {tab}</p>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default Sales;