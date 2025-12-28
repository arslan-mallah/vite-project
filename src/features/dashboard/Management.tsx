import { useCallback, useState, useEffect } from 'react';
import { httpService } from '../../core/http/abi-http.service';

export default function Management() {
  const [startDate, setStartDate] = useState({
    day: '1',
    month: '1',
    year: '2025'
  });
  const [endDate, setEndDate] = useState({
    day: '4',
    month: '12',
    year: '2025'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
interface ManagementItem {
  label: string;
  value: string | number;
  type?: string;
  color?: string;
}

  const [sections, setSections] = useState<{ title: string; items: ManagementItem[] }[]>([]);

  const fetchManagementData = useCallback(async () => {
    try {
      setLoading(true);
      const start = `${startDate.year}-${startDate.month.padStart(2, '0')}-${startDate.day.padStart(2, '0')}`;
      const end = `${endDate.year}-${endDate.month.padStart(2, '0')}-${endDate.day.padStart(2, '0')}`;
      const result: unknown = await httpService.get(`/dashboard/management?start_date=${start}&end_date=${end}`);
      interface ManagementApiResponse {
        success: boolean;
        data: {
          vat: { sales_vat: number; expenses: number; purchase: number; tax_due: number };
          cashflow: ManagementItem[];
          purchase: ManagementItem[];
          expenses: ManagementItem[];
          maintenance: ManagementItem[];
          sales: ManagementItem[];
        };
        message?: string;
      }
      const typedResult = result as ManagementApiResponse;
      if (typedResult && typedResult.success) {
        const data = typedResult.data;
        const formattedSections = [
          {
            title: "VAT",
            items: [
              { label: "Sales VAT", value: data.vat.sales_vat, type: "Total" },
              { label: "Expenses VAT", value: data.vat.expenses, type: "Total" },
              { label: "Purchase VAT", value: data.vat.purchase, type: "Total" },
              { label: "Tax Due", value: data.vat.tax_due, type: "Total" },
            ],
          },
          {
            title: "Cashflow",
            items: data.cashflow,
          },
          {
            title: "Purchase",
            items: data.purchase,
          },
          {
            title: "Expenses",
            items: data.expenses,
          },
          {
            title: "Maintenance Cards",
            items: data.maintenance,
          },
          {
            title: "Sales",
            items: data.sales,
          },
        ];
        setSections(formattedSections);
      } else {
        setSections([]);
        setError('Failed to fetch data');
      }
    } catch (err: unknown) {
      setError((err as Error).message);
      setSections([]);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchManagementData();
  }, [startDate, endDate, fetchManagementData]);

  return (
    <div className="w-full min-h-screen bg-white p-4">
      <div className="ml-5 flex flex-wrap items-end gap-4 mb-6">
          {/* Start Date */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">Start Date</label>
            <div className="flex gap-2">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                lang="en"h-9 
                className="border-2 border-zinc-500 rounded-lg px-3 py-1 w-16 h-9 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={startDate.day}
                onChange={(e) => setStartDate(prev => ({ ...prev, day: e.target.value }))}
                placeholder="DD"
                style={{ direction: 'ltr', textAlign: 'left' }}
              />
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                lang="en"
                className="border-2 border-zinc-500 rounded-lg px-3 py-1 w-16 h-9 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={startDate.month}
                onChange={(e) => setStartDate(prev => ({ ...prev, month: e.target.value }))}
                placeholder="MM"
                style={{ direction: 'ltr', textAlign: 'left' }}
              />
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                lang="en"
                className="border-2 border-zinc-500 rounded-lg px-3 py-1 w-20 h-9 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={startDate.year}
                onChange={(e) => setStartDate(prev => ({ ...prev, year: e.target.value }))}
                placeholder="YYYY"
                style={{ direction: 'ltr', textAlign: 'left' }}
              />
            </div>
          </div>

          {/* End Date */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">End Date</label>
            <div className="flex gap-2">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                lang="en"
                className="border-2 border-zinc-500 rounded-lg px-3 py-1 w-16 h-9 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={endDate.day}
                onChange={(e) => setEndDate(prev => ({ ...prev, day: e.target.value }))}
                placeholder="DD"
                style={{ direction: 'ltr', textAlign: 'left' }}
              />
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                lang="en"
                className="border-2 border-zinc-500 rounded-lg px-3 py-1 w-16 h-9 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={endDate.month}
                onChange={(e) => setEndDate(prev => ({ ...prev, month: e.target.value }))}
                placeholder="MM"
                style={{ direction: 'ltr', textAlign: 'left' }}
              />
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                lang="en"
                className="border-2 border-zinc-500 rounded-lg px-3 py-1 w-20 h-9 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={endDate.year}
                onChange={(e) => setEndDate(prev => ({ ...prev, year: e.target.value }))}
                placeholder="YYYY"
                style={{ direction: 'ltr', textAlign: 'left' }}
              />
            </div>
          </div>

          {/* Search Button */}
          <button onClick={fetchManagementData} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-2 rounded-lg shadow-md transition-all duration-200 w-24 h-9">
            Search
          </button>
        </div>


      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-2 text-gray-600">Loading dashboard data...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-8">
          <p className="text-red-600">Error: {error}</p>
          <button 
            onClick={fetchManagementData}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-4 p-6">
  {sections.map((section) => (
    <div key={section.title} className="flex flex-col">
      {/* Section Title */}
      <div className="bg-gray-800 text-white text-center py-2 font-semibold text-lg rounded-lg mb-3 shadow-md">
        {section.title}
      </div>

      {/* Items */}
      {section.items.map((item: ManagementItem) => (
        <div
          key={item.label}
          className="border border-gray-200 rounded-lg p-4 mb-3 bg-gray-100 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 flex flex-col justify-between"
        >
          {/* Item Label */}
          <div className="text-center text-base font-semibold text-gray-800 mb-2">
            {item.label}
          </div>

          <hr className="my-2 border-gray-200" />

          {/* Value & Type */}
          <div className="flex justify-between items-center mb-2">
            <div className="text-center text-xl font-bold text-gray-900">
              {item.value}
            </div>
            <div className="text-right text-sm font-medium text-gray-500">
              {item.type}
            </div>
          </div>

          <hr className="my-2 border-gray-200" />

          {/* Button */}
          <div className="flex justify-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-2 rounded-lg shadow-md transition-all duration-200 w-24 h-9">
              View
            </button>
          </div>
        </div>
      ))}
    </div>
  ))}
</div>

      )}
    </div>
  );
}
