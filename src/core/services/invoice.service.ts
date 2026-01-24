import { httpService } from '../http/abi-http.service';

export interface Invoice {
  id: number;
  invoice_no?: string;
  draft_no?: string;
  customer_id: number | null;
  customer_info: {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    tax_id?: string;
    company_name?: string;
  };
  issued_date: string;
  issued_by: string;
  discount: number;
  total: number;
  vat: number;
  total_inc_vat: number;
  created_at?: string;
  updated_at?: string;
  created_by?: number;
  updated_by?: number;
  items?: InvoiceItem[];
  extra?: Record<string, unknown>;
}

export interface InvoiceItem {
  id: number;
  invoice_id: number;
  item_no: number;
  item_name: string;
  item_price: number;
  item_quantity: number;
  item_discount: number;
  item_total: number;
  item_vat: number;
  item_total_inc_vat: number;
  vat_rate: number;
  created_at?: string;
  created_by?: number;
}

export interface InvoiceApiResponse {
  success: boolean;
  data: {
    current_page: number;
    data: Invoice[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
  message?: string;
}

export class InvoiceService {
  async getInvoices(params?: {
    start_date?: string;
    end_date?: string;
    invoice_no?: string;
    page?: number;
  }): Promise<InvoiceApiResponse> {
    const queryParams = new URLSearchParams();
    if (params?.start_date) queryParams.append('start_date', params.start_date);
    if (params?.end_date) queryParams.append('end_date', params.end_date);
    if (params?.invoice_no) queryParams.append('invoice_no', params.invoice_no);
    if (params?.page) queryParams.append('page', params.page.toString());

    const url = `/invoices${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return httpService.get<InvoiceApiResponse>(url);
  }

  async getDraftInvoices(params?: {
    search?: string;
    page?: number;
  }): Promise<InvoiceApiResponse> {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.page) queryParams.append('page', params.page.toString());

    const url = `/invoices/drafts${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return httpService.get<InvoiceApiResponse>(url);
  }

  async createInvoice(data: {
    customer_info: {
      name: string;
      email?: string;
      phone?: string;
      address?: string;
      tax_id?: string;
      company_name?: string;
    };
    issued_date: string;
    issued_by: string;
    discount?: number;
    items: Array<{
      item_name: string;
      item_price: number;
      item_quantity: number;
      item_discount?: number;
      vat_rate?: number;
    }>;
    extra_data?: Record<string, unknown>;
    notes?: string;
  }): Promise<{ success: boolean; data?: Invoice; message?: string; errors?: Record<string, string[]> }> {
    return httpService.post<{ success: boolean; data?: Invoice; message?: string; errors?: Record<string, string[]> }>('/invoices', data);
  }

  async createDraftInvoice(data: {
    customer_info?: {
      name?: string;
      email?: string;
      phone?: string;
      address?: string;
      tax_id?: string;
      company_name?: string;
    };
    issued_date?: string;
    issued_by?: string;
    discount?: number;
    items?: Array<{
      item_name?: string;
      item_price?: number;
      item_quantity?: number;
      item_discount?: number;
      vat_rate?: number;
    }>;
    extra_data?: Record<string, unknown>;
    notes?: string;
  }): Promise<{ success: boolean; data?: Invoice; message?: string; errors?: Record<string, string[]> }> {
    return httpService.post<{ success: boolean; data?: Invoice; message?: string; errors?: Record<string, string[]> }>('/invoices/drafts', data);
  }
}

export const invoiceService = new InvoiceService();