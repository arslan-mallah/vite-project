import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { httpService } from '../../core/http/abi-http.service';

interface ItemProperty {
  property_id: number;
  item_id: number;
  location?: string;
  manufactory?: string;
  categories?: string;
  created_at?: string;
  updated_at?: string;
}

interface ItemExtra {
  extra_id: number;
  item_id: number;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

interface ItemUnit {
  unit_id: number;
  item_id: number;
  unit_type?: string;
  created_at?: string;
  updated_at?: string;
  prices?: UnitPrice[];
}

interface UnitPrice {
  price_id: number;
  unit_id: number;
  cost_price: number;
  sale_price: number;
  virtual_cost_price: number;
  created_at?: string;
  updated_at?: string;
}

interface Item {
  item_id: number;
  item_name: string;
  item_number: string;
  item_category: string;
  item_type: string;
  sales_type: string;
  warehouse: string;
  units: string;
  created_at?: string;
  updated_at?: string;
  properties?: ItemProperty[];
  extras?: ItemExtra[];
  item_units?: ItemUnit[];
}

interface Unit {
  unit_id: number;
  item_id: number;
  unit_type: string;
  created_at?: string;
  updated_at?: string;
  item?: Item;
  prices?: UnitPrice[];
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

const Inventory: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState(() => {
    const pathname = location.pathname;
    const pathToTab = {
      '/inventory/vendors': 'Vendors',
      '/inventory/units': 'Units',
      '/inventory/start-inventory': 'Start Inventory',
      '/inventory/inventory-cats': 'Inventory Cats',
      '/inventory/items': 'Inventory Items',
      '/inventory/inventory-report': 'Inventory Report',
      '/inventory/most-sales': 'Most Sales',
      '/inventory/less-sales': 'Less Sales'
    };
    return pathToTab[pathname as keyof typeof pathToTab] || 'Inventory Items';
  });
  const [items, setItems] = useState<Item[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(false);

  const tabs = ['Vendors', 'Units', 'Start Inventory', 'Inventory Cats', 'Inventory Items', 'Inventory Report', 'Most Sales', 'Less Sales'];

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const result: ApiResponse<Item[]> = await httpService.get('/inventory/items');
      if (result.success) {
        setItems(result.data);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUnits = useCallback(async () => {
    setLoading(true);
    try {
      const result: ApiResponse<Unit[]> = await httpService.get('/inventory/units');
      if (result.success) {
        setUnits(result.data);
      }
    } catch (error) {
      console.error('Error fetching units:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update URL when active tab changes
  useEffect(() => {
    const tabToPath = {
      'Vendors': '/inventory/vendors',
      'Units': '/inventory/units',
      'Start Inventory': '/inventory/start-inventory',
      'Inventory Cats': '/inventory/inventory-cats',
      'Inventory Items': '/inventory/items',
      'Inventory Report': '/inventory/inventory-report',
      'Most Sales': '/inventory/most-sales',
      'Less Sales': '/inventory/less-sales'
    };
    const path = tabToPath[activeTab as keyof typeof tabToPath] || '/inventory/items';
    if (location.pathname !== path) {
      navigate(path, { replace: true });
    }
  }, [activeTab, navigate, location.pathname]);

  // Update active tab when URL changes
  useEffect(() => {
    const pathname = location.pathname;
    const pathToTab = {
      '/inventory/vendors': 'Vendors',
      '/inventory/units': 'Units',
      '/inventory/start-inventory': 'Start Inventory',
      '/inventory/inventory-cats': 'Inventory Cats',
      '/inventory/items': 'Inventory Items',
      '/inventory/inventory-report': 'Inventory Report',
      '/inventory/most-sales': 'Most Sales',
      '/inventory/less-sales': 'Less Sales'
    };
    const newTab = pathToTab[pathname as keyof typeof pathToTab] || 'Inventory Items';
    setActiveTab(newTab);
  }, [location.pathname]);

  useEffect(() => {
    if (activeTab === 'Inventory Items') {
      fetchItems();
    } else if (activeTab === 'Units') {
      fetchUnits();
    }
  }, [activeTab, fetchItems, fetchUnits]);

  const renderItemsTable = () => (
    <div className="bg-white shadow rounded-lg overflow-x-auto">
      {/* Search Filters */}
      <div className="bg-white p-4 mb-3 flex flex-wrap items-end gap-4">
        <input
          placeholder="Item Code"
          className="border-2 border-zinc-500 px-2 py-1 rounded-lg h-9"
        />
        
        <input
          placeholder="Item Name"
          className="border-2 border-zinc-500 px-2 py-1 rounded-lg h-9"
        />

        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-2 rounded-lg shadow-md transition-all duration-200 w-24 h-9">
          Search
        </button>

        {/* spacer */}
        <div className="ml-auto flex gap-2">
          <button className="bg-blue-600 text-white px-2 py-1 rounded-lg h-9 w-32">
            Add Item
          </button>
        </div>
      </div>

      <table className="min-w-full text-center border">
        <thead className="bg-gray-300">
          <tr>
            {[
              'Item ID',
              'Item Name',
              'Item Number',
              'Category',
              'Type',
              'Sales Type',
              'Warehouse',
              'Units',
              'Action',
            ].map(h => (
              <th key={h} className={`border px-3 py-2 text-xs font-bold ${h === 'Action' ? 'text-white bg-blue-600' : ''}`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={9} className="text-center text-gray-400 py-4">Loading...</td>
            </tr>
          ) : items.length === 0 ? (
            <tr>
              <td colSpan={9} className="text-center text-gray-400 py-4">No items found.</td>
            </tr>
          ) : (
            items.map((item) => (
              <tr key={item.item_id} className="hover:bg-gray-50">
                <td className="border py-2">{item.item_id}</td>
                <td className="border">{item.item_name}</td>
                <td className="border">{item.item_number}</td>
                <td className="border">{item.item_category || 'N/A'}</td>
                <td className="border">{item.item_type}</td>
                <td className="border">{item.sales_type || 'N/A'}</td>
                <td className="border">{item.warehouse || 'N/A'}</td>
                <td className="border">{item.units || 'N/A'}</td>
                <td className="border">
                  <div className="flex">
                    <button
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-none"
                    >
                      Update
                    </button>
                    <button
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded-none"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  const renderUnitsTable = () => (
    <div className="bg-white shadow rounded-lg overflow-x-auto">
      {/* Search Filters */}
      <div className="bg-white p-4 mb-3 flex flex-wrap items-end gap-4">
        {/* spacer */}
        <div className="ml-auto flex gap-2">
          <button className="bg-blue-600 text-white px-2 py-1 rounded-lg h-9 w-32">
            Add Unit
          </button>
        </div>
      </div>

      <table className="min-w-full text-center border">
        <thead className="bg-gray-300">
          <tr>
            {[
              'Unit ID',
              'Item Name',
              'Unit Type',
              'Cost Price',
              'Sale Price',
              'Virtual Cost Price',
              'Action',
            ].map(h => (
              <th key={h} className={`border px-3 py-2 text-xs font-bold ${h === 'Action' ? 'text-white bg-blue-600' : ''}`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={7} className="text-center text-gray-400 py-4">Loading...</td>
            </tr>
          ) : units.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center text-gray-400 py-4">No units found.</td>
            </tr>
          ) : (
            units.map((unit) => (
              <tr key={unit.unit_id} className="hover:bg-gray-50">
                <td className="border py-2">{unit.unit_id}</td>
                <td className="border">{unit.item?.item_name || 'N/A'}</td>
                <td className="border">{unit.unit_type || 'N/A'}</td>
                <td className="border">{unit.prices?.[0]?.cost_price || 'N/A'}</td>
                <td className="border">{unit.prices?.[0]?.sale_price || 'N/A'}</td>
                <td className="border">{unit.prices?.[0]?.virtual_cost_price || 'N/A'}</td>
                <td className="border">
                  <div className="flex">
                    <button
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-none"
                    >
                      Update
                    </button>
                    <button
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded-none"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

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
        {activeTab === 'Inventory Items' && renderItemsTable()}
        {activeTab === 'Units' && renderUnitsTable()}
        {activeTab !== 'Inventory Items' && activeTab !== 'Units' && (
          <div className="w-full min-h-screen bg-white p-4 flex justify-center items-center text-gray-400 text-lg font-semibold">
            No Data Available for {activeTab}
          </div>
        )}
      </div>
    </div>
  );
};

export default Inventory;