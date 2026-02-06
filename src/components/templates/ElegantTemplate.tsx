import { Invoice } from '@/lib/types'
import { calculateInvoiceTotals, formatDate } from '@/lib/invoice-utils'

interface TemplateProps {
  invoice: Invoice
  currencySymbol: string
}

export function ElegantTemplate({ invoice, currencySymbol }: TemplateProps) {
  const totals = calculateInvoiceTotals(invoice.lineItems)

  return (
    <div className="bg-gradient-to-br from-white via-white to-accent/5 p-10 rounded-lg shadow-sm border border-border/50 min-h-[800px]">
      <div className="mb-10 pb-8 border-b-2 border-accent/20">
        <div className="flex justify-between items-start">
          <div>
            {invoice.business.logo && (
              <div className="mb-5">
                <img 
                  src={invoice.business.logo} 
                  alt="Business Logo" 
                  className="h-14 w-auto object-contain"
                />
              </div>
            )}
            <h1 className="text-3xl font-serif font-medium text-foreground mb-3 tracking-tight italic">
              {invoice.business.name || 'Your Business Name'}
            </h1>
            <div className="text-sm text-muted-foreground space-y-1 leading-relaxed">
              {invoice.business.address && <p className="italic">{invoice.business.address}</p>}
              {invoice.business.email && <p>{invoice.business.email}</p>}
              {invoice.business.phone && <p>{invoice.business.phone}</p>}
            </div>
          </div>
          
          <div className="text-right bg-accent/10 px-8 py-6 rounded-lg border border-accent/20">
            <h2 className="text-5xl font-serif italic text-accent mb-4">Invoice</h2>
            <div className="text-sm space-y-2 border-t border-accent/20 pt-4">
              <div className="flex justify-between gap-6">
                <span className="text-muted-foreground font-serif italic">No.</span>
                <span className="font-mono font-medium">{invoice.invoiceNumber}</span>
              </div>
              <div className="flex justify-between gap-6">
                <span className="text-muted-foreground font-serif italic">Issued</span>
                <span className="font-medium">{formatDate(invoice.issueDate)}</span>
              </div>
              <div className="flex justify-between gap-6">
                <span className="text-muted-foreground font-serif italic">Due</span>
                <span className="font-semibold">{formatDate(invoice.dueDate)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-10 bg-accent/5 p-6 rounded-lg border-l-4 border-accent">
        <h3 className="text-sm font-serif italic text-accent mb-4">
          Billed To
        </h3>
        <div className="text-sm">
          <p className="font-semibold text-foreground text-lg mb-2">
            {invoice.client.name || 'Client Name'}
          </p>
          {invoice.client.address && <p className="text-muted-foreground italic mb-1">{invoice.client.address}</p>}
          {invoice.client.email && <p className="text-muted-foreground">{invoice.client.email}</p>}
          {invoice.client.phone && <p className="text-muted-foreground">{invoice.client.phone}</p>}
        </div>
      </div>

      <div className="mb-10">
        <table className="w-full">
          <thead>
            <tr className="bg-accent/10 border-y-2 border-accent/20">
              <th className="text-left py-4 px-4 text-sm font-serif italic text-accent">Description</th>
              <th className="text-right py-4 px-4 text-sm font-serif italic text-accent w-20">Qty</th>
              <th className="text-right py-4 px-4 text-sm font-serif italic text-accent w-28">Rate</th>
              <th className="text-right py-4 px-4 text-sm font-serif italic text-accent w-24">Tax</th>
              <th className="text-right py-4 px-4 text-sm font-serif italic text-accent w-24">Discount</th>
              <th className="text-right py-4 px-4 text-sm font-serif italic text-accent w-32">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.lineItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-muted-foreground font-serif italic">
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
                  <tr key={item.id} className={`${index % 2 === 0 ? 'bg-white/50' : 'bg-accent/5'} border-b border-accent/10`}>
                    <td className="py-4 px-4 text-sm text-foreground">{item.description || '—'}</td>
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
                    <td className="py-4 px-4 text-sm text-right font-mono font-semibold text-foreground">
                      {currencySymbol}{lineTotal.toFixed(2)}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mb-10">
        <div className="w-96">
          <div className="space-y-3 mb-4">
            <div className="flex justify-between py-2 text-sm">
              <span className="text-muted-foreground font-serif italic">Subtotal</span>
              <span className="font-mono font-medium">{currencySymbol}{totals.subtotal.toFixed(2)}</span>
            </div>
            
            {totals.totalDiscount > 0 && (
              <div className="flex justify-between py-2 text-sm">
                <span className="text-muted-foreground font-serif italic">Discount</span>
                <span className="font-mono font-medium text-destructive">−{currencySymbol}{totals.totalDiscount.toFixed(2)}</span>
              </div>
            )}
            
            {totals.totalTax > 0 && (
              <div className="flex justify-between py-2 text-sm">
                <span className="text-muted-foreground font-serif italic">Tax</span>
                <span className="font-mono font-medium">{currencySymbol}{totals.totalTax.toFixed(2)}</span>
              </div>
            )}
          </div>
          
          <div className="bg-gradient-to-r from-accent/20 to-accent/10 px-6 py-5 rounded-lg border-2 border-accent/30">
            <div className="flex justify-between items-center">
              <span className="text-lg font-serif italic text-accent">Total Due</span>
              <span className="text-3xl font-semibold font-mono text-foreground">
                {currencySymbol}{totals.total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {invoice.notes && (
        <div className="mt-10 pt-8 border-t-2 border-accent/20 bg-accent/5 -mx-10 -mb-10 px-10 pb-10 rounded-b-lg">
          <h3 className="text-sm font-serif italic text-accent mb-4">
            Additional Notes
          </h3>
          <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{invoice.notes}</p>
        </div>
      )}
    </div>
  )
}
