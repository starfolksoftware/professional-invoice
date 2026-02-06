import { Invoice } from '@/lib/types'
import { calculateInvoiceTotals, formatDate } from '@/lib/invoice-utils'

interface TemplateProps {
  invoice: Invoice
  currencySymbol: string
}

export function BoldTemplate({ invoice, currencySymbol }: TemplateProps) {
  const totals = calculateInvoiceTotals(invoice.lineItems)

  return (
    <div className="bg-foreground text-background rounded-lg shadow-sm border-4 border-foreground min-h-[800px] overflow-hidden">
      <div className="bg-foreground text-background p-8 border-b-4 border-accent">
        <div className="flex justify-between items-start">
          <div>
            {invoice.business.logo && (
              <div className="bg-background p-3 rounded-none mb-4 inline-block border-2 border-accent">
                <img 
                  src={invoice.business.logo} 
                  alt="Business Logo" 
                  className="h-14 w-auto object-contain"
                />
              </div>
            )}
            <h1 className="text-4xl font-black mb-2 uppercase tracking-tight">
              {invoice.business.name || 'Your Business'}
            </h1>
            <div className="text-sm text-background/80 font-medium space-y-1">
              {invoice.business.address && <p>{invoice.business.address}</p>}
              {invoice.business.email && <p>{invoice.business.email}</p>}
              {invoice.business.phone && <p>{invoice.business.phone}</p>}
            </div>
          </div>
          
          <div className="text-right bg-accent text-foreground px-6 py-4 border-2 border-background">
            <h2 className="text-5xl font-black uppercase tracking-tighter">Invoice</h2>
          </div>
        </div>
      </div>

      <div className="bg-background text-foreground p-8">
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-accent/10 p-5 border-l-4 border-accent">
            <h3 className="text-xs font-black text-foreground uppercase tracking-widest mb-4">
              Bill To
            </h3>
            <div className="text-sm">
              <p className="font-black text-foreground text-xl mb-2 uppercase">
                {invoice.client.name || 'Client Name'}
              </p>
              {invoice.client.address && <p className="text-muted-foreground font-medium">{invoice.client.address}</p>}
              {invoice.client.email && <p className="text-muted-foreground font-medium">{invoice.client.email}</p>}
              {invoice.client.phone && <p className="text-muted-foreground font-medium">{invoice.client.phone}</p>}
            </div>
          </div>

          <div className="bg-foreground/5 p-5 border-r-4 border-foreground">
            <h3 className="text-xs font-black text-foreground uppercase tracking-widest mb-4">
              Invoice Details
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-black uppercase text-xs">Number:</span>
                <span className="font-mono font-bold">{invoice.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-black uppercase text-xs">Issued:</span>
                <span className="font-bold">{formatDate(invoice.issueDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-black uppercase text-xs">Due:</span>
                <span className="font-bold">{formatDate(invoice.dueDate)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="bg-foreground text-background">
            <div className="grid grid-cols-[1fr,80px,120px,80px,80px,140px] gap-4 px-4 py-4">
              <div className="text-xs font-black uppercase tracking-wider">Description</div>
              <div className="text-xs font-black uppercase tracking-wider text-right">Qty</div>
              <div className="text-xs font-black uppercase tracking-wider text-right">Price</div>
              <div className="text-xs font-black uppercase tracking-wider text-right">Tax</div>
              <div className="text-xs font-black uppercase tracking-wider text-right">Disc</div>
              <div className="text-xs font-black uppercase tracking-wider text-right">Amount</div>
            </div>
          </div>
          
          <div className="border-x-2 border-b-2 border-foreground">
            {invoice.lineItems.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground font-bold">
                No items added yet
              </div>
            ) : (
              invoice.lineItems.map((item, index) => {
                const itemSubtotal = item.quantity * item.unitPrice
                const discount = itemSubtotal * (item.discountPercent / 100)
                const afterDiscount = itemSubtotal - discount
                const tax = afterDiscount * (item.taxRate / 100)
                const lineTotal = afterDiscount + tax

                return (
                  <div 
                    key={item.id} 
                    className={`grid grid-cols-[1fr,80px,120px,80px,80px,140px] gap-4 px-4 py-4 ${
                      index % 2 === 0 ? 'bg-foreground/5' : 'bg-background'
                    } ${index !== invoice.lineItems.length - 1 ? 'border-b border-border' : ''}`}
                  >
                    <div className="text-sm font-bold text-foreground">{item.description || '—'}</div>
                    <div className="text-sm text-right font-mono font-medium">{item.quantity}</div>
                    <div className="text-sm text-right font-mono font-medium">
                      {currencySymbol}{item.unitPrice.toFixed(2)}
                    </div>
                    <div className="text-sm text-right font-medium">
                      {item.taxRate > 0 ? `${item.taxRate}%` : '—'}
                    </div>
                    <div className="text-sm text-right font-medium">
                      {item.discountPercent > 0 ? `${item.discountPercent}%` : '—'}
                    </div>
                    <div className="text-sm text-right font-mono font-black text-foreground">
                      {currencySymbol}{lineTotal.toFixed(2)}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        <div className="flex justify-end mb-8">
          <div className="w-96">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between py-2 px-4 bg-muted/50 text-sm">
                <span className="font-black uppercase text-xs">Subtotal:</span>
                <span className="font-mono font-bold">{currencySymbol}{totals.subtotal.toFixed(2)}</span>
              </div>
              
              {totals.totalDiscount > 0 && (
                <div className="flex justify-between py-2 px-4 bg-destructive/10 text-sm">
                  <span className="font-black uppercase text-xs">Discount:</span>
                  <span className="font-mono font-bold text-destructive">-{currencySymbol}{totals.totalDiscount.toFixed(2)}</span>
                </div>
              )}
              
              {totals.totalTax > 0 && (
                <div className="flex justify-between py-2 px-4 bg-muted/50 text-sm">
                  <span className="font-black uppercase text-xs">Tax:</span>
                  <span className="font-mono font-bold">{currencySymbol}{totals.totalTax.toFixed(2)}</span>
                </div>
              )}
            </div>
            
            <div className="bg-accent text-foreground px-6 py-5 border-4 border-foreground">
              <div className="flex justify-between items-center">
                <span className="text-xl font-black uppercase tracking-tight">Total Due:</span>
                <span className="text-4xl font-black font-mono">
                  {currencySymbol}{totals.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {invoice.notes && (
          <div className="mt-8 bg-foreground/5 p-6 border-l-4 border-accent">
            <h3 className="text-xs font-black text-foreground uppercase tracking-widest mb-3">
              Notes
            </h3>
            <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed font-medium">{invoice.notes}</p>
          </div>
        )}
      </div>
    </div>
  )
}
