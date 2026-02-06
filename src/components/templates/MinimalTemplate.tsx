import { Invoice } from '@/lib/types'
import { calculateInvoiceTotals, formatDate } from '@/lib/invoice-utils'

interface TemplateProps {
  invoice: Invoice
  currencySymbol: string
}

export function MinimalTemplate({ invoice, currencySymbol }: TemplateProps) {
  const totals = calculateInvoiceTotals(invoice.lineItems)

  return (
    <div className="bg-white p-12 rounded-lg shadow-sm border border-border min-h-[800px]">
      <div className="mb-12">
        <div className="flex justify-between items-start mb-8">
          <div className="flex-1">
            {invoice.business.logo && (
              <img 
                src={invoice.business.logo} 
                alt="Business Logo" 
                className="h-12 w-auto mb-6 object-contain grayscale"
              />
            )}
            <h1 className="text-2xl font-light text-foreground mb-2 tracking-tight">
              {invoice.business.name || 'Your Business Name'}
            </h1>
            <div className="text-xs text-muted-foreground space-y-1 leading-relaxed">
              {invoice.business.address && <p>{invoice.business.address}</p>}
              {invoice.business.email && <p>{invoice.business.email}</p>}
              {invoice.business.phone && <p>{invoice.business.phone}</p>}
            </div>
          </div>
          
          <div className="text-right">
            <h2 className="text-6xl font-extralight text-foreground/60 mb-6 tracking-tight">Invoice</h2>
          </div>
        </div>

        <div className="h-px bg-border mb-8"></div>

        <div className="grid grid-cols-3 gap-8 text-sm mb-8">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">Invoice Number</p>
            <p className="font-mono text-foreground">{invoice.invoiceNumber}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">Issue Date</p>
            <p className="text-foreground">{formatDate(invoice.issueDate)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">Due Date</p>
            <p className="text-foreground font-medium">{formatDate(invoice.dueDate)}</p>
          </div>
        </div>

        <div className="h-px bg-border mb-8"></div>

        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Billed To</p>
          <div className="text-sm">
            <p className="font-medium text-foreground text-base mb-2">
              {invoice.client.name || 'Client Name'}
            </p>
            {invoice.client.address && <p className="text-muted-foreground mb-1">{invoice.client.address}</p>}
            {invoice.client.email && <p className="text-muted-foreground mb-1">{invoice.client.email}</p>}
            {invoice.client.phone && <p className="text-muted-foreground">{invoice.client.phone}</p>}
          </div>
        </div>
      </div>

      <div className="mb-12">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-4 text-xs font-medium text-muted-foreground uppercase tracking-widest">Item</th>
              <th className="text-right py-4 text-xs font-medium text-muted-foreground uppercase tracking-widest w-16">Qty</th>
              <th className="text-right py-4 text-xs font-medium text-muted-foreground uppercase tracking-widest w-24">Rate</th>
              <th className="text-right py-4 text-xs font-medium text-muted-foreground uppercase tracking-widest w-20">Tax</th>
              <th className="text-right py-4 text-xs font-medium text-muted-foreground uppercase tracking-widest w-20">Disc</th>
              <th className="text-right py-4 text-xs font-medium text-muted-foreground uppercase tracking-widest w-28">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.lineItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-16 text-muted-foreground text-sm">
                  No items
                </td>
              </tr>
            ) : (
              invoice.lineItems.map((item) => {
                const itemSubtotal = item.quantity * item.unitPrice
                const discount = itemSubtotal * (item.discountPercent / 100)
                const afterDiscount = itemSubtotal - discount
                const tax = afterDiscount * (item.taxRate / 100)
                const lineTotal = afterDiscount + tax

                return (
                  <tr key={item.id} className="border-b border-border/50">
                    <td className="py-4 text-sm text-foreground">{item.description || '—'}</td>
                    <td className="py-4 text-sm text-right font-mono text-muted-foreground">{item.quantity}</td>
                    <td className="py-4 text-sm text-right font-mono text-muted-foreground">
                      {currencySymbol}{item.unitPrice.toFixed(2)}
                    </td>
                    <td className="py-4 text-xs text-right text-muted-foreground">
                      {item.taxRate > 0 ? `${item.taxRate}%` : '—'}
                    </td>
                    <td className="py-4 text-xs text-right text-muted-foreground">
                      {item.discountPercent > 0 ? `${item.discountPercent}%` : '—'}
                    </td>
                    <td className="py-4 text-sm text-right font-mono text-foreground">
                      {currencySymbol}{lineTotal.toFixed(2)}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mb-12">
        <div className="w-80">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-mono text-foreground">{currencySymbol}{totals.subtotal.toFixed(2)}</span>
            </div>
            
            {totals.totalDiscount > 0 && (
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Discount</span>
                <span className="font-mono text-destructive">−{currencySymbol}{totals.totalDiscount.toFixed(2)}</span>
              </div>
            )}
            
            {totals.totalTax > 0 && (
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Tax</span>
                <span className="font-mono text-foreground">{currencySymbol}{totals.totalTax.toFixed(2)}</span>
              </div>
            )}
            
            <div className="h-px bg-border my-4"></div>
            
            <div className="flex justify-between py-3">
              <span className="text-base font-medium text-foreground uppercase tracking-wide">Total</span>
              <span className="text-2xl font-light font-mono text-foreground">
                {currencySymbol}{totals.total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {invoice.notes && (
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Notes</p>
          <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{invoice.notes}</p>
        </div>
      )}
    </div>
  )
}
