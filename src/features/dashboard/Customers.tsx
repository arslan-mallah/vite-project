import React, { useState } from 'react';

// --- Type Definitions for Data ---
interface Customer {
  id: number;
  accountId: number;
  customerType: 'Individual' | 'Comp. client' | 'Government';
  clientSource: string; // Assuming 'الواتس اب' is a possible source
  mobile: string;
  customerName: string;
  companyName: string;
  quotations: number;
  loyaltyPoints: number; // Renamed from 'المبلغ المشي' for better context in code
  calendarEvents: number; // Placeholder for Calendar column
  maintContracts: number;
}

// --- Dummy Data ---
const CUSTOMER_DATA: Customer[] = [
  { id: 1, accountId: 1001, customerType: 'Individual', clientSource: 'الواتس اب', mobile: '0565566161', customerName: 'شركة الامتياز', companyName: 'شركة الامتياز', quotations: 0, loyaltyPoints: 87390.8, calendarEvents: 0, maintContracts: 0 },
  { id: 2, accountId: 1002, customerType: 'Individual', clientSource: 'الواتس اب', mobile: '0595997777', customerName: 'صدمو القحطاني', companyName: 'شركة سام الرقميه', quotations: 0, loyaltyPoints: 10350, calendarEvents: 0, maintContracts: 0 },
  { id: 3, accountId: 1003, customerType: 'Comp. client', clientSource: 'الواتس اب', mobile: '0565100268', customerName: 'شركة سام الرقميه', companyName: 'شركة سام الرقميه', quotations: 0, loyaltyPoints: 20477.7, calendarEvents: 0, maintContracts: 1 },
  { id: 4, accountId: 1004, customerType: 'Individual', clientSource: 'الواتس اب', mobile: '0512345678', customerName: 'شركة الفضل الوطني', companyName: 'شركة الفضل الوطني', quotations: 0, loyaltyPoints: 10350, calendarEvents: 0, maintContracts: 0 },
  { id: 5, accountId: 1005, customerType: 'Comp. client', clientSource: 'الواتس اب', mobile: '0534246424', customerName: 'عبدالملك الصالحي', companyName: 'شركة سام الرقميه', quotations: 0, loyaltyPoints: 3127.5, calendarEvents: 0, maintContracts: 0 },
  { id: 6, accountId: 1006, customerType: 'Individual', clientSource: 'الواتس اب', mobile: '0554', customerName: 'احمد', companyName: '', quotations: 0, loyaltyPoints: 1150, calendarEvents: 0, maintContracts: 0 },
  { id: 7, accountId: 1007, customerType: 'Individual', clientSource: 'الواتس اب', mobile: '0542286488', customerName: 'يوسف', companyName: '', quotations: 0, loyaltyPoints: 23805, calendarEvents: 0, maintContracts: 0 },
  { id: 8, accountId: 1008, customerType: 'Individual', clientSource: 'الواتس اب', mobile: '0538546762', customerName: 'اسامه الحربي', companyName: '', quotations: 0, loyaltyPoints: 0, calendarEvents: 0, maintContracts: 0 },
  { id: 9, accountId: 1009, customerType: 'Individual', clientSource: 'الواتس اب', mobile: '0565654356', customerName: 'شركة الحريزي', companyName: '', quotations: 0, loyaltyPoints: 8050, calendarEvents: 0, maintContracts: 0 },
  { id: 10, accountId: 1010, customerType: 'Individual', clientSource: 'الواتس اب', mobile: '0512223344', customerName: 'سامي حميد', companyName: 'شركة سام الرقميه', quotations: 0, loyaltyPoints: 27600, calendarEvents: 0, maintContracts: 0 },
  { id: 11, accountId: 1011, customerType: 'Individual', clientSource: 'الواتس اب', mobile: '0577966664', customerName: 'محمد سالم', companyName: '', quotations: 0, loyaltyPoints: 1258.1, calendarEvents: 0, maintContracts: 1 },
  { id: 12, accountId: 1012, customerType: 'Individual', clientSource: 'الواتس اب', mobile: '0572405560', customerName: 'برهان راشد', companyName: '', quotations: 0, loyaltyPoints: 9337.5, calendarEvents: 0, maintContracts: 1 },
  { id: 13, accountId: 1013, customerType: 'Comp. client', clientSource: 'الواتس اب', mobile: '0544664780', customerName: 'شركه سامر السماني', companyName: 'شركه سامر السماني', quotations: 0, loyaltyPoints: 805, calendarEvents: 0, maintContracts: 1 },
  { id: 14, accountId: 1014, customerType: 'Government', clientSource: 'الواتس اب', mobile: '0536695633', customerName: 'اسلام الحربي', companyName: 'المرور', quotations: 0, loyaltyPoints: 0, calendarEvents: 0, maintContracts: 1 },
  { id: 15, accountId: 1015, customerType: 'Comp. client', clientSource: 'الواتس اب', mobile: '0500000000', customerName: 'حسن', companyName: 'شركة المبادرات للتجارة', quotations: 0, loyaltyPoints: 0, calendarEvents: 0, maintContracts: 0 },
];

// --- Helper component for Customer Type Badge ---
const CustomerTypeBadge: React.FC<{ type: Customer['customerType'] }> = ({ type }) => {
  let colorClass = '';
  switch (type) {
    case 'Individual':
      colorClass = 'bg-blue-200 text-blue-800';
      break;
    case 'Comp. client':
      colorClass = 'bg-green-200 text-green-800';
      break;
    case 'Government':
      colorClass = 'bg-purple-200 text-purple-800';
      break;
    default:
      colorClass = 'bg-gray-200 text-gray-800';
  }
  return (
    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${colorClass}`}>
      {type}
    </span>
  );
};

const Customers: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Clients');
  const tabs = ['Clients', 'Loyalty Program', 'Quotations', 'Booking', 'Maint. Contract', 'Check Car'];
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 7; // Matching the image's pagination

  return (
    <div className="ml-5 min-h-screen p-1 font-sans text-right" dir="ltr">
      {/* --- Top Navigation Tabs --- */}
      <div className="flex gap-2 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative py-1 px-6 text-sm font-semibold transition-all duration-300 focus:outline-none border-2 border-zinc-500
              ${activeTab === tab
                ? 'text-white bg-blue-600'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            style={{
              boxShadow: "rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset"
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* --- Main Content --- */}
      {activeTab === 'Clients' ? (
        <>
          {/* --- Search Bar and Action Buttons --- */}
          <div className="bg-white py-5 mb-3">
            <div className="flex flex-wrap gap-4">
              {/* Search Inputs */}
              <div className='items-end'>
                <input
                  type="text"
                  placeholder="Mobile"
                  className="flex-1 min-w-[180px] py-1 px-2 m-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 border-2 border-zinc-500"
                />
                <input
                  type="text"
                  placeholder="Customer Name"
                  className="flex-1 min-w-[180px] py-1 px-2 m-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 border-2 border-zinc-500"
                />
                <input
                  type="text"
                  placeholder="Company Name"
                  className="flex-1 min-w-[180px] py-1 px-2 m-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-50 border-2 border-zinc-500"
                />

                {/* Search Button */}
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold m-1 py-1 px-5 rounded-lg shadow-md transition-all duration-200 border-2">
                  Search
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 ml-auto flex-wrap items-start">
                <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-5 rounded-lg shadow-md transition-all duration-200">
                  استيراد اكسل
                </button>
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-lg shadow-md transition-all duration-200 flex items-center justify-center gap-2">
                  <span className="text-xl">+</span> Add Customer
                </button>
              </div>
            </div>
          </div>

          {/* --- Data Table --- */}
          <div className="bg-white shadow-md rounded-lg overflow-x-auto">
            <div className="overflow-x-auto p-4">
              <table className="min-w-full border-collapse text-center">
                {/* Table Header */}
                <thead>
                  <tr>
                    {[
                      "Customer ID",
                      "Account Number",
                      "Customer Type",
                      "Client Source",
                      "Mobile",
                      "Customer Name",
                      "Company Name",
                      "Quotations",
                      "المبلغ المشي",
                      "Calendar",
                      "Maint. Contracts",
                      "Action"
                    ].map((header) => (
                      <th
                        key={header}
                        className={`border-2 border-zinc-500 px-4 py-2 text-xs font-bold text-gray-700 uppercase ${
                          header === "Action"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-300"
                        }`}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                  {CUSTOMER_DATA.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">{customer.id}</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">{customer.accountId}</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">
                        <div className="flex justify-center">
                          <CustomerTypeBadge type={customer.customerType} />
                        </div>
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">{customer.clientSource}</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">{customer.mobile}</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">{customer.customerName}</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">{customer.companyName}</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">{customer.quotations}</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">{customer.loyaltyPoints.toLocaleString()}</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">{customer.calendarEvents}</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">{customer.maintContracts}</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">
                        <button className="text-white bg-blue-600 hover:bg-blue-700 text-xs py-1 px-3 rounded shadow">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* --- Pagination --- */}
            <div className="flex justify-center items-center py-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="mx-1 px-3 py-1 text-sm text-gray-500 bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                &lt;
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`mx-1 px-3 py-1 text-sm rounded transition-colors ${
                    currentPage === i + 1
                      ? 'bg-blue-600 text-white font-bold'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="mx-1 px-3 py-1 text-sm text-gray-500 bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                &gt;
              </button>
            </div>
          </div>
        </>
      ) : (
        // --- Placeholder for other tabs ---
        <div className="bg-white shadow-md rounded-lg p-10 flex justify-center items-center text-gray-400 text-lg font-semibold">
          No Data Available
        </div>
      )}
    </div>
  );
};

export default Customers;