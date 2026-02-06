import { InvoiceLineItem } from '@/lib/types'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Trash } from '@phosphor-icons/react'
import { calculateLineTotal } from '@/lib/invoice-utils'

interface LineItemRowProps {
  item: InvoiceLineItem
  currencySymbol: string
  onUpdate: (id: string, field: keyof InvoiceLineItem, value: string | number) => void
  onRemove: (id: string) => void
  canRemove: boolean
}

export function LineItemRow({ item, currencySymbol, onUpdate, onRemove, canRemove }: LineItemRowProps) {
  const lineTotal = calculateLineTotal(item)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 p-4 bg-muted/30 rounded-lg border border-border">
      <div className="lg:col-span-4">
        <label className="text-xs text-muted-foreground mb-1 block">Description</label>
        <Input
          id={`description-${item.id}`}
          value={item.description}
          onChange={(e) => onUpdate(item.id, 'description', e.target.value)}
          placeholder="Item description"
          className="h-9"
        />
      </div>
      
      <div className="lg:col-span-1">
        <label className="text-xs text-muted-foreground mb-1 block">Qty</label>
        <Input
          id={`quantity-${item.id}`}
          type="number"
          min="0"
          step="1"
          value={item.quantity}
          onChange={(e) => onUpdate(item.id, 'quantity', parseFloat(e.target.value) || 0)}
          className="h-9"
        />
      </div>
      
      <div className="lg:col-span-2">
        <label className="text-xs text-muted-foreground mb-1 block">Unit Price</label>
        <Input
          id={`unitPrice-${item.id}`}
          type="number"
          min="0"
          step="0.01"
          value={item.unitPrice}
          onChange={(e) => onUpdate(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
          className="h-9"
        />
      </div>
      
      <div className="lg:col-span-2">
        <label className="text-xs text-muted-foreground mb-1 block">Tax %</label>
        <Input
          id={`taxRate-${item.id}`}
          type="number"
          min="0"
          max="100"
          step="0.01"
          value={item.taxRate}
          onChange={(e) => onUpdate(item.id, 'taxRate', parseFloat(e.target.value) || 0)}
          className="h-9"
        />
      </div>
      
      <div className="lg:col-span-2">
        <label className="text-xs text-muted-foreground mb-1 block">Discount %</label>
        <Input
          id={`discountPercent-${item.id}`}
          type="number"
          min="0"
          max="100"
          step="0.01"
          value={item.discountPercent}
          onChange={(e) => onUpdate(item.id, 'discountPercent', parseFloat(e.target.value) || 0)}
          className="h-9"
        />
      </div>
      
      <div className="lg:col-span-1 flex items-end justify-between lg:justify-end gap-2">
        <div className="lg:hidden flex-1">
          <label className="text-xs text-muted-foreground mb-1 block">Total</label>
          <div className="font-mono font-medium text-sm h-9 flex items-center">
            {currencySymbol}{lineTotal.toFixed(2)}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(item.id)}
          disabled={!canRemove}
          className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10"
          title="Remove item"
        >
          <Trash size={18} />
        </Button>
      </div>
      
      <div className="hidden lg:block lg:col-span-12">
        <div className="flex justify-end">
          <span className="text-sm text-muted-foreground mr-2">Line Total:</span>
          <span className="font-mono font-medium">{currencySymbol}{lineTotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}
