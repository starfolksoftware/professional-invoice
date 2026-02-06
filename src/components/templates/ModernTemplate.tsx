import { Invoice } from '@/lib/types'
import { calculateInvoiceTotals, formatDate } from '@/lib/invoice-utils'

interface TemplateProps {
  invoice: Invoice
  currencySymbol: string
}

export function ModernTemplate({ invoice, currencySymbol }: TemplateProps) {
  const totals = calculateInvoiceTotals(invoice.lineItems)

  return (
    <div className="bg-white rounded-lg shadow-sm border border-border min-h-[800px] overflow-hidden">
      <div className="bg-gradient-to-br from-primary to-primary/80 text-white p-8">
        <div className="flex justify-between items-start">
          <div>
            {invoice.business.logo && (
              <div className="bg-white p-2 rounded mb-4 inline-block">
                <img 
                  src={invoice.business.logo} 
                  alt="Business Logo" 
                  className="h-12 w-auto object-contain"
                />
              </div>
            )}
            <h1 className="text-3xl font-bold mb-1">
              {invoice.business.name || 'Your Business Name'}
            </h1>
            <div className="text-sm text-white/90 space-y-0.5">
              {invoice.business.address && <p>{invoice.business.address}</p>}
              {invoice.business.email && <p>{invoice.business.email}</p>}
              {invoice.business.phone && <p>{invoice.business.phone}</p>}
            </div>
          </div>
          
          <div className="text-right">
            <h2 className="text-5xl font-bold mb-4">INVOICE</h2>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-sm space-y-1">
              <div className="flex justify-between gap-4">
                <span className="text-white/80">Invoice #:</span>
                <span className="font-mono font-semibold">{invoice.invoiceNumber}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-white/80">Issue Date:</span>
                <span className="font-medium">{formatDate(invoice.issueDate)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-white/80">Due Date:</span>
                <span className="font-medium">{formatDate(invoice.dueDate)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="mb-8 bg-muted/30 p-6 rounded-lg">
          <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-3">
            Bill To
          </h3>
          <div className="text-sm">
            <p className="font-bold text-foreground text-lg mb-1">
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
              <tr className="bg-primary/5">
                <th className="text-left py-4 px-4 text-sm font-bold text-foreground rounded-tl-lg">Description</th>
                <th className="text-right py-4 px-4 text-sm font-bold text-foreground w-20">Qty</th>
                <th className="text-right py-4 px-4 text-sm font-bold text-foreground w-28">Price</th>
                <th className="text-right py-4 px-4 text-sm font-bold text-foreground w-24">Tax</th>
                <th className="text-right py-4 px-4 text-sm font-bold text-foreground w-24">Disc.</th>
                <th className="text-right py-4 px-4 text-sm font-bold text-foreground w-32 rounded-tr-lg">Amount</th>
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
                    <tr key={item.id} className={index !== invoice.lineItems.length - 1 ? 'border-b border-border/50' : ''}>
                      <td className="py-4 px-4 text-sm text-foreground font-medium">{item.description || '—'}</td>
                      <td className="py-4 px-4 text-sm text-right font-mono text-muted-foreground">{item.quantity}</td>
                      <td className="py-4 px-4 text-sm text-right font-mono text-muted-foreground">
                        {currencySymbol}{item.unitPrice.toFixed(2)}
                      </td>
                      <td className="py-4 px-4 text-sm text-right text-muted-foreground">
                        {item.taxRate > 0 ? `${item.taxRate}%` : '—'}
                      </td>
                      <td className="py-4 px-4 text-sm text-right text-muted-foreground">
                        {item.discountPercent > 0 ? `${item.discountPercent}%` : '—'}
                      </td>
                      <td className="py-4 px-4 text-sm text-right font-mono font-bold text-foreground">
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
          <div className="w-96 bg-muted/20 rounded-lg p-6">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-mono font-medium">{currencySymbol}{totals.subtotal.toFixed(2)}</span>
              </div>
              
              {totals.totalDiscount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Discount:</span>
                  <span className="font-mono font-medium text-destructive">-{currencySymbol}{totals.totalDiscount.toFixed(2)}</span>
                </div>
              )}
              
              {totals.totalTax > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax:</span>
                  <span className="font-mono font-medium">{currencySymbol}{totals.totalTax.toFixed(2)}</span>
                </div>
              )}
              
              <div className="h-px bg-border my-4"></div>
              
              <div className="flex justify-between items-center py-2 bg-primary/10 px-4 rounded-lg">
                <span className="text-lg font-bold text-foreground">Total Due:</span>
                <span className="text-3xl font-bold font-mono text-primary">
                  {currencySymbol}{totals.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {invoice.notes && (
          <div className="mt-8 bg-muted/20 p-6 rounded-lg">
            <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-3">
              Notes
            </h3>
            <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{invoice.notes}</p>
          </div>
        )}
      </div>
    </div>
  )
}
