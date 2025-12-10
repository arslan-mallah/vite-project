import Customers from "./Customers";

export default function Management({ activeTab }: { activeTab: string }) {
  const sections = [
    {
      title: "VAT",
      items: [
        { label: "Sales VAT", value: 60219, type: "Total" },
        { label: "Expenses", value: 8106.59, type: "Total" },
        { label: "Purchase", value: 7008, type: "Total" },
        { label: "Expenses", value: 15114.66, type: "Total" },
        { label: "Tax due", value: 45104.44, type: "Balance" },
      ],
    },
    {
      title: "Cashflow",
      items: [
        { label: "Cash", value: 150513.82, type: "Balance" },
        { label: "SPAN", value: 75683.15, type: "Balance" },
        { label: "Rajhi Bank Transfer", value: 17687.11, type: "Balance" },
        { label: "Rajhi Bank Transfer", value: 7597.5, type: "Balance" },
        { label: "Rajhi Bank Transfer", value: 11500, type: "Balance" },
      ],
    },
    {
      title: "Purchase",
      items: [
        { label: "Post-paid Purchase", value: 13258.52, type: "Total" },
        { label: "Paid Purchase", value: 42815, type: "Total" },
        { label: "Paid Purchase", value: 30493.57, type: "Total" },
        { label: "مورد قطع نوا", value: 35085, type: "Total" },
        { label: "شركة سالم الياباني", value: 998.2, type: "Total" },
      ],
    },
    {
      title: "Expenses",
      items: [
        { label: "Salaries - Pay Advanced - Iqama", value: 62821.55, type: "Total" },
        { label: "Rental", value: 30434.78, type: "Total" },
        { label: "Restaurant", value: 1901.3, type: "Total" },
        { label: "Service Invoices", value: 1725, type: "Total" },
      ],
    },
    {
      title: "Maintenance Cards",
      items: [
        { label: "Under Process", value: 40, type: "Count" },
        { label: "Closed", value: 36, type: "Count" },
        { label: "Not invoiced", value: 139261.8, type: "Total" },
        { label: "Paid", value: 183338.2, type: "Total" },
        { label: "Collected", value: 2600, type: "Total" },
      ],
    },
    {
      title: "Sales",
      items: [
        { label: "Paid bills", value: 257502, type: "Total" },
        { label: "Collection", value: 23956, type: "Total" },
        { label: "Credit Note", value: 0, type: "Total" },
        { label: "Quotations", value: 31, type: "Count" },
        { label: "Contracts", value: 5, type: "Count" },
      ],
    },
  ];

  return (
    <div className="w-full min-h-screen bg-white p-4">
      <div className="ml-5 flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
        <button className="border-2 border-zinc-500 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg transition-all duration-300">
          Logout
        </button>
        <button className="ml-auto px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-lg transition-all duration-300">
          Refresh
        </button>
      </div>

      {activeTab === "management" && (
        <>
          <div className="ml-5 flex flex-wrap items-end gap-4 mb-6">
              {/* Start Date */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1">Start Date</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    lang="en"
                    className="border-2 border-zinc-500 rounded-lg px-3 py-1 w-16 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    defaultValue="1"
                    placeholder="DD"
                    style={{ direction: 'ltr', textAlign: 'left' }}
                  />
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    lang="en"
                    className="border-2 border-zinc-500 rounded-lg px-3 py-1 w-16 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    defaultValue="1"
                    placeholder="MM"
                    style={{ direction: 'ltr', textAlign: 'left' }}
                  />
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    lang="en"
                    className="border-2 border-zinc-500 rounded-lg px-3 py-1 w-20 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    defaultValue="2025"
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
                    className="border-2 border-zinc-500 rounded-lg px-3 py-1 w-16 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    defaultValue="4"
                    placeholder="DD"
                    style={{ direction: 'ltr', textAlign: 'left' }}
                  />
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    lang="en"
                    className="border-2 border-zinc-500 rounded-lg px-3 py-1 w-16 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    defaultValue="12"
                    placeholder="MM"
                    style={{ direction: 'ltr', textAlign: 'left' }}
                  />
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    lang="en"
                    className="border-2 border-zinc-500 rounded-lg px-3 py-1 w-20 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    defaultValue="2025"
                    placeholder="YYYY"
                    style={{ direction: 'ltr', textAlign: 'left' }}
                  />
                </div>
              </div>

              {/* Search Button */}
              <button className="px-6 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-all duration-200">
                Search
              </button>
            </div>


          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-6 p-4">
            {sections.map((section) => (
              <div
                key={section.title}
                className="flex flex-col"
              >
                {/* Section Title */}
                <div className="bg-black text-white text-center py-3 font-bold text-lg rounded-2xl mb-4 shadow-md">
                  {section.title}
                </div>

                {/* Items */}
                {section.items.map((item) => (
                  <div
                    key={item.label}
                    className="border-2 border-black rounded-2xl p-4 mb-4  bg-gray-300 shadow hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between"
                  >
                    <div className="text-center text-m font-bold text-gray-700 mb-2">
                      {item.label}
                    </div>

                    <hr className="my-3 border-gray-600" />

                    <div className="flex justify-between items-center mb-3">
                      <div className="text-center text-xl font-bold text-gray-900">
                        {item.value}
                      </div>
                      <div className="text-right text-s font-bold text-gray-500">
                        :{item.type}
                      </div>
                    </div>

                    <hr className="my-3 border-gray-600" />
                    <div className="flex justify-center">
                      <button className="bg-blue-500 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition-colors duration-200">
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === "customers" && (
        <Customers />
      )}
    </div>
  );
}
