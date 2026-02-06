import { Invoice } from '@/lib/types'
import { calculateInvoiceTotals, formatDate } from '@/lib/invoice-utils'
import { Separator } from '@/components/ui/separator'

interface InvoicePreviewProps {
  invoice: Invoice
  currencySymbol: string
}

export function InvoicePreview({ invoice, currencySymbol }: InvoicePreviewProps) {
  const totals = calculateInvoiceTotals(invoice.lineItems)

  return (
    <div id="invoice-preview-content" className="bg-white p-8 rounded-lg shadow-sm border border-border min-h-[800px]">
      <div className="flex justify-between items-start mb-8">
        <div>
          {invoice.business.logo && (
            <img 
              src={invoice.business.logo} 
              alt="Business Logo" 
              className="h-16 w-auto mb-4 object-contain"
            />
          )}
          <h1 className="text-3xl font-semibold text-foreground mb-1">
            {invoice.business.name || 'Your Business Name'}
          </h1>
          <div className="text-sm text-muted-foreground space-y-0.5">
            {invoice.business.address && <p>{invoice.business.address}</p>}
            {invoice.business.email && <p>{invoice.business.email}</p>}
            {invoice.business.phone && <p>{invoice.business.phone}</p>}
          </div>
        </div>
        
        <div className="text-right">
          <h2 className="text-4xl font-bold text-primary mb-2">INVOICE</h2>
          <div className="text-sm space-y-1">
            <div>
              <span className="text-muted-foreground">Invoice #: </span>
              <span className="font-mono font-medium">{invoice.invoiceNumber}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Issue Date: </span>
              <span>{formatDate(invoice.issueDate)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Due Date: </span>
              <span className="font-medium">{formatDate(invoice.dueDate)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
          Bill To
        </h3>
        <div className="text-sm">
          <p className="font-semibold text-foreground text-base mb-1">
            {invoice.client.name || 'Client Name'}
          </p>
          {invoice.client.address && <p className="text-muted-foreground">{invoice.client.address}</p>}
          {invoice.client.email && <p className="text-muted-foreground">{invoice.client.email}</p>}
          {invoice.client.phone && <p className="text-muted-foreground">{invoice.client.phone}</p>}
        </div>
      </div>

      <div className="mb-8">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-primary">
              <th className="text-left py-3 text-sm font-semibold text-foreground">Description</th>
              <th className="text-right py-3 text-sm font-semibold text-foreground w-20">Qty</th>
              <th className="text-right py-3 text-sm font-semibold text-foreground w-28">Unit Price</th>
              <th className="text-right py-3 text-sm font-semibold text-foreground w-24">Tax</th>
              <th className="text-right py-3 text-sm font-semibold text-foreground w-24">Discount</th>
              <th className="text-right py-3 text-sm font-semibold text-foreground w-32">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.lineItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-muted-foreground">
                  No items added yet
                </td>
              </tr>
            ) : (
              invoice.lineItems.map((item, index) => {
                const itemSubtotal = item.quantity * item.unitPrice
                const discount = itemSubtotal * (item.discountPercent / 100)
                const afterDiscount = itemSubtotal - discount
                const tax = afterDiscount * (item.taxRate / 100)
                const lineTotal = afterDiscount + tax

                return (
                  <tr key={item.id} className={index % 2 === 0 ? 'bg-muted/20' : ''}>
                    <td className="py-3 text-sm text-foreground">{item.description || '—'}</td>
                    <td className="py-3 text-sm text-right font-mono">{item.quantity}</td>
                    <td className="py-3 text-sm text-right font-mono">
                      {currencySymbol}{item.unitPrice.toFixed(2)}
                    </td>
                    <td className="py-3 text-sm text-right text-muted-foreground">
                      {item.taxRate > 0 ? `${item.taxRate}%` : '—'}
                    </td>
                    <td className="py-3 text-sm text-right text-muted-foreground">
                      {item.discountPercent > 0 ? `${item.discountPercent}%` : '—'}
                    </td>
                    <td className="py-3 text-sm text-right font-mono font-medium">
                      {currencySymbol}{lineTotal.toFixed(2)}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mb-8">
        <div className="w-80 space-y-2">
          <div className="flex justify-between py-2 text-sm">
            <span className="text-muted-foreground">Subtotal:</span>
            <span className="font-mono">{currencySymbol}{totals.subtotal.toFixed(2)}</span>
          </div>
          
          {totals.totalDiscount > 0 && (
            <div className="flex justify-between py-2 text-sm">
              <span className="text-muted-foreground">Discount:</span>
              <span className="font-mono text-destructive">-{currencySymbol}{totals.totalDiscount.toFixed(2)}</span>
            </div>
          )}
          
          {totals.totalTax > 0 && (
            <div className="flex justify-between py-2 text-sm">
              <span className="text-muted-foreground">Tax:</span>
              <span className="font-mono">{currencySymbol}{totals.totalTax.toFixed(2)}</span>
            </div>
          )}
          
          <Separator />
          
          <div className="flex justify-between py-3">
            <span className="text-lg font-semibold text-foreground">Total:</span>
            <span className="text-2xl font-bold font-mono text-primary">
              {currencySymbol}{totals.total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {invoice.notes && (
        <div className="mt-8 pt-6 border-t border-border">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Notes
          </h3>
          <p className="text-sm text-foreground whitespace-pre-wrap">{invoice.notes}</p>
        </div>
      )}
    </div>
  )
}
