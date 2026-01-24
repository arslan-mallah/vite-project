import React, { useState, useEffect, useCallback } from 'react';
import { invoiceService, type Invoice } from '../../core/services/invoice.service';

const Sales: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Invoices');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [draftInvoices, setDraftInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchInvoiceNo, setSearchInvoiceNo] = useState('');
  const [searchDraft, setSearchDraft] = useState('');
  
  // Form states
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [isDraft, setIsDraft] = useState(false);
  const [formData, setFormData] = useState({
    customer_info: {
      name: '',
      email: '',
      phone: '',
      address: '',
      tax_id: '',
      company_name: ''
    },
    issued_date: new Date().toISOString().split('T')[0],
    issued_by: '',
    discount: 0,
    items: [{
      item_name: '',
      item_price: 0,
      item_quantity: 1,
      item_discount: 0,
      vat_rate: 0
    }]
  });
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);


  const tabs = ['Invoices', 'Return Invoice', 'Purchases', 'Expenses', 'Renewal'];

  const fetchInvoices = useCallback(async () => {
    console.log('Fetching invoices with params:', { searchInvoiceNo });
    setLoading(true);
    try {
      const params: {
        start_date?: string;
        end_date?: string;
        invoice_no?: string;
      } = {};
      if (searchInvoiceNo) params.invoice_no = searchInvoiceNo;

      const response = await invoiceService.getInvoices(params);
      console.log('Invoices response:', response);
      if (response.success) {
        console.log('Setting invoices:', response.data.data);
        setInvoices(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  }, [searchInvoiceNo]);

  const fetchDraftInvoices = useCallback(async () => {
    console.log('Fetching draft invoices with params:', { searchDraft });
    setLoading(true);
    try {
      const params: {
        search?: string;
      } = {};
      if (searchDraft) params.search = searchDraft;

      const response = await invoiceService.getDraftInvoices(params);
      console.log('Draft invoices response:', response);
      if (response.success) {
        console.log('Setting draft invoices:', response.data.data);
        setDraftInvoices(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching draft invoices:', error);
    } finally {
      setLoading(false);
    }
  }, [searchDraft]);

  useEffect(() => {
    if (activeTab === 'Invoices') {
      fetchInvoices();
    } else if (activeTab === 'Return Invoice') {
      fetchDraftInvoices();
    }
  }, [activeTab, fetchInvoices, fetchDraftInvoices]);


  const handleSearchDraft = () => {
    fetchDraftInvoices();
  };

  // Form handlers
  const openInvoiceForm = (draft: boolean = false) => {
    setIsDraft(draft);
    setShowInvoiceForm(true);
    setFormErrors({});
  };

  const closeInvoiceForm = () => {
    setShowInvoiceForm(false);
    setFormData({
      customer_info: {
        name: '',
        email: '',
        phone: '',
        address: '',
        tax_id: '',
        company_name: ''
      },
      issued_date: new Date().toISOString().split('T')[0],
      issued_by: '',
      discount: 0,
      items: [{
        item_name: '',
        item_price: 0,
        item_quantity: 1,
        item_discount: 0,
        vat_rate: 0
      }]
    });
    setFormErrors({});
  };

  const updateFormData = (field: string, value: string | number) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev] as Record<string, string | number>,
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const updateItem = (index: number, field: string, value: string | number) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, {
        item_name: '',
        item_price: 0,
        item_quantity: 1,
        item_discount: 0,
        vat_rate: 0
      }]
    }));
  };

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    }
  };

  const calculateItemTotal = (item: {
    item_name: string;
    item_price: number;
    item_quantity: number;
    item_discount: number;
    vat_rate: number;
  }) => {
    const subtotal = (item.item_price * item.item_quantity) - item.item_discount;
    const vat = subtotal * (item.vat_rate / 100);
    return subtotal + vat;
  };

  const calculateTotal = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + (item.item_price * item.item_quantity - item.item_discount), 0);
    const vat = formData.items.reduce((sum, item) => {
      const itemSubtotal = item.item_price * item.item_quantity - item.item_discount;
      return sum + (itemSubtotal * (item.vat_rate / 100));
    }, 0);
    return {
      subtotal: subtotal - formData.discount,
      vat,
      total: subtotal - formData.discount + vat
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted');
    setSubmitting(true);
    setFormErrors({});

    // Client-side validation for finalized invoices
    if (!isDraft) {
      const errors: Record<string, string[]> = {};
      
      if (!formData.customer_info.name.trim()) {
        errors['customer_info.name'] = ['Customer name is required'];
      }
      
      if (!formData.issued_date) {
        errors['issued_date'] = ['Issued date is required'];
      }
      
      if (!formData.issued_by.trim()) {
        errors['issued_by'] = ['Issued by is required'];
      }
      
      if (!formData.items.length || !formData.items[0].item_name.trim()) {
        errors['items.0.item_name'] = ['At least one item with name is required'];
      }
      
      formData.items.forEach((item, index) => {
        if (!item.item_name.trim()) {
          errors[`items.${index}.item_name`] = ['Item name is required'];
        }
        if (item.item_price <= 0) {
          errors[`items.${index}.item_price`] = ['Item price must be greater than 0'];
        }
        if (item.item_quantity < 1) {
          errors[`items.${index}.item_quantity`] = ['Item quantity must be at least 1'];
        }
      });
      
      if (Object.keys(errors).length > 0) {
        console.log('Client-side validation errors:', errors);
        setFormErrors(errors);
        setSubmitting(false);
        return;
      }
    }

    try {
      console.log('Submitting form data:', formData);
      console.log('Is draft:', isDraft);
      
      const response = isDraft 
        ? await invoiceService.createDraftInvoice(formData)
        : await invoiceService.createInvoice(formData);
      
      console.log('Response:', response);

      if (response.success) {
        console.log('Invoice created successfully, refreshing table...');
        closeInvoiceForm();
        // Refresh the appropriate table
        if (isDraft) {
          console.log('Refreshing draft invoices...');
          fetchDraftInvoices();
        } else {
          console.log('Refreshing invoices...');
          fetchInvoices();
        }
        alert(`${isDraft ? 'Draft' : 'Invoice'} created successfully!`);
      } else if (response.errors) {
        console.log('Validation errors:', response.errors);
        setFormErrors(response.errors);
      } else {
        console.log('Unknown response:', response);
        alert(response.message || `Failed to create ${isDraft ? 'draft' : 'invoice'}`);
      }
    } catch (error) {
      console.error('Error creating invoice:', error);
      alert(`An error occurred while creating the ${isDraft ? 'draft' : 'invoice'}`);
    } finally {
      setSubmitting(false);
    }
  };

  const renderDraftInvoicesTable = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Search and Filters */}
<div className="bg-white p-4 mb-4 flex items-center justify-between border-b border-gray-200">
  
  {/* LEFT SIDE (50%) */}
  <div className="flex gap-2 w-1/2">
    <input
      type="text"
      placeholder="Search Draft No or Customer Name"
      value={searchDraft}
      onChange={e => setSearchDraft(e.target.value)}
      className="border-2 border-gray-300 px-3 py-2 rounded-lg h-10 text-sm flex-1"
    />

    <button
      onClick={handleSearchDraft}
      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 rounded-lg shadow-md transition-all duration-200 h-10 flex items-center justify-center"
    >
      Search
    </button>
  </div>

  {/* RIGHT SIDE BUTTON */}
  <button
    onClick={() => openInvoiceForm(true)}
    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 rounded-lg shadow-md transition-all duration-200 h-10 flex items-center justify-center"
  >
    Add Draft
  </button>

</div>


      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full text-center border">
          <thead className="bg-gray-300">
            <tr>
              {[
                'Draft No',
                'Customer Name',
                'Issued Date',
                'Issued By',
                'Total',
                'VAT',
                'Total Inc. VAT',
                'Action',
              ].map(h => (
                <th key={h} className={`border px-3 py-3 text-xs font-bold ${h === 'Action' ? 'text-white bg-blue-600' : ''}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="text-center text-gray-400 py-8">
                  Loading draft invoices...
                </td>
              </tr>
            ) : draftInvoices.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center text-gray-400 py-8">
                  No draft invoices found.
                </td>
              </tr>
            ) : (
              draftInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="border py-3 px-2">{invoice.draft_no || 'N/A'}</td>
                  <td className="border py-3 px-2">{invoice.customer_info?.name || 'N/A'}</td>
                  <td className="border py-3 px-2">{formatDate(invoice.issued_date)}</td>
                  <td className="border py-3 px-2">{invoice.issued_by}</td>
                  <td className="border py-3 px-2">{formatCurrency(invoice.total)}</td>
                  <td className="border py-3 px-2">{formatCurrency(invoice.vat)}</td>
                  <td className="border py-3 px-2 font-semibold">{formatCurrency(invoice.total_inc_vat)}</td>
                  <td className="border p-0 bg-blue-600 hover:bg-blue-700">
                    <button
                      className="w-full h-full text-white font-semibold py-2 px-3 bg-transparent"
                      style={{ minHeight: '44px' }}
                      onClick={() => {
                        // TODO: Implement view/edit draft invoice details
                        alert(`View draft invoice ${invoice.draft_no || invoice.id}`);
                      }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const renderInvoicesTable = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Search and Filters */}
<div className="bg-white p-4 mb-4 flex items-center justify-between border-b border-gray-200">
  
  {/* LEFT SIDE (50%) */}
  <div className="flex gap-2 w-1/2">
    <input
      type="text"
      placeholder="Search Invoice No or Customer Name"
      value={searchInvoiceNo}
      onChange={e => setSearchInvoiceNo(e.target.value)}
      className="border-2 border-gray-300 px-3 py-2 rounded-lg h-10 text-sm flex-1"
    />

    <button
      onClick={() => fetchInvoices()}
      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 rounded-lg shadow-md transition-all duration-200 h-10 flex items-center justify-center"
    >
      Search
    </button>
  </div>

  {/* RIGHT SIDE BUTTON */}
  <button
    onClick={() => openInvoiceForm(false)}
    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 rounded-lg shadow-md transition-all duration-200 h-10 flex items-center justify-center"
  >
    Add Invoice
  </button>

</div>


      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full text-center border">
          <thead className="bg-gray-300">
            <tr>
              {[
                'Invoice No',
                'Customer Name',
                'Issued Date',
                'Issued By',
                'Total',
                'VAT',
                'Total Inc. VAT',
                'Action',
              ].map(h => (
                <th key={h} className={`border px-3 py-3 text-xs font-bold ${h === 'Action' ? 'text-white bg-blue-600' : ''}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center text-gray-400 py-8">
                  Loading invoices...
                </td>
              </tr>
            ) : invoices.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center text-gray-400 py-8">
                  No invoices found.
                </td>
              </tr>
            ) : (
              invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="border py-3 px-2">{invoice.invoice_no}</td>
                  <td className="border py-3 px-2">{invoice.customer_info?.name || 'N/A'}</td>
                  <td className="border py-3 px-2">{formatDate(invoice.issued_date)}</td>
                  <td className="border py-3 px-2">{invoice.issued_by}</td>
                  <td className="border py-3 px-2">{formatCurrency(invoice.total)}</td>
                  <td className="border py-3 px-2">{formatCurrency(invoice.vat)}</td>
                  <td className="border py-3 px-2 font-semibold">{formatCurrency(invoice.total_inc_vat)}</td>
                  <td className="border p-0 bg-blue-600 hover:bg-blue-700">
                    <button
                      className="w-full h-full text-white font-semibold py-2 px-3 bg-transparent"
                      style={{ minHeight: '44px' }}
                      onClick={() => {
                        // TODO: Implement view invoice details
                        alert(`View invoice ${invoice.invoice_no}`);
                      }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
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

      {/* Content Section */}
      {activeTab === 'Invoices' && renderInvoicesTable()}
      {activeTab === 'Return Invoice' && renderDraftInvoicesTable()}

      {activeTab !== 'Invoices' && activeTab !== 'Return Invoice' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <p className="text-sm font-medium">No Data Available for {activeTab}</p>
          </div>
        </div>
      )}

      {/* Invoice Form Modal */}
      {showInvoiceForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {isDraft ? 'Create Draft Invoice' : 'Create Invoice'}
                </h2>
                <button
                  onClick={closeInvoiceForm}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Customer Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Customer Name {!isDraft && <span className="text-red-500">*</span>}
                      </label>
                      <input
                        type="text"
                        value={formData.customer_info.name}
                        onChange={(e) => updateFormData('customer_info.name', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required={!isDraft}
                      />
                      {formErrors['customer_info.name'] && (
                        <p className="text-red-500 text-sm mt-1">{formErrors['customer_info.name'][0]}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={formData.customer_info.email}
                        onChange={(e) => updateFormData('customer_info.email', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="text"
                        value={formData.customer_info.phone}
                        onChange={(e) => updateFormData('customer_info.phone', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                      <input
                        type="text"
                        value={formData.customer_info.company_name}
                        onChange={(e) => updateFormData('customer_info.company_name', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Invoice Details */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Invoice Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Issued Date {!isDraft && <span className="text-red-500">*</span>}
                      </label>
                      <input
                        type="date"
                        value={formData.issued_date}
                        onChange={(e) => updateFormData('issued_date', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required={!isDraft}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Issued By {!isDraft && <span className="text-red-500">*</span>}
                      </label>
                      <input
                        type="text"
                        value={formData.issued_by}
                        onChange={(e) => updateFormData('issued_by', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required={!isDraft}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Discount</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.discount}
                        onChange={(e) => updateFormData('discount', parseFloat(e.target.value) || 0)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Items</h3>
                    <button
                      type="button"
                      onClick={addItem}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                      Add Item
                    </button>
                  </div>

                  {formData.items.map((item, index) => (
                    <div key={index} className="bg-white p-4 rounded-md mb-4 border">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium">Item {index + 1}</h4>
                        {formData.items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Item Name {!isDraft && <span className="text-red-500">*</span>}
                          </label>
                          <input
                            type="text"
                            value={item.item_name}
                            onChange={(e) => updateItem(index, 'item_name', e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required={!isDraft}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Price {!isDraft && <span className="text-red-500">*</span>}
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={item.item_price}
                            onChange={(e) => updateItem(index, 'item_price', parseFloat(e.target.value) || 0)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required={!isDraft}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Quantity {!isDraft && <span className="text-red-500">*</span>}
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={item.item_quantity}
                            onChange={(e) => updateItem(index, 'item_quantity', parseInt(e.target.value) || 1)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required={!isDraft}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Discount</label>
                          <input
                            type="number"
                            step="0.01"
                            value={item.item_discount}
                            onChange={(e) => updateItem(index, 'item_discount', parseFloat(e.target.value) || 0)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">VAT Rate (%)</label>
                          <input
                            type="number"
                            step="0.01"
                            value={item.vat_rate}
                            onChange={(e) => updateItem(index, 'vat_rate', parseFloat(e.target.value) || 0)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Total</label>
                          <input
                            type="text"
                            value={calculateItemTotal(item).toFixed(2)}
                            readOnly
                            className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex justify-end">
                    <div className="w-64 space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">Subtotal:</span>
                        <span>${calculateTotal().subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">VAT:</span>
                        <span>${calculateTotal().vat.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold border-t pt-2">
                        <span>Total:</span>
                        <span>${calculateTotal().total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={closeInvoiceForm}
                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    disabled={submitting}
                  >
                    {submitting ? 'Creating...' : `Create ${isDraft ? 'Draft' : 'Invoice'}`}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;