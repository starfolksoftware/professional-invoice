import { InvoiceLineItem, Invoice } from './types'

export function calculateLineTotal(item: InvoiceLineItem): number {
  const subtotal = item.quantity * item.unitPrice
  const discount = subtotal * (item.discountPercent / 100)
  const afterDiscount = subtotal - discount
  const tax = afterDiscount * (item.taxRate / 100)
  return afterDiscount + tax
}

export function calculateInvoiceTotals(items: InvoiceLineItem[]) {
  let subtotal = 0
  let totalDiscount = 0
  let totalTax = 0

  items.forEach(item => {
    const itemSubtotal = item.quantity * item.unitPrice
    const discount = itemSubtotal * (item.discountPercent / 100)
    const afterDiscount = itemSubtotal - discount
    const tax = afterDiscount * (item.taxRate / 100)

    subtotal += itemSubtotal
    totalDiscount += discount
    totalTax += tax
  })

  const total = subtotal - totalDiscount + totalTax

  return {
    subtotal: Number(subtotal.toFixed(2)),
    totalDiscount: Number(totalDiscount.toFixed(2)),
    totalTax: Number(totalTax.toFixed(2)),
    total: Number(total.toFixed(2)),
  }
}

export function generateInvoiceNumber(existingInvoices: Invoice[]): string {
  if (existingInvoices.length === 0) {
    return 'INV-001'
  }

  const numbers = existingInvoices
    .map(inv => {
      const match = inv.invoiceNumber.match(/INV-(\d+)/)
      return match ? parseInt(match[1], 10) : 0
    })
    .filter(num => !isNaN(num))

  const maxNumber = Math.max(...numbers, 0)
  const nextNumber = maxNumber + 1

  return `INV-${String(nextNumber).padStart(3, '0')}`
}

export function formatCurrency(amount: number, currencySymbol: string): string {
  return `${currencySymbol}${amount.toFixed(2)}`
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

export function createEmptyLineItem(): InvoiceLineItem {
  return {
    id: crypto.randomUUID(),
    description: '',
    quantity: 1,
    unitPrice: 0,
    taxRate: 0,
    discountPercent: 0,
  }
}

export function getTodayDate(): string {
  return new Date().toISOString().split('T')[0]
}

export function getDefaultDueDate(): string {
  const date = new Date()
  date.setDate(date.getDate() + 30)
  return date.toISOString().split('T')[0]
}
