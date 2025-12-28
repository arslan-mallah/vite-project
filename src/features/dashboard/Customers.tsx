import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { httpService } from '../../core/http/abi-http.service';

console.log('Customers.tsx loaded');


/* =======================
   Types
======================= */
interface Customer {
  id: string | number;
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
  // Additional booking fields
  appointment_date?: string;
  start_time?: string;
  end_time?: string;
  status?: string;
  service_type?: string;
  description?: string;
  plate_no?: string;
  model?: string;
  employee_name?: string;
  advance_payment?: string;
  updated_by?: string;
}

interface Quotation {
  id: string;
  quote_number: string;
  customer_id: string;
  customer?: {
    name: string;
    mobile?: string;
    type?: string;
    bg_color?: string;
    text_color?: string;
  };
  quote_date: string;
  grand_total: number;
  status: string;
  description: string;
  plate_no?: string;
  model?: string;
  created_at?: string;
  updated_at?: string;
  // Additional properties used in UI
  customer_name?: string;
  quotation_date?: string;
  valid_until?: string;
  total_amount?: number;
  vat?: number;
  total_inc_vat?: number;
  added_by?: string;
  customer_type?: string;
  mobile?: string;
  status_bg_color?: string;
  status_text_color?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

interface BookingCustomer {
  id?: string;
  name?: string;
  mobile?: string;
  email?: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
  customer_type?: string;
  status?: string;
  // Add other customer properties as needed
}

interface BookingAppointment {
  id: number;
  tenant_id?: number;
  customer_id?: number;
  car_id?: number;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: string;
  service_type?: string;
  description?: string;
  customer_name?: string;
  customer_phone?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: number;
  updated_by?: number;
  created_by_name?: string;
  updated_by_name?: string;
  customer?: BookingCustomer; // Customer object from backend
  car?: {
    id?: number;
    plate_number?: string;
    car_model?: string;
    plate_no?: string; // For backward compatibility
    model?: string; // For backward compatibility
  };
  audit_logs?: AuditLog[];
  license_type?: LicenseType;
}

interface AuditLog {
  id?: number;
  action_type: string;
  module: string;
  table_name: string;
  record_id?: string;
  row_before?: string;
  row_after?: string;
  user_id?: number;
  user_ip?: string;
  user_agent?: string;
  url?: string;
  created_at?: string;
  updated_at?: string;
}

interface LicenseType {
  id?: number;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

interface BookingStatistics {
  total_appointments: number;
  today_appointments: number;
  pending_appointments: number;
  total_cars: number;
}

interface BookingResponse {
  appointments: BookingAppointment[];
  statistics: BookingStatistics;
  today_appointments: BookingAppointment[];
  total_records: number;
}

/* =======================
   Badge
======================= */
const customerTypeCellColors: Record<Customer['customerType'], string> = {
  Individual: 'bg-blue-200 text-blue-800',
  'Comp. client': 'bg-green-200 text-green-800',
  Government: 'bg-purple-200 text-purple-800',
};

const CustomerTypeBadge: React.FC<{ type: Customer['customerType'] }> = ({ type }) => (
  <span className={`px-2 py-0.5 text-xs font-semibold rounded-full`}>{type}</span>
);


/* =======================
   Form Components
======================= */
const Section = React.memo(({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-gray-50 border rounded-xl p-6">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
    {children}
  </div>
));

const Grid = React.memo(({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{children}</div>
));

type InputProps = {
  label: string;
  value?: string;
  onChange?: (value: string) => void;
  type?: string;
  required?: boolean;
};

const Input = React.memo(({ label, value, onChange, type = 'text', required }: InputProps) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      required={required}
      value={value ?? ''}
      onChange={(e) => onChange?.(e.target.value)}
      className="w-full h-11 rounded-lg border border-gray-300 px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
    />
  </div>
));

type TextareaProps = {
  label: string;
  value?: string;
  onChange?: (value: string) => void;
};

const Textarea = React.memo(({ label, value, onChange }: TextareaProps) => (
  <div className="md:col-span-2 lg:col-span-3">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <textarea
      rows={3}
      value={value ?? ''}
      onChange={(e) => onChange?.(e.target.value)}
      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
    />
  </div>
));

/* =======================
   Main Component
======================= */
// Helper to normalize tab name from URL (replace - with space, fix Maint Contract, lowercase)
function normalizeTab(tab: string | undefined): string {
  if (!tab) return 'Clients';
  let t = tab.replace(/-/g, ' ');
  if (t === 'maint contract') t = 'Maint. Contract';
  // Capitalize first letter of each word
  t = t.replace(/\b\w/g, c => c.toUpperCase());
  return t;
}
// Helper to encode tab for URL (lowercase, replace space with dash, remove dot)
function encodeTab(tab: string): string {
  if (tab === 'Clients') return '';
  if (tab === 'Maint. Contract') return 'maint-contract';
  return tab.replace(/\./g, '').replace(/ /g, '-').toLowerCase();
}

const Customers: React.FC = () => {
  const tabs = ['Clients', 'Loyalty Program', 'Quotations', 'Booking', 'Maint. Contract', 'Check Car'];
  const navigate = useNavigate();
  const location = useLocation();

  // Set initial activeTab from current URL
  const initialTab = normalizeTab(location.pathname.split('/')[2]);
  const [activeTab, setActiveTab] = useState(initialTab);
  console.log('Customers component rendered, activeTab:', activeTab);
  const [customers, setCustomers] = useState<Customer[]>([]);

  // Sync activeTab with URL on location change
  useEffect(() => {
    const pathSegments = location.pathname.split('/');
    const tabFromPath = pathSegments[2]; // /customers/tab
    const normalized = normalizeTab(tabFromPath);
    setActiveTab(normalized);
  }, [location.pathname]);

  const [searchMobile, setSearchMobile] = useState('');
  const [searchCustomerName, setSearchCustomerName] = useState('');
  const [searchCompanyName, setSearchCompanyName] = useState('');
  const [searchModel, setSearchModel] = useState('');
  const [searchQuotNo, setSearchQuotNo] = useState('');

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
  const [quotationsData, setQuotationsData] = useState<Quotation[]>([]);
  const [loyaltyData, setLoyaltyData] = useState<Customer[]>([]);

  const [bookingData, setBookingData] = useState<Customer[]>([]);
  const [maintContractData, setMaintContractData] = useState<Customer[]>([]);
  const [checkCarData, setCheckCarData] = useState<Customer[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [loyaltyPage, setLoyaltyPage] = useState(1);
  const [bookingPage, setBookingPage] = useState(1);
  const [maintContractPage, setMaintContractPage] = useState(1);
  const [checkCarPage, setCheckCarPage] = useState(1);
  const itemsPerPage = 10;

  // Add Customer Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    account_number: '',
    type: 'Individual' as Customer['customerType'],
    client_source: '',
    mobile: '',
    customer_name: '',
    company_name: '',
    quotations: '',
    current_balance: '', // This maps to Points/Loyalty Points
    calendar_events: '',
    maint_contracts: '',
    // New fields
    id_number: '',
    city: '',
    vat_number: '',
    cr_number: '',
    street_name: '',
    building_no: '',
    branch_no: '',
    district: '',
    zipcode: '',
    address: '',
    entity_name: '',
    branch_name: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [activeFormTab, setActiveFormTab] = useState<'Individual' | 'Comp. client' | 'Government'>('Individual');

  // View Quotation Modal State
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedQuotation, setEditedQuotation] = useState<Quotation | null>(null);

  // Add Quotation Modal State
  const [showAddQuotationForm, setShowAddQuotationForm] = useState(false);
  const [newQuotation, setNewQuotation] = useState({
    quote_number: '',
    customer_name: '',
    quote_date: '',
    valid_until: '',
    grand_total: '',
    status: 'draft',
    description: '',
    plate_no: '',
    model: '',
  });
  const [submittingQuotation, setSubmittingQuotation] = useState(false);

  // View Client Modal State
  const [showClientViewModal, setShowClientViewModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Customer | null>(null);
  const [isEditingClient, setIsEditingClient] = useState(false);
  const [editedClient, setEditedClient] = useState<Customer | null>(null);

  // Booking Form Modal State
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingFormData, setBookingFormData] = useState({
    customer_id: '',
    mobile: '',
    customer_type: 'Individual',
    client_selection: '',
    full_name: '',
    estimated_price: '',
    advance_payment: '',
    work_name: '',
    work_type: '',
    plate_no: '',
    model: '',
    year_made: '',
    color: '',
    vin: '',
    payment_method: '',
    appointment_date: '',
    worker_name: '',
    status: 'pending'
  });
  const [submittingBooking, setSubmittingBooking] = useState(false);

  /* =======================
     Fetch Customers
  ======================= */
  const fetchCustomers = async () => {
    try {
      const result: unknown = await httpService.get('/customers');
      console.log('API /customers response:', result);
      // Type guard for paginated API response
      function isCustomerApiResponse(obj: unknown): obj is {
        success: boolean;
        data: { data: unknown[] };
      } {
        if (typeof obj !== 'object' || obj === null) return false;
        if (!('success' in obj) || typeof (obj as { success: unknown }).success !== 'boolean') return false;
        if (!('data' in obj) || typeof (obj as { data: unknown }).data !== 'object' || (obj as { data: unknown }).data === null) return false;
        const dataObj = (obj as { data: unknown }).data;
        if (typeof dataObj !== 'object' || dataObj === null) return false;
        const dataObjTyped = dataObj as Record<string, unknown>;
        if (!('data' in dataObjTyped) || !Array.isArray((dataObjTyped.data))) return false;
        return true;
      }
      if (isCustomerApiResponse(result)) {
        // Map backend fields to table fields, with type guards for nested objects
        const mapped = (result.data.data as unknown[]).map((cRaw): Customer => {
          const c = cRaw as Record<string, unknown>;
          // legal
          const legal = typeof c.legal === 'object' && c.legal !== null ? c.legal as Record<string, unknown> : {};
          // extra
          const extra = typeof c.extra === 'object' && c.extra !== null ? c.extra as Record<string, unknown> : {};
          // primary_contact
          const primaryContact = typeof c.primary_contact === 'object' && c.primary_contact !== null ? c.primary_contact as Record<string, unknown> : {};
          // accountId: number (always a number)
          let accountId = 0;
          if (typeof legal.CR_number === 'number') {
            accountId = legal.CR_number;
          } else if (typeof legal.CR_number === 'string') {
            const parsed = parseInt(legal.CR_number, 10);
            accountId = isNaN(parsed) ? 0 : parsed;
          }
          // customerType: 'Individual' | 'Comp. client' | 'Government' (never 'N/A')
          let customerType: 'Individual' | 'Comp. client' | 'Government' = 'Individual';
          if (c.customer_type === 'company_client') customerType = 'Comp. client';
          else if (c.customer_type === 'government') customerType = 'Government';
          else if (c.customer_type === 'individual') customerType = 'Individual';
          // number fields: fallback to 0 if not a number
          const quotations = typeof extra.quotations === 'number' ? extra.quotations : 0;
          const loyaltyPoints = typeof extra.loyalty_points === 'number' ? extra.loyalty_points : 0;
          const calendarEvents = typeof extra.calendar_events === 'number' ? extra.calendar_events : 0;
          const maintContracts = typeof extra.maint_contracts === 'number' ? extra.maint_contracts : 0;
          return {
            id: typeof c.id === 'string' ? c.id : (typeof c.id === 'number' ? c.id.toString() : 'N/A'),
            accountId,
            customerType,
            clientSource: typeof c.account_manager === 'string' ? c.account_manager : 'N/A',
            mobile: typeof primaryContact.contact_value === 'string' ? primaryContact.contact_value : 'N/A',
            customerName: typeof c.first_name === 'string' && typeof c.last_name === 'string' ? `${c.first_name} ${c.last_name}` : (typeof c.first_name === 'string' ? c.first_name : (typeof c.last_name === 'string' ? c.last_name : 'N/A')),
            companyName: typeof legal.legal_rep_name === 'string' ? legal.legal_rep_name : 'N/A',
            quotations,
            loyaltyPoints,
            calendarEvents,
            maintContracts,
            createdAt: typeof c.created_at === 'string' ? c.created_at : 'N/A',
          };
        });
        setCustomers(mapped);
      } else {
        setCustomers([]);
      }
    } catch (err: unknown) {
      console.error('Failed to fetch customers:', err);
      setCustomers([]);
    }
  };

  useEffect(() => {
    if (activeTab === 'Clients') {
      fetchCustomers();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'Clients') {
      fetchCustomers();
    }
    // Update URL on tab change
    if (activeTab) {
      const url = encodeTab(activeTab) ? `/customers/${encodeTab(activeTab)}` : '/customers';
      navigate(url, { replace: true });
    }
  }, [activeTab, navigate]);

  /* =======================
     Add Customer
  ======================= */
  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let customerData: Record<string, unknown> = {
        type: activeFormTab,
        client_source: newCustomer.client_source,
        account_number: newCustomer.account_number,
      };

      if (activeFormTab === 'Individual') {
        customerData = {
          ...customerData,
          id_number: newCustomer.id_number,
          mobile: newCustomer.mobile,
          name: newCustomer.customer_name,
          city: newCustomer.city,
        };
      } else if (activeFormTab === 'Comp. client') {
        customerData = {
          ...customerData,
          mobile: newCustomer.mobile,
          name: newCustomer.customer_name,
          company_name: newCustomer.company_name,
          vat_number: newCustomer.vat_number,
          cr_number: newCustomer.cr_number,
          city: newCustomer.city,
          street_name: newCustomer.street_name,
          building_no: newCustomer.building_no,
          branch_no: newCustomer.branch_no,
          district: newCustomer.district,
          zipcode: newCustomer.zipcode,
          address: newCustomer.address,
        };
      } else if (activeFormTab === 'Government') {
        customerData = {
          ...customerData,
          mobile: newCustomer.mobile,
          name: newCustomer.customer_name,
          city: newCustomer.city,
          entity_name: newCustomer.entity_name,
          branch_name: newCustomer.branch_name,
        };
      }

      const result: ApiResponse<unknown> = await httpService.post('/customers', customerData);
      if (result?.success) {
        alert('Customer added successfully!');
        setShowAddForm(false);
        setActiveFormTab('Individual'); // Reset to default tab
        setNewCustomer({
          account_number: '',
          type: 'Individual',
          client_source: '',
          mobile: '',
          customer_name: '',
          company_name: '',
          quotations: '',
          current_balance: '',
          calendar_events: '',
          maint_contracts: '',
          id_number: '',
          city: '',
          vat_number: '',
          cr_number: '',
          street_name: '',
          building_no: '',
          branch_no: '',
          district: '',
          zipcode: '',
          address: '',
          entity_name: '',
          branch_name: '',
        });
        fetchCustomers(); // Refetch customers
      } else {
        alert('Failed to add customer');
      }
    } catch (err: unknown) {
      console.error('Failed to add customer:', err);
      alert('Failed to add customer');
    } finally {
      setSubmitting(false);
    }
  };

  /* =======================
     Add Quotation
  ======================= */
  const handleAddQuotation = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingQuotation(true);
    try {
      const quotationData: Quotation = {
        id: Date.now().toString(),
        quote_number: newQuotation.quote_number,
        customer_id: '',
        customer: { name: newQuotation.customer_name },
        quote_date: newQuotation.quote_date,
        grand_total: parseFloat(newQuotation.grand_total) || 0,
        status: newQuotation.status,
        description: newQuotation.description,
        plate_no: newQuotation.plate_no,
        model: newQuotation.model,
        created_at: new Date().toISOString(),
        valid_until: newQuotation.valid_until,
        customer_name: newQuotation.customer_name,
        quotation_date: newQuotation.quote_date,
        total_amount: parseFloat(newQuotation.grand_total) || 0,
      };
      
      // Add to static data
      setQuotationsData(prev => [...prev, quotationData]);
      
      alert('Quotation added successfully!');
      setShowAddQuotationForm(false);
      setNewQuotation({
        quote_number: '',
        customer_name: '',
        quote_date: '',
        valid_until: '',
        grand_total: '',
        status: 'draft',
        description: '',
        plate_no: '',
        model: '',
      });
    } catch (err: unknown) {
      console.error('Failed to add quotation:', err);
      alert('Failed to add quotation');
    } finally {
      setSubmittingQuotation(false);
    }
  };



  /* =======================
     Filter
  ======================= */
  // DEBUG: Show all customers regardless of search filters
  console.log('Customers to render in table:', customers);
  const filteredData = Array.isArray(customers) ? customers : [];
  const paginatedData = Array.isArray(filteredData)
    ? filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : [];

  const loyaltyFilteredData = useMemo(() => [...loyaltyData].sort((a, b) => b.loyaltyPoints - a.loyaltyPoints), [loyaltyData]);
  const loyaltyTotalPages = Math.ceil(loyaltyFilteredData.length / itemsPerPage);
  const loyaltyPaginatedData = loyaltyFilteredData.slice(
    (loyaltyPage - 1) * itemsPerPage,
    loyaltyPage * itemsPerPage
  );

  const quotationsFilteredData = useMemo(() => [...quotationsData]
    .filter(q =>
      (searchMobile === '' || q.customer?.mobile?.includes(searchMobile)) &&
      (searchModel === '' || q.model?.includes(searchModel)) &&
      (searchQuotNo === '' || q.quote_number.includes(searchQuotNo))
    )
    .sort((a, b) => a.quote_number.localeCompare(b.quote_number)), [quotationsData, searchMobile, searchModel, searchQuotNo]);

  const bookingFilteredData = useMemo(() => [...bookingData].sort((a, b) => b.calendarEvents - a.calendarEvents), [bookingData]);
  // const bookingTotalPages = Math.ceil(bookingFilteredData.length / itemsPerPage);
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
  const fetchLoyaltyData = useCallback(async () => {
    try {
      const start = `${loyaltyStartDate.year}-${loyaltyStartDate.month.padStart(2, '0')}-${loyaltyStartDate.day.padStart(2, '0')}`;
      const end = `${loyaltyEndDate.year}-${loyaltyEndDate.month.padStart(2, '0')}-${loyaltyEndDate.day.padStart(2, '0')}`;
      const result: ApiResponse<Customer[]> = await httpService.get(`/customers/loyalty?start_date=${start}&end_date=${end}`);

      if (result?.success && Array.isArray(result.data)) {
        setLoyaltyData(result.data);
      } else {
        setLoyaltyData([]);
      }
    } catch {
      // Ignored
    }
  }, [loyaltyStartDate, loyaltyEndDate]);

  /* =======================
     Fetch Quotations Data
  ======================= */
  const fetchQuotationsData = useCallback(async () => {
  try {
    // Fetch all quotations from the backend
    const result: ApiResponse<{data: Quotation[]}> = await httpService.get('/quotations');

    if (result?.success && result.data && Array.isArray(result.data.data)) {
      setQuotationsData(result.data.data);
    } else {
      setQuotationsData([]);
    }
  } catch (err: unknown) {
    console.error('Error fetching quotations:', err);
    setQuotationsData([]);
  }
}, []);


  /* =======================
     Fetch Booking Data
  ======================= */
  const fetchBookingData = useCallback(async () => {
    try {
      const result: ApiResponse<BookingResponse> = await httpService.get(`/bookings`);

      if (result?.success && result.data?.appointments && Array.isArray(result.data.appointments)) {
        // Transform the booking data to match the expected Customer interface
        const transformedData = result.data.appointments.map((appointment: BookingAppointment): Customer => ({
          id: appointment.id?.toString() || 'N/A',
          accountId: appointment.customer_id || 0,
          customerType: 'Individual' as Customer['customerType'], // Cast to proper type
          clientSource: 'Direct', // Default value
          mobile: appointment.customer_phone || 'N/A',
          customerName: appointment.customer_name || 'N/A',
          companyName: '',
          quotations: 0,
          loyaltyPoints: 0,
          calendarEvents: 1,
          maintContracts: 0,
          createdAt: appointment.created_at || 'N/A',
          appointment_date: appointment.appointment_date || 'N/A',
          start_time: appointment.start_time || 'N/A',
          end_time: appointment.end_time || 'N/A',
          status: appointment.status || 'pending',
          service_type: appointment.service_type || 'N/A',
          description: appointment.description || 'N/A',
          plate_no: appointment.car?.plate_number || appointment.car?.plate_no || 'N/A',
          model: appointment.car?.car_model || appointment.car?.model || 'N/A',
          // Add the new fields from backend
          employee_name: appointment.created_by_name || 'N/A',
          advance_payment: 'N/A', // Will be populated if payment data exists
          updated_by: appointment.updated_by_name || 'Admin',
        }));
        setBookingData(transformedData);
      } else {
        setBookingData([]);
      }
    } catch (error) {
      console.error('Error fetching booking data:', error);
      setBookingData([]);
    }
  }, []);

  /* =======================
     Fetch Maint Contract Data
  ======================= */
  const fetchMaintContractData = useCallback(async () => {
    try {
      const start = `${maintContractStartDate.year}-${maintContractStartDate.month.padStart(2, '0')}-${maintContractStartDate.day.padStart(2, '0')}`;
      const end = `${maintContractEndDate.year}-${maintContractEndDate.month.padStart(2, '0')}-${maintContractEndDate.day.padStart(2, '0')}`;
      const result: ApiResponse<Customer[]> = await httpService.get(`/customers/maint-contract?start_date=${start}&end_date=${end}`);

      if (result?.success && Array.isArray(result.data)) {
        setMaintContractData(result.data);
      } else {
        setMaintContractData([]);
      }
    } catch {
      setMaintContractData([]);
    }
  }, [maintContractStartDate, maintContractEndDate]);

  /* =======================
     Fetch Check Car Data
  ======================= */
  const fetchCheckCarData = useCallback(async () => {
    try {
      const start = `${checkCarStartDate.year}-${checkCarStartDate.month.padStart(2, '0')}-${checkCarStartDate.day.padStart(2, '0')}`;
      const end = `${checkCarEndDate.year}-${checkCarEndDate.month.padStart(2, '0')}-${checkCarEndDate.day.padStart(2, '0')}`;
      const result: ApiResponse<Customer[]> = await httpService.get(`/customers/check-car?start_date=${start}&end_date=${end}`);

      if (result?.success && Array.isArray(result.data)) {
        setCheckCarData(result.data);
      } else {
        setCheckCarData([]);
      }
    } catch {
      setCheckCarData([]);
    }
  }, [checkCarStartDate, checkCarEndDate]);

  useEffect(() => {
    console.log('useEffect triggered for activeTab:', activeTab);
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
  }, [activeTab, fetchLoyaltyData, fetchQuotationsData, fetchBookingData, fetchMaintContractData, fetchCheckCarData]);

  useEffect(() => {
    console.log('quotationsData updated:', quotationsData);
  }, [quotationsData]);

  useEffect(() => {
    if (activeTab === 'Clients') setCurrentPage(1);
    else if (activeTab === 'Loyalty Program') setLoyaltyPage(1);
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

        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-2 rounded-lg shadow-md transition-all duration-200 w-24 h-9">
          Search
        </button>

        {/* spacer */}
        <div className="ml-auto flex gap-2">
          <button className="bg-blue-600 text-white px-2 py-1 rounded-lg h-9 w-32" onClick={() => alert('Exporting Clients to Excel')}>
            استيراد اكسل
          </button>

          <button className="bg-blue-600 text-white px-2 py-1 rounded-lg h-9 w-32" onClick={() => setShowAddForm(true)}>
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
            {Array.isArray(paginatedData) && paginatedData.length === 0 ? (
              <tr>
                <td colSpan={13} className="text-center text-gray-400 py-4">No customers found. (Check API response and mapping.)</td>
              </tr>
            ) : (
              (Array.isArray(paginatedData) ? paginatedData : []).map((c, idx) => (
                <tr key={c.id ? String(c.id) : idx} className="hover:bg-gray-50">
                  <td className="border py-2">{c.id ?? 'N/A'}</td>
                  <td className="border">{c.accountId ?? 'N/A'}</td>
                  <td className={`border ${c.customerType ? customerTypeCellColors[c.customerType] : ''}`}>
                    {c.customerType ? <CustomerTypeBadge type={c.customerType} /> : 'N/A'}
                  </td>
                  <td className="border">{c.clientSource ?? 'N/A'}</td>
                  <td className="border">{c.mobile ?? 'N/A'}</td>
                  <td className="border">{c.customerName ?? 'N/A'}</td>
                  <td className="border">{c.companyName ?? 'N/A'}</td>
                  <td className="border">{c.quotations ?? 'N/A'}</td>
                  <td className="border">{typeof c.loyaltyPoints === 'number' ? c.loyaltyPoints.toLocaleString() : 'N/A'}</td>
                  <td className="border">{c.calendarEvents ?? 'N/A'}</td>
                  <td className="border">{c.maintContracts ?? 'N/A'}</td>
                  <td className="border p-0 bg-blue-600 hover:bg-blue-700">
                    <button
                      className="w-full h-full text-white font-semibold py-1 px-2 bg-transparent"
                      style={{ minHeight: '36px' }}
                      onClick={() => {
                        setSelectedClient(c);
                        setEditedClient({ ...c });
                        setIsEditingClient(false);
                        setShowClientViewModal(true);
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
     Add Customer Modal
  ======================= */
 const addCustomerModal = showAddForm && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
    <div className="bg-white w-full max-w-6xl max-h-[95vh] overflow-y-auto rounded-2xl shadow-2xl">

      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between px-8 py-6 border-b bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-2xl">
        <div>
          <h2 className="text-2xl font-semibold">Add New Customer</h2>
          <p className="text-sm text-blue-100 mt-1">
            Choose customer type and complete required information
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(false)}
          className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition flex items-center justify-center text-lg"
        >
          ✕
        </button>
      </div>

      {/* ================= FORM ================= */}
      <form onSubmit={handleAddCustomer} className="p-8 space-y-10">

        {/* ================= TABS ================= */}
        <div className="flex gap-2 bg-gray-100 p-1 rounded-xl w-fit">
          {(['Individual', 'Comp. client', 'Government'] as const).map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveFormTab(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition
                ${
                  activeFormTab === tab
                    ? 'bg-white text-blue-600 shadow'
                    : 'text-gray-500 hover:text-gray-800'
                }
              `}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ================= FORMS (NO UNMOUNTING) ================= */}
        <div className="space-y-10">

          {/* ===== INDIVIDUAL ===== */}
          <div style={{ display: activeFormTab === 'Individual' ? 'block' : 'none' }}>
            <Section title="Individual Customer">
              <Grid>
                <Input label="ID Number *" value={newCustomer.id_number}
                  onChange={v => setNewCustomer(p => ({ ...p, id_number: v }))} />

                <Input label="Mobile *" value={newCustomer.mobile}
                  onChange={v => setNewCustomer(p => ({ ...p, mobile: v }))} />

                <Input label="Customer Name *" value={newCustomer.customer_name}
                  onChange={v => setNewCustomer(p => ({ ...p, customer_name: v }))} />

                <Input label="City *" value={newCustomer.city}
                  onChange={v => setNewCustomer(p => ({ ...p, city: v }))} />
              </Grid>
            </Section>
          </div>

          {/* ===== COMPANY ===== */}
          <div style={{ display: activeFormTab === 'Comp. client' ? 'block' : 'none' }}>
            <Section title="Company Client">
              <Grid>
                <Input label="Mobile *" value={newCustomer.mobile}
                  onChange={v => setNewCustomer(p => ({ ...p, mobile: v }))} />

                <Input label="Customer Name *" value={newCustomer.customer_name}
                  onChange={v => setNewCustomer(p => ({ ...p, customer_name: v }))} />

                <Input label="Company Name *" value={newCustomer.company_name}
                  onChange={v => setNewCustomer(p => ({ ...p, company_name: v }))} />

                <Input label="VAT Number" value={newCustomer.vat_number}
                  onChange={v => setNewCustomer(p => ({ ...p, vat_number: v }))} />

                <Input label="CR Number" value={newCustomer.cr_number}
                  onChange={v => setNewCustomer(p => ({ ...p, cr_number: v }))} />

                <Input label="City *" value={newCustomer.city}
                  onChange={v => setNewCustomer(p => ({ ...p, city: v }))} />

                <Input label="Street Name" value={newCustomer.street_name}
                  onChange={v => setNewCustomer(p => ({ ...p, street_name: v }))} />

                <Input label="Building No." value={newCustomer.building_no}
                  onChange={v => setNewCustomer(p => ({ ...p, building_no: v }))} />

                <Input label="Branch No." value={newCustomer.branch_no}
                  onChange={v => setNewCustomer(p => ({ ...p, branch_no: v }))} />

                <Input label="District" value={newCustomer.district}
                  onChange={v => setNewCustomer(p => ({ ...p, district: v }))} />

                <Input label="Zipcode" value={newCustomer.zipcode}
                  onChange={v => setNewCustomer(p => ({ ...p, zipcode: v }))} />

                <Textarea label="Address" value={newCustomer.address}
                  onChange={v => setNewCustomer(p => ({ ...p, address: v }))} />
              </Grid>
            </Section>
          </div>

          {/* ===== GOVERNMENT ===== */}
          <div style={{ display: activeFormTab === 'Government' ? 'block' : 'none' }}>
            <Section title="Government Entity">
              <Grid>
                <Input label="Mobile *" value={newCustomer.mobile}
                  onChange={v => setNewCustomer(p => ({ ...p, mobile: v }))} />

                <Input label="Customer Name *" value={newCustomer.customer_name}
                  onChange={v => setNewCustomer(p => ({ ...p, customer_name: v }))} />

                <Input label="City *" value={newCustomer.city}
                  onChange={v => setNewCustomer(p => ({ ...p, city: v }))} />

                <Input label="Entity Name *" value={newCustomer.entity_name}
                  onChange={v => setNewCustomer(p => ({ ...p, entity_name: v }))} />

                <Input label="Branch Name *" value={newCustomer.branch_name}
                  onChange={v => setNewCustomer(p => ({ ...p, branch_name: v }))} />
              </Grid>
            </Section>
          </div>

        </div>

        {/* ================= FOOTER ================= */}
        <div className="flex justify-end gap-4 pt-6 border-t">
          <button
            type="button"
            onClick={() => setShowAddForm(false)}
            className="px-6 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium shadow disabled:opacity-50"
          >
            {submitting ? 'Adding...' : 'Add Customer'}
          </button>
        </div>

      </form>
    </div>
  </div>
);



  /* =======================
     Add Quotation Modal
  ======================= */
  const addQuotationModal = showAddQuotationForm && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-4xl max-h-[95vh] overflow-y-auto rounded-2xl shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-semibold">Add New Quotation</h2>
            <p className="text-sm text-blue-100 mt-1">
              Fill in the quotation details
            </p>
          </div>

          <button
            onClick={() => setShowAddQuotationForm(false)}
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleAddQuotation} className="p-8 space-y-6">

          <div className="grid grid-cols-2 gap-6">
            <Input label="Quote Number *" required value={newQuotation.quote_number}
              onChange={v => setNewQuotation(p => ({ ...p, quote_number: v }))} />

            <Input label="Customer Name *" required value={newQuotation.customer_name}
              onChange={v => setNewQuotation(p => ({ ...p, customer_name: v }))} />

            <Input label="Quote Date *" required type="date" value={newQuotation.quote_date}
              onChange={v => setNewQuotation(p => ({ ...p, quote_date: v }))} />

            <Input label="Valid Until *" required type="date" value={newQuotation.valid_until}
              onChange={v => setNewQuotation(p => ({ ...p, valid_until: v }))} />

            <Input label="Grand Total *" required type="number" value={newQuotation.grand_total}
              onChange={v => setNewQuotation(p => ({ ...p, grand_total: v }))} />

            <Input label="Status" value={newQuotation.status}
              onChange={v => setNewQuotation(p => ({ ...p, status: v }))} />

            <Input label="Plate No." value={newQuotation.plate_no}
              onChange={v => setNewQuotation(p => ({ ...p, plate_no: v }))} />

            <Input label="Model" value={newQuotation.model}
              onChange={v => setNewQuotation(p => ({ ...p, model: v }))} />
          </div>

          <Textarea label="Description" value={newQuotation.description}
            onChange={v => setNewQuotation(p => ({ ...p, description: v }))} />

          {/* Footer */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => setShowAddQuotationForm(false)}
              className="px-6 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submittingQuotation}
              className="px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium shadow disabled:opacity-50"
            >
              {submittingQuotation ? 'Adding...' : 'Add Quotation'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );


  /* =======================
     View Quotation Modal
  ======================= */
  const viewQuotationModal = showViewModal && selectedQuotation && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-6xl max-h-[95vh] overflow-y-auto rounded-2xl shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-semibold">Quotation Details</h2>
            <p className="text-sm text-blue-100 mt-1">
              {isEditing ? 'Edit quotation information' : 'View and manage quotation'}
            </p>
          </div>

          <button
            onClick={() => setShowViewModal(false)}
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        <div className="p-8 space-y-8">

          {/* Buttons */}
          <div className="flex gap-4">
            {/* <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-6 py-3 rounded-lg bg-yellow-600 hover:bg-yellow-700 text-white font-medium"
            >
              {isEditing ? 'Cancel Edit' : 'Edit'}
            </button>

            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this quotation?')) {
                  setQuotationsData(prev => prev.filter(q => q.id !== selectedQuotation.id));
                  setShowViewModal(false);
                }
              }}
              className="px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium"
            >
              Delete
            </button> */}

            <button
              onClick={() => {
                const printWindow = window.open('', '_blank');
                if (printWindow) {
                  printWindow.document.write(`
                    <html>
                      <head>
                        <title>Quotation ${selectedQuotation.quote_number}</title>
                        <style>
                          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #fff; color: #333; }
                          .container { max-width: 800px; margin: 0 auto; }
                          .header { border-bottom: 2px solid #007bff; padding-bottom: 20px; margin-bottom: 30px; }
                          .header h1 { margin: 0; color: #007bff; font-size: 28px; }
                          .header p { margin: 5px 0; color: #666; }
                          .section { margin-bottom: 30px; }
                          .section h2 { color: #007bff; font-size: 18px; margin-bottom: 10px; text-transform: uppercase; border-bottom: 1px solid #eee; padding-bottom: 5px; }
                          .grid { display: flex; justify-content: space-between; }
                          .grid div { flex: 1; }
                          .grid div:first-child { margin-right: 20px; }
                          .status { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
                          .status.approved { background: #d4edda; color: #155724; }
                          .status.pending { background: #fff3cd; color: #856404; }
                          .description { background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 5px; padding: 15px; line-height: 1.6; }
                          .total { text-align: right; border-top: 2px solid #007bff; padding-top: 20px; }
                          .total p { margin: 5px 0; }
                          .total .amount { font-size: 24px; font-weight: bold; color: #007bff; }
                          .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #eee; padding-top: 20px; }
                          @media print { body { padding: 0; } .container { max-width: none; } }
                        </style>
                      </head>
                      <body>
                        <div class="container">
                          <!-- Company Header -->
                          <div class="header">
                            <h1>ECAR Auto Services</h1>
                            <p>Professional Car Maintenance & Repair</p>
                            <p>Phone: +971 50 123 4567 | Email: info@ecar.ae | Website: www.ecar.ae</p>
                            <p>Address: Dubai, UAE</p>
                          </div>

                          <!-- Quotation Header -->
                          <div class="section">
                            <h1 style="font-size: 24px; margin: 0;">Quotation #${selectedQuotation.quote_number}</h1>
                            <p><strong>Date:</strong> ${selectedQuotation.quote_date}</p>
                            <p><strong>Valid Until:</strong> ${selectedQuotation.valid_until}</p>
                          </div>

                          <!-- Customer Information -->
                          <div class="section">
                            <h2>Customer Information</h2>
                            <div class="grid">
                              <div>
                                <p><strong>Name:</strong> ${selectedQuotation.customer?.name || selectedQuotation.customer_name}</p>
                                <p><strong>Plate No:</strong> ${selectedQuotation.plate_no}</p>
                                <p><strong>Model:</strong> ${selectedQuotation.model}</p>
                              </div>
                              <div style="text-align: right;">
                                <p><strong>Status:</strong> <span class="status ${selectedQuotation.status === 'accepted' ? 'approved' : 'pending'}">${selectedQuotation.status}</span></p>
                              </div>
                            </div>
                          </div>

                          <!-- Description -->
                          <div class="section">
                            <h2>Service Description</h2>
                            <div class="description">
                              ${selectedQuotation.description}
                            </div>
                          </div>

                          <!-- Total Amount -->
                          <div class="total">
                            <p><strong>Total Amount (Excl. VAT):</strong> AED ${selectedQuotation.grand_total || selectedQuotation.total_amount}</p>
                            <p><strong>VAT (5%):</strong> AED ${((selectedQuotation.grand_total || selectedQuotation.total_amount || 0) * 0.05).toFixed(2)}</p>
                            <p class="amount"><strong>Total Amount (Incl. VAT):</strong> AED ${((selectedQuotation.grand_total || selectedQuotation.total_amount || 0) * 1.05).toFixed(2)}</p>
                          </div>

                          <!-- Footer -->
                          <div class="footer">
                            <p>Thank you for choosing ECAR Auto Services. This quotation is valid for 30 days from the date issued.</p>
                            <p>For any inquiries, please contact us at +971 50 123 4567 or info@ecar.ae</p>
                          </div>
                        </div>
                      </body>
                    </html>
                  `);
                  printWindow.document.close();
                  printWindow.print();
                }
              }}
              className="px-6 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium"
            >
              Print
            </button>
          </div>

          {/* Details or Edit Form */}
          {isEditing ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <Input label="Quote Number" value={editedQuotation?.quote_number || ''} onChange={v => setEditedQuotation(prev => prev ? { ...prev, quote_number: v } : null)} />
                <Input label="Customer Name" value={editedQuotation?.customer?.name || editedQuotation?.customer_name || ''} onChange={v => setEditedQuotation(prev => prev ? { ...prev, customer_name: v, customer: { ...prev.customer, name: v } } : null)} />
                <Input label="Quote Date" type="date" value={editedQuotation?.quote_date || editedQuotation?.quotation_date || ''} onChange={v => setEditedQuotation(prev => prev ? { ...prev, quote_date: v, quotation_date: v } : null)} />
                <Input label="Valid Until" type="date" value={editedQuotation?.valid_until || ''} onChange={v => setEditedQuotation(prev => prev ? { ...prev, valid_until: v } : null)} />
                <Input label="Grand Total" type="number" value={editedQuotation?.grand_total?.toString() || editedQuotation?.total_amount?.toString() || ''} onChange={v => setEditedQuotation(prev => prev ? { ...prev, grand_total: parseFloat(v) || 0, total_amount: parseFloat(v) || 0 } : null)} />
                <Input label="Status" value={editedQuotation?.status || ''} onChange={v => setEditedQuotation(prev => prev ? { ...prev, status: v } : null)} />
                <Input label="Plate No" value={editedQuotation?.plate_no || ''} onChange={v => setEditedQuotation(prev => prev ? { ...prev, plate_no: v } : null)} />
                <Input label="Model" value={editedQuotation?.model || ''} onChange={v => setEditedQuotation(prev => prev ? { ...prev, model: v } : null)} />
              </div>
              <Textarea label="Description" value={editedQuotation?.description || ''} onChange={v => setEditedQuotation(prev => prev ? { ...prev, description: v } : null)} />
              <button
                onClick={() => {
                  if (editedQuotation) {
                    setQuotationsData(prev => prev.map(q => q.id === editedQuotation.id ? editedQuotation : q));
                    setSelectedQuotation(editedQuotation);
                    setIsEditing(false);
                  }
                }}
                className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                Save Changes
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6">
              <div><strong>Quote Number:</strong> {selectedQuotation.quote_number}</div>
              <div><strong>Customer Name:</strong> {selectedQuotation.customer?.name || selectedQuotation.customer_name}</div>
              <div><strong>Quote Date:</strong> {selectedQuotation.quote_date || selectedQuotation.quotation_date}</div>
              <div><strong>Valid Until:</strong> {selectedQuotation.valid_until}</div>
              <div><strong>Grand Total:</strong> ${selectedQuotation.grand_total || selectedQuotation.total_amount}</div>
              <div><strong>Status:</strong> {selectedQuotation.status}</div>
              <div><strong>Plate No:</strong> {selectedQuotation.plate_no}</div>
              <div><strong>Model:</strong> {selectedQuotation.model}</div>
              <div className="col-span-2"><strong>Description:</strong> {selectedQuotation.description}</div>
            </div>
          )}

          {/* List of Quotations */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">All Quotations</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-center border">
                <thead className="bg-gray-300">
                  <tr>
                    {['Quot No.', 'Customer Type', 'Quotation Date', 'Mobile', 'Customer Name', 'Plate No.', 'Model', 'Total VAT', 'Total inc. VAT', 'Added by', 'Status', 'Action'].map(h => (
                      <th key={h} className={`border px-3 py-2 text-xs font-bold ${h === 'Action' ? 'text-white bg-blue-600' : ''}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {quotationsData.map(q => (
                    <tr key={q.id} className={`hover:bg-gray-50 ${q.id === selectedQuotation?.id ? 'bg-blue-50' : ''}`}>
                      <td className="border py-2">{q.quote_number}</td>
                      <td className="border">{q.customer_type || 'N/A'}</td>
                      <td className="border">{q.quote_date || q.quotation_date}</td>
                      <td className="border">{q.customer?.mobile || q.mobile || 'N/A'}</td>
                      <td className="border">{q.customer?.name || q.customer_name}</td>
                      <td className="border">{q.plate_no}</td>
                      <td className="border">{q.model}</td>
                      <td className="border">{q.vat ? `${q.vat} AED` : ((q.grand_total || q.total_amount || 0) * 0.05).toFixed(2) + ' AED'}</td>
                      <td className="border">{q.total_inc_vat ? `${q.total_inc_vat} AED` : ((q.grand_total || q.total_amount || 0) * 1.05).toFixed(2) + ' AED'}</td>
                      <td className="border">{q.added_by || 'N/A'}</td>
                      <td className="border">{q.status}</td>
                      <td className="border p-0">
                        <button className="w-full h-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-2 rounded-none shadow-md transition-all duration-200" style={{minHeight:'36px'}} onClick={() => {
                          setSelectedQuotation(q);
                          setShowViewModal(true);
                        }}>View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    </div>
  );


  /* =======================
     View Client Modal
  ======================= */
  const viewClientModal = showClientViewModal && selectedClient && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-6xl max-h-[95vh] overflow-y-auto rounded-2xl shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-semibold">Client Details</h2>
            <p className="text-sm text-blue-100 mt-1">
              {isEditingClient ? 'Edit client information' : 'View and manage client'}
            </p>
          </div>

          <button
            onClick={() => setShowClientViewModal(false)}
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        <div className="p-8 space-y-8">

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => setIsEditingClient(!isEditingClient)}
              className="px-6 py-3 rounded-lg bg-yellow-600 hover:bg-yellow-700 text-white font-medium"
            >
              {isEditingClient ? 'Cancel Edit' : 'Edit'}
            </button>

            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this client?')) {
                  setCustomers(prev => prev.filter(c => c.id !== selectedClient.id));
                  setShowClientViewModal(false);
                }
              }}
              className="px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium"
            >
              Delete
            </button>

            <button
              onClick={() => {
                const printWindow = window.open('', '_blank');
                if (printWindow) {
                  printWindow.document.write(`
                    <html>
                      <head><title>Client ${selectedClient.customerName}</title></head>
                      <body>
                        <h1>Client ${selectedClient.customerName}</h1>
                        <p>ID: ${selectedClient.id}</p>
                        <p>Account Number: ${selectedClient.accountId}</p>
                        <p>Type: ${selectedClient.customerType}</p>
                        <p>Mobile: ${selectedClient.mobile}</p>
                        <p>Company Name: ${selectedClient.companyName}</p>
                        <p>Quotations: ${selectedClient.quotations}</p>
                        <p>Loyalty Points: ${selectedClient.loyaltyPoints}</p>
                        <p>Calendar Events: ${selectedClient.calendarEvents}</p>
                        <p>Maint Contracts: ${selectedClient.maintContracts}</p>
                      </body>
                    </html>
                  `);
                  printWindow.document.close();
                  printWindow.print();
                }
              }}
              className="px-6 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium"
            >
              Print
            </button>
          </div>

          {/* Details or Edit Form */}
          {isEditingClient ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <Input label="Account Number" value={editedClient?.accountId?.toString() || ''} onChange={v => setEditedClient(prev => prev ? { ...prev, accountId: parseInt(v) || 0 } : null)} />
                <Input label="Customer Type" value={editedClient?.customerType || ''} onChange={v => setEditedClient(prev => prev ? { ...prev, customerType: v as Customer['customerType'] } : null)} />
                <Input label="Client Source" value={editedClient?.clientSource || ''} onChange={v => setEditedClient(prev => prev ? { ...prev, clientSource: v } : null)} />
                <Input label="Mobile" value={editedClient?.mobile || ''} onChange={v => setEditedClient(prev => prev ? { ...prev, mobile: v } : null)} />
                <Input label="Customer Name" value={editedClient?.customerName || ''} onChange={v => setEditedClient(prev => prev ? { ...prev, customerName: v } : null)} />
                <Input label="Company Name" value={editedClient?.companyName || ''} onChange={v => setEditedClient(prev => prev ? { ...prev, companyName: v } : null)} />
                <Input label="Quotations" type="number" value={editedClient?.quotations?.toString() || ''} onChange={v => setEditedClient(prev => prev ? { ...prev, quotations: parseInt(v) || 0 } : null)} />
                <Input label="Loyalty Points" type="number" value={editedClient?.loyaltyPoints?.toString() || ''} onChange={v => setEditedClient(prev => prev ? { ...prev, loyaltyPoints: parseInt(v) || 0 } : null)} />
                <Input label="Calendar Events" type="number" value={editedClient?.calendarEvents?.toString() || ''} onChange={v => setEditedClient(prev => prev ? { ...prev, calendarEvents: parseInt(v) || 0 } : null)} />
                <Input label="Maint Contracts" type="number" value={editedClient?.maintContracts?.toString() || ''} onChange={v => setEditedClient(prev => prev ? { ...prev, maintContracts: parseInt(v) || 0 } : null)} />
              </div>
              <button
                onClick={() => {
                  if (editedClient) {
                    setCustomers(prev => prev.map(c => c.id === editedClient.id ? editedClient : c));
                    setSelectedClient(editedClient);
                    setIsEditingClient(false);
                  }
                }}
                className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                Save Changes
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6">
              <div><strong>ID:</strong> {selectedClient.id}</div>
              <div><strong>Account Number:</strong> {selectedClient.accountId}</div>
              <div><strong>Customer Type:</strong> {selectedClient.customerType}</div>
              <div><strong>Client Source:</strong> {selectedClient.clientSource}</div>
              <div><strong>Mobile:</strong> {selectedClient.mobile}</div>
              <div><strong>Customer Name:</strong> {selectedClient.customerName}</div>
              <div><strong>Company Name:</strong> {selectedClient.companyName}</div>
              <div><strong>Quotations:</strong> {selectedClient.quotations}</div>
              <div><strong>Loyalty Points:</strong> {selectedClient.loyaltyPoints}</div>
              <div><strong>Calendar Events:</strong> {selectedClient.calendarEvents}</div>
              <div><strong>Maint Contracts:</strong> {selectedClient.maintContracts}</div>
            </div>
          )}

          {/* List of Clients */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">All Clients</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-center border">
                <thead className="bg-gray-300">
                  <tr>
                    {['ID', 'Customer Name', 'Mobile', 'Type', 'Points'].map(h => (
                      <th key={h} className="border px-3 py-2 text-xs font-bold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c, index) => (
                    <tr key={index} className={`hover:bg-gray-50 ${c.id === selectedClient.id ? 'bg-blue-50' : ''}`}>
                      <td className="border py-2">{c.id}</td>
                      <td className="border">{c.customerName}</td>
                      <td className="border">{c.mobile}</td>
                      <td className="border">{c.customerType}</td>
                      <td className="border">{c.loyaltyPoints}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    </div>
  );


  /* =======================
     Handle Create Booking
  ======================= */
  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingBooking(true);

    try {
      // Convert form data to backend format (only fields currently supported by backend)
      const bookingData = {
        tenant_id: 1, // Default tenant ID
        customer_id: parseInt(bookingFormData.customer_id) || 1, // Default to 1 if not provided
        plate_no: bookingFormData.plate_no,
        appointment_date: bookingFormData.appointment_date,
        start_time: '09:00', // Default start time
        end_time: '17:00', // Default end time
        status: bookingFormData.status,
        service_type: bookingFormData.work_type,
        description: bookingFormData.work_name
        // Note: Additional fields like estimated_price, advance_payment, payment_method, worker_name
        // are not currently supported by the backend and would need database schema changes
      };

      const result: ApiResponse<unknown> = await httpService.post('/appointments', bookingData);

      if (result.success) {
        alert('Booking created successfully!');
        setShowBookingForm(false);
        // Reset form
        setBookingFormData({
          customer_id: '',
          mobile: '',
          customer_type: 'Individual',
          client_selection: '',
          full_name: '',
          estimated_price: '',
          advance_payment: '',
          work_name: '',
          work_type: '',
          plate_no: '',
          model: '',
          year_made: '',
          color: '',
          vin: '',
          payment_method: '',
          appointment_date: '',
          worker_name: '',
          status: 'pending'
        });
        // Refresh booking data
        fetchBookingData();
      } else {
        let errorMessage = result.message || 'Unknown error';
        if (result.errors) {
          errorMessage = 'Validation errors: ' + JSON.stringify(result.errors);
        }
        alert('Failed to create booking: ' + errorMessage);
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to create booking. Please try again.');
    } finally {
      setSubmittingBooking(false);
    }
  };
  const bookingFormModal = showBookingForm && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-4xl max-h-[95vh] overflow-y-auto rounded-2xl shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-semibold">Create New Booking</h2>
            <p className="text-sm text-blue-100 mt-1">
              Fill in the booking details below
            </p>
          </div>

          <button
            onClick={() => setShowBookingForm(false)}
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleCreateBooking} className="p-8 space-y-6">

          <div className="grid grid-cols-2 gap-6">
            <Input label="Customer ID" required value={bookingFormData.customer_id}
              onChange={v => setBookingFormData(p => ({ ...p, customer_id: v }))} />

            <Input label="Mobile" value={bookingFormData.mobile}
              onChange={v => setBookingFormData(p => ({ ...p, mobile: v }))} />

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Type</label>
              <select
                value={bookingFormData.customer_type}
                onChange={e => setBookingFormData(p => ({ ...p, customer_type: e.target.value }))}
                className="w-full h-11 rounded-lg border border-gray-300 px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              >
                <option value="Individual">Individual</option>
                <option value="Comp. client">Company Client</option>
                <option value="Government">Government</option>
              </select>
            </div>

            <Input label="Select Client" value={bookingFormData.client_selection}
              onChange={v => setBookingFormData(p => ({ ...p, client_selection: v }))} />

            <Input label="Full Name" required value={bookingFormData.full_name}
              onChange={v => setBookingFormData(p => ({ ...p, full_name: v }))} />

            <Input label="Estimated Price" type="number" value={bookingFormData.estimated_price}
              onChange={v => setBookingFormData(p => ({ ...p, estimated_price: v }))} />

            <Input label="Advance Payment" type="number" value={bookingFormData.advance_payment}
              onChange={v => setBookingFormData(p => ({ ...p, advance_payment: v }))} />

            <Input label="Work Name" required value={bookingFormData.work_name}
              onChange={v => setBookingFormData(p => ({ ...p, work_name: v }))} />

            <Input label="Work Type" required value={bookingFormData.work_type}
              onChange={v => setBookingFormData(p => ({ ...p, work_type: v }))} />

            <Input label="Plate No." required value={bookingFormData.plate_no}
              onChange={v => setBookingFormData(p => ({ ...p, plate_no: v }))} />

            <Input label="Model" required value={bookingFormData.model}
              onChange={v => setBookingFormData(p => ({ ...p, model: v }))} />

            <Input label="Year Made" type="number" value={bookingFormData.year_made}
              onChange={v => setBookingFormData(p => ({ ...p, year_made: v }))} />

            <Input label="Color" value={bookingFormData.color}
              onChange={v => setBookingFormData(p => ({ ...p, color: v }))} />

            <Input label="VIN" value={bookingFormData.vin}
              onChange={v => setBookingFormData(p => ({ ...p, vin: v }))} />

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
              <select
                value={bookingFormData.payment_method}
                onChange={e => setBookingFormData(p => ({ ...p, payment_method: e.target.value }))}
                className="w-full h-11 rounded-lg border border-gray-300 px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              >
                <option value="">Select Payment Method</option>
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Check">Check</option>
              </select>
            </div>

            <Input label="Appointment Date (mm/dd/yyyy)" type="date" required value={bookingFormData.appointment_date}
              onChange={v => setBookingFormData(p => ({ ...p, appointment_date: v }))} />

            <Input label="Worker Name" value={bookingFormData.worker_name}
              onChange={v => setBookingFormData(p => ({ ...p, worker_name: v }))} />

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={bookingFormData.status}
                onChange={e => setBookingFormData(p => ({ ...p, status: e.target.value }))}
                className="w-full h-11 rounded-lg border border-gray-300 px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => setShowBookingForm(false)}
              className="px-6 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submittingBooking}
              className="px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium shadow disabled:opacity-50"
            >
              {submittingBooking ? 'Creating...' : 'Create Booking'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
  const quotationsTableContent = (
    <>
      {/* Search Filters */}
      <div className="bg-white p-4 mb-3 flex flex-wrap items-end gap-4">
        <input
          placeholder="Mobile"
          value={searchMobile}
          onChange={e => setSearchMobile(e.target.value)}
          className="border-2 border-zinc-500 px-2 py-1 rounded-lg h-9"
        />
        
        <input
          placeholder="Model"
          value={searchModel}
          onChange={e => setSearchModel(e.target.value)}
          className="border-2 border-zinc-500 px-2 py-1 rounded-lg h-9"
        />
        
        <input
          placeholder="Quot No."
          value={searchQuotNo}
          onChange={e => setSearchQuotNo(e.target.value)}
          className="border-2 border-zinc-500 px-2 py-1 rounded-lg h-9"
        />

        {/* spacer */}
        <div className="ml-auto flex gap-2">
          <button className="bg-blue-600 text-white px-2 py-1 rounded-lg h-9 w-32" onClick={() => setShowAddQuotationForm(true)}>
            Add Quotation
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full text-center border">
          <thead className="bg-gray-300">
            <tr>
              {[
                'Quot No.',
                'Quotation Date',
                'Customer Type',                
                'Customer Name',
                'Mobile',
                'Plate No.',
                'Model',
                'Total',
                'VAT',
                'Total inc. VAT',
                'Added By',
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
            {quotationsFilteredData
              .map(q => (
                <tr key={`${q.id}-${q.quote_number}`} className="hover:bg-gray-50">
                  <td className="border py-2">{q.quote_number}</td>
                  <td className="border">{q.quote_date ? new Date(q.quote_date).toLocaleDateString('en-GB') : 'N/A'}</td>
                  <td className="border"><span>{q.customer?.type || 'N/A'}</span></td>
                  <td className="border">{q.customer?.name || 'N/A'}</td>
                  <td className="border">{q.customer?.mobile || 'N/A'}</td>
                  <td className="border">{q.plate_no || 'N/A'}</td>
                  <td className="border">{q.model || 'N/A'}</td>
                  <td className="border">{q.grand_total ? `${q.grand_total} AED` : '0.00 AED'}</td>
                  <td className="border">{q.vat || 'N/A'}</td>
                  <td className="border">{q.total_inc_vat || 'N/A'}</td>
                  <td className="border">{q.added_by || 'N/A'}</td>
                  <td className="border px-2 py-2" style={{ backgroundColor: q.status_bg_color }}><span style={{ color: q.status_text_color }}>{q.status}</span></td>
                  <td className="border p-0 bg-blue-600 hover:bg-blue-700">
                    <button className="bg-blue-600 text-white px-2 py-1 rounded-lg" onClick={() => {
                      setSelectedQuotation(q);
                      setEditedQuotation({ ...q });
                      setIsEditing(false);
                      setShowViewModal(true);
                    }}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Pagination removed to show all data */}
    </>
  );

  /* =======================
     Booking Table Content
  ======================= */
  const bookingTableContent = (
    <>
     {/* Search Filters */}
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

        {/* spacer */}
        <div className="ml-auto flex gap-2">
          <button className="bg-blue-600 text-white px-2 py-1 rounded-lg h-9 w-32" onClick={() => setShowBookingForm(true)}>
            Booking
          </button>
        </div>
      </div>
      {/* Header */}
      <div className="bg-white p-0 mb-3 flex flex-wrap items-end gap-4">
  <div className="w-full bg-gray-300 flex justify-center items-center h-12 font-bold">
    Calendar
  </div>
</div>
      {/* Calendar Cards */}
      <div className="bg-white">
        <div className="p-0">
          {bookingPaginatedData.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              No bookings found.
            </div>
          ) : (
            <div className="space-y-4">
              {bookingPaginatedData.map(c => {
                return (
                  <div key={`${c.id}-${c.customerName}`} className="bg-white border border-gray-300 rounded-lg">

                      {/* ===== Row 1: Date + Day ===== */}
                      <div className="flex justify-center items-center gap-4 bg-gray-300 py-2 border-b border-gray-400">
                        <span className="text-sm font-bold text-gray-800">
                          {c.appointment_date || c.createdAt || '2025-01-01'}
                        </span>
                        <span className="text-sm text-gray-700 font-bold">
                          {c.appointment_date ? new Date(c.appointment_date).toLocaleDateString('en-US', { weekday: 'long' }) : 'Monday'}
                        </span>
                      </div>

                      {/* ===== Row 2: Labels ===== */}
                      <div className="grid grid-cols-12 text-xs font-bold text-gray-600  bg-gray-200 border-b border-gray-300 text-center">
                        {[
                          'Work Type',
                          'Customer Type',
                          'Full Name',
                          'Mobile',
                          'Plate No',
                          'Model',
                          'Employee Name',
                          'Advance Payment',
                          'Updated By',
                          'Updated Date',
                          'Status'
                        ].map((label, i) => (
                          <div key={i} className="px-2 py-2 border-r border-gray-300 text-center">
                            {label}
                          </div>
                        ))}
                        <div className="px-2 py-2 text-center bg-blue-600 text-white font-semibold">
                          Action
                        </div>
                      </div>

                      {/* ===== Row 3: Values ===== */}
                      <div className="grid grid-cols-12 text-sm text-gray-800 bg-white text-center">
                        {[
                          c.service_type || 'N/A',
                          c.customerType || 'N/A',
                          c.customerName || 'N/A',
                          c.mobile || 'N/A',
                          c.plate_no || 'N/A',
                          c.model || 'N/A',
                          c.employee_name || 'N/A', // Employee Name from backend
                          c.advance_payment || 'N/A', // Advance Payment
                          c.updated_by || 'Admin', // Updated By from backend
                          c.appointment_date || c.createdAt || 'N/A'
                        ].map((val, i) => {
                          let extraClass = '';
                          if (i === 0) { // Work Type
                            const workType = val.toLowerCase();
                            if (workType.includes('repair')) extraClass = 'bg-orange-100 text-orange-800';
                            else if (workType.includes('maintenance')) extraClass = 'bg-cyan-100 text-cyan-800';
                            else if (workType.includes('inspection')) extraClass = 'bg-indigo-100 text-indigo-800';
                            else extraClass = 'bg-gray-100 text-gray-800';
                          } else if (i === 1) { // Customer Type
                            const customerType = val;
                            if (customerType === 'Individual') extraClass = 'bg-blue-100 text-blue-800';
                            else if (customerType === 'Comp. client') extraClass = 'bg-purple-100 text-purple-800';
                            else if (customerType === 'Government') extraClass = 'bg-green-100 text-green-800';
                            else extraClass = 'bg-gray-100 text-gray-800';
                          }
                          return (
                            <div key={i} className={`px-2 py-2 border-r border-gray-300 text-center ${extraClass}`}>
                              {val}
                            </div>
                          );
                        })}

                        {/* Status */}
                        <div className={`w-full h-full flex items-center justify-center text-xs font-semibold border-r border-gray-300 text-center
                            ${
                              (c.status === 'confirmed' || c.status === 'completed')
                                ? 'bg-green-100 text-green-700'
                                : c.status === 'cancelled'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}
                        >
                          {c.status || 'pending'}
                        </div>

                        {/* Action */}
                        <div className="w-full h-full bg-blue-50 flex text-center">
                          <button className="w-1/2 h-full bg-blue-600 text-white text-xs hover:bg-blue-700 rounded-none">
                            Update
                          </button>
                          <button className="w-1/2 h-full bg-red-600 text-white text-xs hover:bg-red-700 rounded-none">
                            Delete
                          </button>
                        </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {/* <div className="flex justify-center py-4 gap-1">
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
      </div> */}
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
                // let tier = 'Bronze';
                // if (c.loyaltyPoints > 1000) tier = 'Gold';
                // else if (c.loyaltyPoints > 500) tier = 'Silver';

                return (
                  <tr key={`${c.id}-${c.customerName}`} className="hover:bg-gray-50">
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
                  <tr key={`${c.id}-${c.customerName}`} className="hover:bg-gray-50">
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
                  <tr key={`${c.id}-${c.customerName}`} className="hover:bg-gray-50">
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
        {activeTab !== 'Clients' &&
          activeTab !== 'Loyalty Program' &&
          activeTab !== 'Quotations' &&
          activeTab !== 'Booking' &&
          activeTab !== 'Maint. Contract' &&
          activeTab !== 'Check Car' && (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <p className="text-sm font-medium">No Data Available</p>
            </div>
          )}

        {activeTab === 'Clients' && tableContent}
        {activeTab === 'Loyalty Program' && loyaltyTableContent}
        {activeTab === 'Quotations' && quotationsTableContent}
        {activeTab === 'Booking' && bookingTableContent}
        {activeTab === 'Maint. Contract' && maintContractTableContent}
        {activeTab === 'Check Car' && checkCarTableContent}
      </div>

      {/* Modals */}
      {addCustomerModal}
      {addQuotationModal}
      {viewQuotationModal}
      {viewClientModal}
      {bookingFormModal}
    </div>
  );
};

export default Customers;
