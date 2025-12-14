import React, { useState, useEffect } from 'react';
import { httpService } from '../../core/http/abi-http.service';

/* =======================
   Types
======================= */
interface Customer {
  id: number;
  accountId: number;
  customerType: 'Individual' | 'Comp. client' | 'Government';
  clientSource: string;
  mobile: string;
  customerName: string;
  companyName: string;
  quotations: number;
  loyaltyPoints: number;
  calendarEvents: number;
  maintContracts: number;
}

/* =======================
   Dummy Data
======================= */
const CUSTOMER_DATA: Customer[] = [
  {
    id: 1,
    accountId: 1001,
    customerType: 'Individual',
    clientSource: 'الواتس اب',
    mobile: '0565566161',
    customerName: 'شركة الامتياز',
    companyName: 'شركة الامتياز',
    quotations: 0,
    loyaltyPoints: 87390.8,
    calendarEvents: 0,
    maintContracts: 0,
  },
  {
    id: 2,
    accountId: 1002,
    customerType: 'Individual',
    clientSource: 'الواتس اب',
    mobile: '0595997777',
    customerName: 'صدمو القحطاني',
    companyName: 'شركة سام الرقمية',
    quotations: 0,
    loyaltyPoints: 10350,
    calendarEvents: 0,
    maintContracts: 0,
  },
];

/* =======================
   Badge
======================= */
const CustomerTypeBadge: React.FC<{ type: Customer['customerType'] }> = ({ type }) => {
  const colors: Record<string, string> = {
    Individual: 'bg-blue-200 text-blue-800',
    'Comp. client': 'bg-green-200 text-green-800',
    Government: 'bg-purple-200 text-purple-800',
  };

  return (
    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${colors[type]}`}>
      {type}
    </span>
  );
};

/* =======================
   Main Component
======================= */
const Customers: React.FC = () => {
  const tabs = ['Clients', 'Loyalty Program', 'Quotations', 'Booking', 'Maint. Contract', 'Check Car'];

  const [activeTab, setActiveTab] = useState('Clients');
  const [customers, setCustomers] = useState<Customer[]>(CUSTOMER_DATA);

  const [searchMobile, setSearchMobile] = useState('');
  const [searchCustomerName, setSearchCustomerName] = useState('');
  const [searchCompanyName, setSearchCompanyName] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 0;

  /* =======================
     Fetch Customers
  ======================= */
  const fetchCustomers = async () => {
    try {
      const result: any = await httpService.get('/customers');

      if (result?.success) {
        setCustomers(result.data);
      } else {
        setCustomers(CUSTOMER_DATA);
      }
    } catch (err: any) {
      setCustomers(CUSTOMER_DATA);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  /* =======================
     Filter
  ======================= */
  const filteredData = customers.filter(c =>
    c.mobile.includes(searchMobile) &&
    c.customerName.includes(searchCustomerName) &&
    c.companyName.includes(searchCompanyName)
  );

  return (
    <div className="ml-5 min-h-screen p-2 font-sans text-right" dir="ltr">
      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-1 px-6 text-sm font-semibold border-2 border-zinc-500 w-40 h-9
              ${activeTab === tab ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab !== 'Clients' && (
        <div className="bg-white shadow rounded-lg p-10 text-gray-400 text-center">
          No Data Available
        </div>
      )}

      {activeTab === 'Clients' && (
        <>
          {/* Search */}
      <div className="bg-white p-4 mb-3 flex flex-wrap gap-2 items-center">
  <input
    placeholder="Mobile"
    value={searchMobile}
    onChange={e => setSearchMobile(e.target.value)}
    className="border-2 border-zinc-500 px-2 py-1 rounded-lg h-9"
  />

  <input
    placeholder="Customer Name"
    value={searchCustomerName}
    onChange={e => setSearchCustomerName(e.target.value)}
    className="border-2 border-zinc-500 px-2 py-1 rounded-lg h-9"
  />

  <input
    placeholder="Company Name"
    value={searchCompanyName}
    onChange={e => setSearchCompanyName(e.target.value)}
    className="border-2 border-zinc-500 px-2 py-1 rounded-lg h-9"
  />

  <button className="bg-blue-600 text-white px-2 py-1 rounded-lg h-9 w-32">
      Search
    </button>

  {/* spacer */}
  <div className="ml-auto flex gap-2">
    <button className="bg-blue-600 text-white px-2 py-1 rounded-lg h-9 w-32">
      استيراد اكسل
    </button>

    <button className="bg-blue-600 text-white px-2 py-1 rounded-lg h-9 w-32">
      Add Customer
    </button>
  </div>
</div>


          {/* Table */}
          <div className="bg-white shadow rounded-lg overflow-x-auto">
            <table className="min-w-full text-center border">
              <thead className="bg-gray-300">
                <tr>
                  {[
                    'ID',
                    'Account',
                    'Type',
                    'Source',
                    'Mobile',
                    'Customer',
                    'Company',
                    'Quotes',
                    'Points',
                    'Calendar',
                    'Contracts',
                    'Action',
                  ].map(h => (
                    <th key={h} className="border px-3 py-2 text-xs font-bold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filteredData.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="border py-2">{c.id}</td>
                    <td className="border">{c.accountId}</td>
                    <td className="border">
                      <CustomerTypeBadge type={c.customerType} />
                    </td>
                    <td className="border">{c.clientSource}</td>
                    <td className="border">{c.mobile}</td>
                    <td className="border">{c.customerName}</td>
                    <td className="border">{c.companyName}</td>
                    <td className="border">{c.quotations}</td>
                    <td className="border">{c.loyaltyPoints.toLocaleString()}</td>
                    <td className="border">{c.calendarEvents}</td>
                    <td className="border">{c.maintContracts}</td>
                    <td className="border">
                      <button className="bg-blue-600 text-white px-4 py-1 rounded-lg">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center py-4 gap-1">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 border rounded ${
                  currentPage === i + 1 ? 'bg-blue-600 text-white' : ''
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Customers;
