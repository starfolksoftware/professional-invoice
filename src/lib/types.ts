export interface InvoiceLineItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  taxRate: number
  discountPercent: number
}

export interface BusinessDetails {
  logo?: string
  name: string
  address: string
  email: string
  phone: string
}

export interface ClientDetails {
  name: string
  address: string
  email: string
  phone: string
}

export interface Invoice {
  id: string
  invoiceNumber: string
  issueDate: string
  dueDate: string
  currency: string
  business: BusinessDetails
  client: ClientDetails
  lineItems: InvoiceLineItem[]
  notes?: string
  status: 'draft' | 'finalized'
  createdAt: string
  updatedAt: string
}

export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'MXN', symbol: 'MX$', name: 'Mexican Peso' },
] as const
