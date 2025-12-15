import React, { useState, useEffect, useMemo } from 'react';
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
  createdAt?: string; // Add createdAt for date filtering
}

/* =======================
   Dummy Data
======================= */
const CUSTOMER_DATA: Customer[] = [
  {
    id: 1,
    accountId: 101,
    customerType: 'Individual',
    clientSource: 'Website',
    mobile: '1234567890',
    customerName: 'John Doe',
    companyName: '',
    quotations: 5,
    loyaltyPoints: 150,
    calendarEvents: 2,
    maintContracts: 1,
    createdAt: '2025-01-01',
  },
  {
    id: 2,
    accountId: 102,
    customerType: 'Comp. client',
    clientSource: 'Referral',
    mobile: '0987654321',
    customerName: 'Jane Smith',
    companyName: 'ABC Corp',
    quotations: 10,
    loyaltyPoints: 750,
    calendarEvents: 5,
    maintContracts: 3,
    createdAt: '2025-06-15',
  },
  {
    id: 3,
    accountId: 103,
    customerType: 'Government',
    clientSource: 'Direct',
    mobile: '1122334455',
    customerName: 'Bob Johnson',
    companyName: 'City Hall',
    quotations: 8,
    loyaltyPoints: 1200,
    calendarEvents: 10,
    maintContracts: 5,
    createdAt: '2025-03-20',
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

  const [loyaltyStartDate, setLoyaltyStartDate] = useState({
    day: '1',
    month: '1',
    year: '2025'
  });
  const [loyaltyEndDate, setLoyaltyEndDate] = useState({
    day: '15',
    month: '12',
    year: '2025'
  });
  const [quotationsStartDate, setQuotationsStartDate] = useState({
    day: '1',
    month: '1',
    year: '2025'
  });
  const [quotationsEndDate, setQuotationsEndDate] = useState({
    day: '15',
    month: '12',
    year: '2025'
  });
  const [bookingStartDate, setBookingStartDate] = useState({
    day: '1',
    month: '1',
    year: '2025'
  });
  const [bookingEndDate, setBookingEndDate] = useState({
    day: '15',
    month: '12',
    year: '2025'
  });
  const [maintContractStartDate, setMaintContractStartDate] = useState({
    day: '1',
    month: '1',
    year: '2025'
  });
  const [maintContractEndDate, setMaintContractEndDate] = useState({
    day: '15',
    month: '12',
    year: '2025'
  });
  const [checkCarStartDate, setCheckCarStartDate] = useState({
    day: '1',
    month: '1',
    year: '2025'
  });
  const [checkCarEndDate, setCheckCarEndDate] = useState({
    day: '15',
    month: '12',
    year: '2025'
  });
  const [quotationsData, setQuotationsData] = useState<Customer[]>(CUSTOMER_DATA);
  const [loyaltyData, setLoyaltyData] = useState<Customer[]>(CUSTOMER_DATA);

  const [bookingData, setBookingData] = useState<Customer[]>([]);
  const [maintContractData, setMaintContractData] = useState<Customer[]>([]);
  const [checkCarData, setCheckCarData] = useState<Customer[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [loyaltyPage, setLoyaltyPage] = useState(1);
  const [quotationsPage, setQuotationsPage] = useState(1);
  const [bookingPage, setBookingPage] = useState(1);
  const [maintContractPage, setMaintContractPage] = useState(1);
  const [checkCarPage, setCheckCarPage] = useState(1);
  const itemsPerPage = 10;

  /* =======================
     Filter
  ======================= */
  const filteredData = customers.filter(c =>
    c.mobile.includes(searchMobile) &&
    c.customerName.includes(searchCustomerName) &&
    c.companyName.includes(searchCompanyName)
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const loyaltyFilteredData = useMemo(() => [...loyaltyData].sort((a, b) => b.loyaltyPoints - a.loyaltyPoints), [loyaltyData]);
  const loyaltyTotalPages = Math.ceil(loyaltyFilteredData.length / itemsPerPage);
  const loyaltyPaginatedData = loyaltyFilteredData.slice(
    (loyaltyPage - 1) * itemsPerPage,
    loyaltyPage * itemsPerPage
  );

  const quotationsFilteredData = useMemo(() => [...quotationsData].sort((a, b) => b.quotations - a.quotations), [quotationsData]);
  const quotationsTotalPages = Math.ceil(quotationsFilteredData.length / itemsPerPage);
  const quotationsPaginatedData = quotationsFilteredData.slice(
    (quotationsPage - 1) * itemsPerPage,
    quotationsPage * itemsPerPage
  );

  const bookingFilteredData = useMemo(() => [...bookingData].sort((a, b) => b.calendarEvents - a.calendarEvents), [bookingData]);
  const bookingTotalPages = Math.ceil(bookingFilteredData.length / itemsPerPage);
  const bookingPaginatedData = bookingFilteredData.slice(
    (bookingPage - 1) * itemsPerPage,
    bookingPage * itemsPerPage
  );

  const maintContractFilteredData = useMemo(() => [...maintContractData].sort((a, b) => b.maintContracts - a.maintContracts), [maintContractData]);
  const maintContractTotalPages = Math.ceil(maintContractFilteredData.length / itemsPerPage);
  const maintContractPaginatedData = maintContractFilteredData.slice(
    (maintContractPage - 1) * itemsPerPage,
    maintContractPage * itemsPerPage
  );

  const checkCarFilteredData = useMemo(() => [...checkCarData].sort((a, b) => b.quotations - a.quotations), [checkCarData]);
  const checkCarTotalPages = Math.ceil(checkCarFilteredData.length / itemsPerPage);
  const checkCarPaginatedData = checkCarFilteredData.slice(
    (checkCarPage - 1) * itemsPerPage,
    checkCarPage * itemsPerPage
  );

  /* =======================
     Fetch Loyalty Data
  ======================= */
  const fetchLoyaltyData = async () => {
    try {
      const start = `${loyaltyStartDate.year}-${loyaltyStartDate.month.padStart(2, '0')}-${loyaltyStartDate.day.padStart(2, '0')}`;
      const end = `${loyaltyEndDate.year}-${loyaltyEndDate.month.padStart(2, '0')}-${loyaltyEndDate.day.padStart(2, '0')}`;
      const result: any = await httpService.get(`/customers/loyalty?start_date=${start}&end_date=${end}`);

      if (result?.success && Array.isArray(result.data)) {
        setLoyaltyData(result.data);
      } else {
        setLoyaltyData([]);
      }
    } catch (err: any) {
      setLoyaltyData([]);
    }
  };

  /* =======================
     Fetch Quotations Data
  ======================= */
  const fetchQuotationsData = async () => {
    try {
      const start = `${quotationsStartDate.year}-${quotationsStartDate.month.padStart(2, '0')}-${quotationsStartDate.day.padStart(2, '0')}`;
      const end = `${quotationsEndDate.year}-${quotationsEndDate.month.padStart(2, '0')}-${quotationsEndDate.day.padStart(2, '0')}`;
      const result: any = await httpService.get(`/customers/quotations?start_date=${start}&end_date=${end}`);

      if (result?.success && Array.isArray(result.data)) {
        setQuotationsData(result.data);
      } else {
        setQuotationsData([]);
      }
    } catch (err: any) {
      setQuotationsData([]);
    }
  };

  /* =======================
     Fetch Booking Data
  ======================= */
  const fetchBookingData = async () => {
    try {
      const start = `${bookingStartDate.year}-${bookingStartDate.month.padStart(2, '0')}-${bookingStartDate.day.padStart(2, '0')}`;
      const end = `${bookingEndDate.year}-${bookingEndDate.month.padStart(2, '0')}-${bookingEndDate.day.padStart(2, '0')}`;
      const result: any = await httpService.get(`/customers/booking?start_date=${start}&end_date=${end}`);

      if (result?.success && Array.isArray(result.data)) {
        setBookingData(result.data);
      } else {
        setBookingData([]);
      }
    } catch (err: any) {
      setBookingData([]);
    }
  };

  /* =======================
     Fetch Maint Contract Data
  ======================= */
  const fetchMaintContractData = async () => {
    try {
      const start = `${maintContractStartDate.year}-${maintContractStartDate.month.padStart(2, '0')}-${maintContractStartDate.day.padStart(2, '0')}`;
      const end = `${maintContractEndDate.year}-${maintContractEndDate.month.padStart(2, '0')}-${maintContractEndDate.day.padStart(2, '0')}`;
      const result: any = await httpService.get(`/customers/maint-contract?start_date=${start}&end_date=${end}`);

      if (result?.success && Array.isArray(result.data)) {
        setMaintContractData(result.data);
      } else {
        setMaintContractData([]);
      }
    } catch (err: any) {
      setMaintContractData([]);
    }
  };

  /* =======================
     Fetch Check Car Data
  ======================= */
  const fetchCheckCarData = async () => {
    try {
      const start = `${checkCarStartDate.year}-${checkCarStartDate.month.padStart(2, '0')}-${checkCarStartDate.day.padStart(2, '0')}`;
      const end = `${checkCarEndDate.year}-${checkCarEndDate.month.padStart(2, '0')}-${checkCarEndDate.day.padStart(2, '0')}`;
      const result: any = await httpService.get(`/customers/check-car?start_date=${start}&end_date=${end}`);

      if (result?.success && Array.isArray(result.data)) {
        setCheckCarData(result.data);
      } else {
        setCheckCarData([]);
      }
    } catch (err: any) {
      setCheckCarData([]);
    }
  };

  useEffect(() => {
    if (activeTab === 'Loyalty Program') {
      fetchLoyaltyData();
    } else if (activeTab === 'Quotations') {
      fetchQuotationsData();
    } else if (activeTab === 'Booking') {
      fetchBookingData();
    } else if (activeTab === 'Maint. Contract') {
      fetchMaintContractData();
    } else if (activeTab === 'Check Car') {
      fetchCheckCarData();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'Clients') setCurrentPage(1);
    else if (activeTab === 'Loyalty Program') setLoyaltyPage(1);
    else if (activeTab === 'Quotations') setQuotationsPage(1);
    else if (activeTab === 'Booking') setBookingPage(1);
    else if (activeTab === 'Maint. Contract') setMaintContractPage(1);
    else if (activeTab === 'Check Car') setCheckCarPage(1);
  }, [activeTab]);

  /* =======================
     Table Content
  ======================= */
  const tableContent = (
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
          <button className="bg-blue-600 text-white px-2 py-1 rounded-lg h-9 w-32" onClick={() => alert('Exporting Clients to Excel')}>
            استيراد اكسل
          </button>

          <button className="bg-blue-600 text-white px-2 py-1 rounded-lg h-9 w-32" onClick={() => alert('Adding new Customer')}>
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
                'Customer ID',
                'Account Number',
                'CustomerType',
                'Client Source',
                'Mobile',
                'Customer Name',
                'Company Name',
                'Quotations',
                'Points',
                'Calendar',
                'Maints. Contracts',
                'Action',
              ].map(h => (
                <th key={h} className={`border px-3 py-2 text-xs font-bold ${h === 'Action' ? 'text-white bg-blue-600' : ''}`}>
                  {h}
                </th>
                
              ))}
            </tr>
          </thead>

          <tbody>
            {paginatedData.map(c => (
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
                  <button className="bg-blue-600 text-white px-4 py-1 rounded-lg" onClick={() => alert(`Viewing ${c.customerName}`)}>
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {/* <div className="flex justify-center py-4 gap-1">
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
      </div> */}
    </>
  );

  /* =======================
     Quotations Table Content
  ======================= */
  const quotationsTableContent = (
    <>
      {/* Date Filters */}
      <div className="bg-white p-4 mb-3 flex flex-wrap items-end gap-4">
        {/* Start Date */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1" style={{ direction: 'ltr', textAlign: 'left' }}>Start Date</label>
          <div className="flex gap-2">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              lang="en"
              className="border-2 border-zinc-500 rounded-lg px-3 py-1 w-16 h-9 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={quotationsStartDate.day}
              onChange={(e) => setQuotationsStartDate(prev => ({ ...prev, day: e.target.value }))}
              placeholder="DD"
              style={{ direction: 'ltr', textAlign: 'left' }}
            />
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              lang="en"
              className="border-2 border-zinc-500 rounded-lg px-3 py-1 w-16 h-9 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={quotationsStartDate.month}
              onChange={(e) => setQuotationsStartDate(prev => ({ ...prev, month: e.target.value }))}
              placeholder="MM"
              style={{ direction: 'ltr', textAlign: 'left' }}
            />
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              lang="en"
              className="border-2 border-zinc-500 rounded-lg px-3 py-1 w-20 h-9 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={quotationsStartDate.year}
              onChange={(e) => setQuotationsStartDate(prev => ({ ...prev, year: e.target.value }))}
              placeholder="YYYY"
              style={{ direction: 'ltr', textAlign: 'left' }}
            />
          </div>
        </div>

        {/* End Date */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1" style={{ direction: 'ltr', textAlign: 'left' }}>End Date</label>
          <div className="flex gap-2">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              lang="en"
              className="border-2 border-zinc-500 rounded-lg px-3 py-1 w-16 h-9 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={quotationsEndDate.day}
              onChange={(e) => setQuotationsEndDate(prev => ({ ...prev, day: e.target.value }))}
              placeholder="DD"
              style={{ direction: 'ltr', textAlign: 'left' }}
            />
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              lang="en"
              className="border-2 border-zinc-500 rounded-lg px-3 py-1 w-16 h-9 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={quotationsEndDate.month}
              onChange={(e) => setQuotationsEndDate(prev => ({ ...prev, month: e.target.value }))}
              placeholder="MM"
              style={{ direction: 'ltr', textAlign: 'left' }}
            />
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              lang="en"
              className="border-2 border-zinc-500 rounded-lg px-3 py-1 w-20 h-9 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={quotationsEndDate.year}
              onChange={(e) => setQuotationsEndDate(prev => ({ ...prev, year: e.target.value }))}
              placeholder="YYYY"
              style={{ direction: 'ltr', textAlign: 'left' }}
            />
          </div>
        </div>

        <input
          placeholder="Mobile"
          value={searchMobile}
          onChange={e => setSearchMobile(e.target.value)}
          className="border-2 border-zinc-500 px-2 py-1 rounded-lg h-9"
        />
        
        <input
          placeholder="Request Number"
          value={searchMobile}
          onChange={e => setSearchMobile(e.target.value)}
          className="border-2 border-zinc-500 px-2 py-1 rounded-lg h-9"
        />
        
        <input
          placeholder="معرف استلام السيارة"
          value={searchMobile}
          onChange={e => setSearchMobile(e.target.value)}
          className="border-2 border-zinc-500 px-2 py-1 rounded-lg h-9"
        />
        
        <input
          placeholder="Model"
          value={searchMobile}
          onChange={e => setSearchMobile(e.target.value)}
          className="border-2 border-zinc-500 px-2 py-1 rounded-lg h-9"
        />
        
        <input
          placeholder="Quot No."
          value={searchMobile}
          onChange={e => setSearchMobile(e.target.value)}
          className="border-2 border-zinc-500 px-2 py-1 rounded-lg h-9"
        />


        {/* Search Button */}
        <button onClick={fetchQuotationsData} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-2 rounded-lg shadow-md transition-all duration-200 w-24 h-9">
          Search
        </button>

      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full text-center border">
          <thead className="bg-gray-300">
            <tr>
              {[
                'Quot No.',
                'Customer Type',
                'Quotation Date',
                'Mobile',
                'Customer Name',
                'Plate No.',
                'Model',
                'Total',
                'VAT',
                'Total inc. VAT',
                'Added by',
                'Status',
                'Action',
              ].map(h => (
                <th key={h} className={`border px-3 py-2 text-xs font-bold ${h === 'Action' ? 'text-white bg-blue-600' : ''}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {quotationsPaginatedData
              .map(c => {
                const status = c.quotations > 5 ? 'Approved' : 'Pending';
                return (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="border py-2">{c.id}</td>
                    <td className="border">QT-{c.id}</td>
                    <td className="border">{c.createdAt || '2025-01-01'}</td>
                    <td className="border">{c.customerName}</td>
                    <td className="border">${(c.quotations * 100).toLocaleString()}</td>
                    <td className="border">
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                        status === 'Approved' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
                      }`}>
                        {status}
                      </span>
                    </td>
                    <td className="border">
                      <div className="flex gap-1">
                        <button className="bg-blue-600 text-white px-2 py-1 rounded-lg" onClick={() => alert(`Viewing quotation QT-${c.id}`)}>
                          View
                        </button>
                        <button className="bg-green-600 text-white px-2 py-1 rounded-lg" onClick={() => alert(`Editing quotation QT-${c.id}`)}>
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center py-4 gap-1">
        {[...Array(quotationsTotalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setQuotationsPage(i + 1)}
            className={`px-3 py-1 border rounded ${
              quotationsPage === i + 1 ? 'bg-blue-600 text-white' : ''
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </>
  );

  /* =======================
     Booking Table Content
  ======================= */
  const bookingTableContent = (
    <>
      {/* Date Filters */}
      <div className="bg-white p-4 mb-3 flex flex-wrap items-end gap-4">
        {/* Start Date */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1" style={{ direction: 'ltr', textAlign: 'left' }}>Start Date</label>
          <div className="flex gap-2">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              lang="en"
              className="border-2 border-zinc-500 rounded-lg px-3 py-1 w-16 h-9 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={bookingStartDate.day}
              onChange={(e) => setBookingStartDate(prev => ({ ...prev, day: e.target.value }))}
              placeholder="DD"
              style={{ direction: 'ltr', textAlign: 'left' }}
            />
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              lang="en"
              className="border-2 border-zinc-500 rounded-lg px-3 py-1 w-16 h-9 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={bookingStartDate.month}
              onChange={(e) => setBookingStartDate(prev => ({ ...prev, month: e.target.value }))}
              placeholder="MM"
              style={{ direction: 'ltr', textAlign: 'left' }}
            />
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              lang="en"
              className="border-2 border-zinc-500 rounded-lg px-3 py-1 w-20 h-9 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={bookingStartDate.year}
              onChange={(e) => setBookingStartDate(prev => ({ ...prev, year: e.target.value }))}
              placeholder="YYYY"
              style={{ direction: 'ltr', textAlign: 'left' }}
            />
          </div>
        </div>

        {/* End Date */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1" style={{ direction: 'ltr', textAlign: 'left' }}>End Date</label>
          <div className="flex gap-2">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              lang="en"
              className="border-2 border-zinc-500 rounded-lg px-3 py-1 w-16 h-9 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={bookingEndDate.day}
              onChange={(e) => setBookingEndDate(prev => ({ ...prev, day: e.target.value }))}
              placeholder="DD"
              style={{ direction: 'ltr', textAlign: 'left' }}
            />
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              lang="en"
              className="border-2 border-zinc-500 rounded-lg px-3 py-1 w-16 h-9 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={bookingEndDate.month}
              onChange={(e) => setBookingEndDate(prev => ({ ...prev, month: e.target.value }))}
              placeholder="MM"
              style={{ direction: 'ltr', textAlign: 'left' }}
            />
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              lang="en"
              className="border-2 border-zinc-500 rounded-lg px-3 py-1 w-20 h-9 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={bookingEndDate.year}
              onChange={(e) => setBookingEndDate(prev => ({ ...prev, year: e.target.value }))}
              placeholder="YYYY"
              style={{ direction: 'ltr', textAlign: 'left' }}
            />
          </div>
        </div>

        {/* Search Button */}
        <button onClick={fetchBookingData} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-2 rounded-lg shadow-md transition-all duration-200 w-24 h-9">
          Search
        </button>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full text-center border">
          <thead className="bg-gray-300">
            <tr>
              {[
                'Calendar Table',
              ].map(h => (
                <th key={h} className={`border px-3 py-2 text-xs font-bold ${h === 'Action' ? 'text-white bg-blue-600' : ''}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {bookingPaginatedData
              .map(c => {
                const status = c.calendarEvents > 2 ? 'Confirmed' : 'Pending';
                return (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="border py-2">{c.id}</td>
                    <td className="border">{c.customerName}</td>
                    <td className="border">{c.createdAt || '2025-01-01'}</td>
                    <td className="border">{c.calendarEvents}</td>
                    <td className="border">
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                        status === 'Confirmed' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
                      }`}>
                        {status}
                      </span>
                    </td>
                    <td className="border">
                      <div className="flex gap-1">
                        <button className="bg-blue-600 text-white px-2 py-1 rounded-lg" onClick={() => alert(`Viewing booking for ${c.customerName}`)}>
                          View
                        </button>
                        <button className="bg-green-600 text-white px-2 py-1 rounded-lg" onClick={() => alert(`Editing booking for ${c.customerName}`)}>
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center py-4 gap-1">
        {[...Array(bookingTotalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setBookingPage(i + 1)}
            className={`px-3 py-1 border rounded ${
              bookingPage === i + 1 ? 'bg-blue-600 text-white' : ''
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </>
  );

  /* =======================
     Loyalty Program Table Content
  ======================= */
  const loyaltyTableContent = (
    <>
      {/* Date Filters */}
      <div className="bg-white p-4 mb-3 flex flex-wrap items-end gap-4">
        {/* Start Date */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1" style={{ direction: 'ltr', textAlign: 'left' }}>Start Date</label>
          <div className="flex gap-2">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              lang="en"
              className="border-2 border-zinc-500 rounded-lg px-3 py-1 w-16 h-9 focus:outline-none focus:ring-2 focus:ring-green-400"
              value={loyaltyStartDate.day}
              onChange={(e) => setLoyaltyStartDate(prev => ({ ...prev, day: e.target.value }))}
              placeholder="DD"
              style={{ direction: 'ltr', textAlign: 'left' }}
            />
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              lang="en"
              className="border-2 border-zinc-500 rounded-lg px-3 py-1 w-16 h-9 focus:outline-none focus:ring-2 focus:ring-green-400"
              value={loyaltyStartDate.month}
              onChange={(e) => setLoyaltyStartDate(prev => ({ ...prev, month: e.target.value }))}
              placeholder="MM"
              style={{ direction: 'ltr', textAlign: 'left' }}
            />
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              lang="en"
              className="border-2 border-zinc-500 rounded-lg px-3 py-1 w-20 h-9 focus:outline-none focus:ring-2 focus:ring-green-400"
              value={loyaltyStartDate.year}
              onChange={(e) => setLoyaltyStartDate(prev => ({ ...prev, year: e.target.value }))}
              placeholder="YYYY"
              style={{ direction: 'ltr', textAlign: 'left' }}
            />
          </div>
        </div>

        {/* End Date */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1" style={{ direction: 'ltr', textAlign: 'left' }}>End Date</label>
          <div className="flex gap-2">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              lang="en"
              className="border-2 border-zinc-500 rounded-lg px-3 py-1 w-16 h-9 focus:outline-none focus:ring-2 focus:ring-green-400"
              value={loyaltyEndDate.day}
              onChange={(e) => setLoyaltyEndDate(prev => ({ ...prev, day: e.target.value }))}
              placeholder="DD"
              style={{ direction: 'ltr', textAlign: 'left' }}
            />
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              lang="en"
              className="border-2 border-zinc-500 rounded-lg px-3 py-1 w-16 h-9 focus:outline-none focus:ring-2 focus:ring-green-400"
              value={loyaltyEndDate.month}
              onChange={(e) => setLoyaltyEndDate(prev => ({ ...prev, month: e.target.value }))}
              placeholder="MM"
              style={{ direction: 'ltr', textAlign: 'left' }}
            />
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              lang="en"
              className="border-2 border-zinc-500 rounded-lg px-3 py-1 w-20 h-9 focus:outline-none focus:ring-2 focus:ring-green-400"
              value={loyaltyEndDate.year}
              onChange={(e) => setLoyaltyEndDate(prev => ({ ...prev, year: e.target.value }))}
              placeholder="YYYY"
              style={{ direction: 'ltr', textAlign: 'left' }}
            />
          </div>
        </div>

        {/* Search Button */}
        <button onClick={fetchLoyaltyData} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-2 rounded-lg shadow-md transition-all duration-200 w-24 h-9">
          Search
        </button>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full text-center border">
          <thead className="bg-gray-300">
            <tr>
              {[
                '#',
                'معرف العميل',
                'نوع العميل',
                'اسم العميل',
                'النقاط المكتسبة',
                'النقاط المستخدمة',
                'النقاط المتبقية',
                'الخصم المستخدم',
                'الخصم المستحق',
                'الاجراء',
              ].map(h => (
                <th key={h} className={`border px-3 py-2 text-xs font-bold ${h === 'الاجراء' ? 'text-white bg-blue-600' : ''}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loyaltyPaginatedData
              .map(c => {
                let tier = 'Bronze';
                if (c.loyaltyPoints > 1000) tier = 'Gold';
                else if (c.loyaltyPoints > 500) tier = 'Silver';

                return (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="border py-2">{c.id}</td>
                    <td className="border">{c.id}</td>
                    <td className="border">
                      <CustomerTypeBadge type={c.customerType} />
                    </td>
                    <td className="border">{c.customerName}</td>
                    <td className="border">{c.loyaltyPoints}</td>
                    <td className="border">{Math.floor(c.loyaltyPoints * 0.1)}</td>
                    <td className="border">{c.loyaltyPoints - Math.floor(c.loyaltyPoints * 0.1)}</td>
                    <td className="border">${Math.floor(c.loyaltyPoints * 0.1) * 10}</td>
                    <td className="border">${(c.loyaltyPoints - Math.floor(c.loyaltyPoints * 0.1)) * 10}</td>
                    <td className="border">
                      <div className="flex gap-1">
                        <button className="bg-green-600 text-white px-2 py-1 rounded-lg" onClick={() => alert(`Redeeming points for ${c.customerName}`)}>
                          Redeem
                        </button>
                        <button className="bg-blue-600 text-white px-2 py-1 rounded-lg" onClick={() => alert(`Viewing history for ${c.customerName}`)}>
                          View History
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center py-4 gap-1">
        {[...Array(loyaltyTotalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setLoyaltyPage(i + 1)}
            className={`px-3 py-1 border rounded ${
              loyaltyPage === i + 1 ? 'bg-green-600 text-white' : ''
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </>
  );

  /* =======================
     Maint Contract Table Content
  ======================= */
  const maintContractTableContent = (
    <>
      {/* Date Filters */}
      <div className="bg-white p-4 mb-3 flex flex-wrap items-end gap-4">
        {/* Start Date */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1" style={{ direction: 'ltr', textAlign: 'left' }}>Start Date</label>
          <div className="flex gap-2">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              lang="en"
              className="border-2 border-zinc-500 rounded-lg px-3 py-1 w-16 h-9 focus:outline-none focus:ring-2 focus:ring-purple-400"
              value={maintContractStartDate.day}
              onChange={(e) => setMaintContractStartDate(prev => ({ ...prev, day: e.target.value }))}
              placeholder="DD"
              style={{ direction: 'ltr', textAlign: 'left' }}
            />
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              lang="en"
              className="border-2 border-zinc-500 rounded-lg px-3 py-1 w-16 h-9 focus:outline-none focus:ring-2 focus:ring-purple-400"
              value={maintContractStartDate.month}
              onChange={(e) => setMaintContractStartDate(prev => ({ ...prev, month: e.target.value }))}
              placeholder="MM"
              style={{ direction: 'ltr', textAlign: 'left' }}
            />
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              lang="en"
              className="border-2 border-zinc-500 rounded-lg px-3 py-1 w-20 h-9 focus:outline-none focus:ring-2 focus:ring-purple-400"
              value={maintContractStartDate.year}
              onChange={(e) => setMaintContractStartDate(prev => ({ ...prev, year: e.target.value }))}
              placeholder="YYYY"
              style={{ direction: 'ltr', textAlign: 'left' }}
            />
          </div>
        </div>

        {/* End Date */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1 style={{ direction: 'ltr', textAlign: 'left' }}">End Date</label>
          <div className="flex gap-2">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              lang="en"
              className="border-2 border-zinc-500 rounded-lg px-3 py-1 w-16 h-9 focus:outline-none focus:ring-2 focus:ring-purple-400"
              value={maintContractEndDate.day}
              onChange={(e) => setMaintContractEndDate(prev => ({ ...prev, day: e.target.value }))}
              placeholder="DD"
              style={{ direction: 'ltr', textAlign: 'left' }}
            />
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              lang="en"
              className="border-2 border-zinc-500 rounded-lg px-3 py-1 w-16 h-9 focus:outline-none focus:ring-2 focus:ring-purple-400"
              value={maintContractEndDate.month}
              onChange={(e) => setMaintContractEndDate(prev => ({ ...prev, month: e.target.value }))}
              placeholder="MM"
              style={{ direction: 'ltr', textAlign: 'left' }}
            />
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              lang="en"
              className="border-2 border-zinc-500 rounded-lg px-3 py-1 w-20 h-9 focus:outline-none focus:ring-2 focus:ring-purple-400"
              value={maintContractEndDate.year}
              onChange={(e) => setMaintContractEndDate(prev => ({ ...prev, year: e.target.value }))}
              placeholder="YYYY"
              style={{ direction: 'ltr', textAlign: 'left' }}
            />
          </div>
        </div>

        {/* Search Button */}
        <button onClick={fetchMaintContractData} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-2 rounded-lg shadow-md transition-all duration-200 w-24 h-9">
          Search
        </button>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full text-center border">
          <thead className="bg-gray-300">
            <tr>
              {[
                'Contract ID',
                'Start Date',
                'Expire Date',
                'Mobile',
                'Customer Name',
                'عدد الأصناف',
                'كروت الصيانة',
                'عدد الفواتير',
                'Cars Number',
                'Total',
                'VAT',
                'Total inc. VAT',
                'Action',
              ].map(h => (
                <th key={h} className={`border px-3 py-2 text-xs font-bold ${h === 'Action' ? 'text-white bg-blue-600' : ''}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {maintContractPaginatedData
              .map(c => {
                const status = c.maintContracts > 2 ? 'Active' : 'Inactive';
                return (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="border py-2">{c.id}</td>
                    <td className="border">{c.customerName}</td>
                    <td className="border">{c.createdAt || '2025-01-01'}</td>
                    <td className="border">{c.maintContracts}</td>
                    <td className="border">
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                        status === 'Active' ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-800'
                      }`}>
                        {status}
                      </span>
                    </td>
                    <td className="border">
                      <div className="flex gap-1">
                        <button className="bg-blue-600 text-white px-2 py-1 rounded-lg" onClick={() => alert(`Viewing contract for ${c.customerName}`)}>
                          View
                        </button>
                        <button className="bg-green-600 text-white px-2 py-1 rounded-lg" onClick={() => alert(`Editing contract for ${c.customerName}`)}>
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center py-4 gap-1">
        {[...Array(maintContractTotalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setMaintContractPage(i + 1)}
            className={`px-3 py-1 border rounded ${
              maintContractPage === i + 1 ? 'bg-purple-600 text-white' : ''
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </>
  );

  /* =======================
     Check Car Table Content
  ======================= */
  const checkCarTableContent = (
    <>
      {/* Date Filters */}
      <div className="bg-white p-4 mb-3 flex flex-wrap items-end gap-4">
        {/* Start Date */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1 style={{ direction: 'ltr', textAlign: 'left' }}">Start Date</label>
          <div className="flex gap-2">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              lang="en"
              className="border-2 border-zinc-500 rounded-lg px-3 py-1 w-16 h-9 focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={checkCarStartDate.day}
              onChange={(e) => setCheckCarStartDate(prev => ({ ...prev, day: e.target.value }))}
              placeholder="DD"
              style={{ direction: 'ltr', textAlign: 'left' }}
            />
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              lang="en"
              className="border-2 border-zinc-500 rounded-lg px-3 py-1 w-16 h-9 focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={checkCarStartDate.month}
              onChange={(e) => setCheckCarStartDate(prev => ({ ...prev, month: e.target.value }))}
              placeholder="MM"
              style={{ direction: 'ltr', textAlign: 'left' }}
            />
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              lang="en"
              className="border-2 border-zinc-500 rounded-lg px-3 py-1 w-20 h-9 focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={checkCarStartDate.year}
              onChange={(e) => setCheckCarStartDate(prev => ({ ...prev, year: e.target.value }))}
              placeholder="YYYY"
              style={{ direction: 'ltr', textAlign: 'left' }}
            />
          </div>
        </div>

        {/* End Date */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1" style={{ direction: 'ltr', textAlign: 'left' }}>End Date</label>
          <div className="flex gap-2">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              lang="en"
              className="border-2 border-zinc-500 rounded-lg px-3 py-1 w-16 h-9 focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={checkCarEndDate.day}
              onChange={(e) => setCheckCarEndDate(prev => ({ ...prev, day: e.target.value }))}
              placeholder="DD"
              style={{ direction: 'ltr', textAlign: 'left' }}
            />
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              lang="en"
              className="border-2 border-zinc-500 rounded-lg px-3 py-1 w-16 h-9 focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={checkCarEndDate.month}
              onChange={(e) => setCheckCarEndDate(prev => ({ ...prev, month: e.target.value }))}
              placeholder="MM"
              style={{ direction: 'ltr', textAlign: 'left' }}
            />
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              lang="en"
              className="border-2 border-zinc-500 rounded-lg px-3 py-1 w-20 h-9 focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={checkCarEndDate.year}
              onChange={(e) => setCheckCarEndDate(prev => ({ ...prev, year: e.target.value }))}
              placeholder="YYYY"
              style={{ direction: 'ltr', textAlign: 'left' }}
            />
          </div>
        </div>

        <input
          placeholder="Request Number"
          value={searchMobile}
          onChange={e => setSearchMobile(e.target.value)}
          className="border-2 border-zinc-500 px-2 py-1 rounded-lg h-9"
        />

        <input
          placeholder="Model"
          value={searchMobile}
          onChange={e => setSearchMobile(e.target.value)}
          className="border-2 border-zinc-500 px-2 py-1 rounded-lg h-9"
        />

        <input
          placeholder="Checkup Number"
          value={searchMobile}
          onChange={e => setSearchMobile(e.target.value)}
          className="border-2 border-zinc-500 px-2 py-1 rounded-lg h-9"
        />

        <input
          placeholder="Mobile"
          value={searchMobile}
          onChange={e => setSearchMobile(e.target.value)}
          className="border-2 border-zinc-500 px-2 py-1 rounded-lg h-9"
        />

        <div className="flex flex-col gap-1">
          <select
            className="border-2 border-zinc-500 px-2 py-1 rounded-lg h-9 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="" className='bg-black text-white'>Status</option>
            <option value="Null">Null</option>
            <option value="جديد">جديد</option>
            <option value="تم الأرسال ألي التعميد">تم الأرسال ألي التعميد</option>
          </select>
        </div>

        {/* Search Button */}
        <button onClick={fetchCheckCarData} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-2 rounded-lg shadow-md transition-all duration-200 w-24 h-9">
          Search
        </button>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full text-center border">
          <thead className="bg-gray-300">
            <tr>
              {[
                '#',
                'Recieved Date',
                'Company Name',
                'Car Owner Name',
                'Mobile',
                'Owner Mobile',
                'Plate No.',
                'Model',
                'Request Number',
                'Status',
                'Action',
              ].map(h => (
                <th key={h} className={`border px-3 py-2 text-xs font-bold ${h === 'Action' ? 'text-white bg-blue-600' : ''}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {checkCarPaginatedData
              .map(c => {
                const status = c.quotations > 3 ? 'Passed' : 'Failed';
                return (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="border py-2">{c.id}</td>
                    <td className="border">{c.customerName}</td>
                    <td className="border">{c.createdAt || '2025-01-01'}</td>
                    <td className="border">{c.quotations}</td>
                    <td className="border">
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                        status === 'Passed' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                      }`}>
                        {status}
                      </span>
                    </td>
                    <td className="border">
                      <div className="flex gap-1">
                        <button className="bg-blue-600 text-white px-2 py-1 rounded-lg" onClick={() => alert(`Viewing check for ${c.customerName}`)}>
                          View
                        </button>
                        <button className="bg-green-600 text-white px-2 py-1 rounded-lg" onClick={() => alert(`Editing check for ${c.customerName}`)}>
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center py-4 gap-1">
        {[...Array(checkCarTotalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setCheckCarPage(i + 1)}
            className={`px-3 py-1 border rounded ${
              checkCarPage === i + 1 ? 'bg-orange-600 text-white' : ''
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </>
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

      {activeTab !== 'Clients' && activeTab !== 'Loyalty Program' && activeTab !== 'Quotations' && activeTab !== 'Booking' && activeTab !== 'Maint. Contract' && activeTab !== 'Check Car' && (
        <div className="bg-white shadow rounded-lg p-10 text-gray-400 text-center">
          No Data Available
        </div>
      )}

      {activeTab === 'Clients' && tableContent}

      {activeTab === 'Loyalty Program' && loyaltyTableContent}

      {activeTab === 'Quotations' && quotationsTableContent}

      {activeTab === 'Booking' && bookingTableContent}

      {activeTab === 'Maint. Contract' && maintContractTableContent}

      {activeTab === 'Check Car' && checkCarTableContent}
    </div>
  );
};

export default Customers;
