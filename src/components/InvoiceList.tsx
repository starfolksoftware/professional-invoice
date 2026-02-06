import { Invoice } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Receipt, Copy, Trash } from '@phosphor-icons/react'
import { formatDate } from '@/lib/invoice-utils'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useState } from 'react'

interface InvoiceListProps {
  invoices: Invoice[]
  currentInvoiceId: string
  onSelect: (invoice: Invoice) => void
  onDuplicate: (invoice: Invoice) => void
  onDelete: (id: string) => void
}

export function InvoiceList({ invoices, currentInvoiceId, onSelect, onDuplicate, onDelete }: InvoiceListProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [invoiceToDelete, setInvoiceToDelete] = useState<string | null>(null)

  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setInvoiceToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (invoiceToDelete) {
      onDelete(invoiceToDelete)
      setInvoiceToDelete(null)
    }
    setDeleteDialogOpen(false)
  }

  if (invoices.length === 0) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        <Receipt size={48} className="mx-auto mb-3 opacity-50" />
        <p className="text-sm">No saved invoices yet</p>
      </div>
    )
  }

  return (
    <>
      <ScrollArea className="h-full">
        <div className="p-4 space-y-2">
          {invoices.map((invoice) => {
            const isSelected = invoice.id === currentInvoiceId
            const currencyData = invoice.currency ? 
              { code: invoice.currency } : 
              { code: 'USD' }

            return (
              <Card
                key={invoice.id}
                className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                  isSelected ? 'ring-2 ring-primary bg-primary/5' : ''
                }`}
                onClick={() => onSelect(invoice)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Receipt size={16} className="text-primary flex-shrink-0" />
                      <span className="font-mono text-sm font-semibold truncate">
                        {invoice.invoiceNumber}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-foreground truncate">
                      {invoice.client.name || 'Unnamed Client'}
                    </p>
                  </div>
                  <Badge variant={invoice.status === 'finalized' ? 'default' : 'secondary'} className="ml-2 flex-shrink-0">
                    {invoice.status}
                  </Badge>
                </div>

                <div className="text-xs text-muted-foreground mb-3">
                  <div>Due: {formatDate(invoice.dueDate)}</div>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDuplicate(invoice)
                    }}
                    className="h-7 px-2 text-xs"
                    title="Duplicate invoice"
                  >
                    <Copy size={14} className="mr-1" />
                    Duplicate
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleDeleteClick(invoice.id, e)}
                    className="h-7 px-2 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                    title="Delete invoice"
                  >
                    <Trash size={14} className="mr-1" />
                    Delete
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      </ScrollArea>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Invoice</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this invoice? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
