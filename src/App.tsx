import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Invoice, CURRENCIES } from './lib/types'
import { generateInvoiceNumber, getTodayDate, getDefaultDueDate, createEmptyLineItem } from './lib/invoice-utils'
import { InvoiceEditor } from './components/InvoiceEditor'
import { InvoicePreview } from './components/InvoicePreview'
import { InvoiceList } from './components/InvoiceList'
import { Button } from './components/ui/button'
import { Plus, Download, Printer } from '@phosphor-icons/react'
import { printInvoice, downloadInvoiceAsPDF } from './lib/pdf-utils'
import { toast } from 'sonner'
import { Toaster } from './components/ui/sonner'

function createEmptyInvoice(existingInvoices: Invoice[]): Invoice {
  return {
    id: crypto.randomUUID(),
    invoiceNumber: generateInvoiceNumber(existingInvoices),
    issueDate: getTodayDate(),
    dueDate: getDefaultDueDate(),
    currency: 'USD',
    template: 'classic',
    business: {
      name: '',
      address: '',
      email: '',
      phone: '',
    },
    client: {
      name: '',
      address: '',
      email: '',
      phone: '',
    },
    lineItems: [createEmptyLineItem()],
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

function App() {
  const [invoices, setInvoices] = useKV<Invoice[]>('invoices', [])
  const [currentInvoiceId, setCurrentInvoiceId] = useState<string>('')
  const [isMobilePreviewOpen, setIsMobilePreviewOpen] = useState(false)

  const safeInvoices = invoices || []
  const currentInvoice = safeInvoices.find(inv => inv.id === currentInvoiceId)

  useEffect(() => {
    if (safeInvoices.length === 0) {
      const newInvoice = createEmptyInvoice([])
      setInvoices([newInvoice])
      setCurrentInvoiceId(newInvoice.id)
    } else if (!currentInvoiceId) {
      setCurrentInvoiceId(safeInvoices[0].id)
    }
  }, [safeInvoices, currentInvoiceId])

  const handleCreateNew = () => {
    setInvoices((current) => {
      const safeCurrent = current || []
      const newInvoice = createEmptyInvoice(safeCurrent)
      setCurrentInvoiceId(newInvoice.id)
      toast.success('New invoice created')
      return [...safeCurrent, newInvoice]
    })
  }

  const handleUpdateInvoice = (updates: Partial<Invoice>) => {
    if (!currentInvoiceId) return

    setInvoices((current) => {
      const safeCurrent = current || []
      return safeCurrent.map(inv =>
        inv.id === currentInvoiceId
          ? { ...inv, ...updates, updatedAt: new Date().toISOString() }
          : inv
      )
    })
  }

  const handleSelectInvoice = (invoice: Invoice) => {
    setCurrentInvoiceId(invoice.id)
    setIsMobilePreviewOpen(false)
  }

  const handleDuplicateInvoice = (invoice: Invoice) => {
    setInvoices((current) => {
      const safeCurrent = current || []
      const duplicated: Invoice = {
        ...invoice,
        id: crypto.randomUUID(),
        invoiceNumber: generateInvoiceNumber(safeCurrent),
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setCurrentInvoiceId(duplicated.id)
      toast.success('Invoice duplicated')
      return [...safeCurrent, duplicated]
    })
  }

  const handleDeleteInvoice = (id: string) => {
    setInvoices((current) => {
      const safeCurrent = current || []
      const filtered = safeCurrent.filter(inv => inv.id !== id)
      
      if (id === currentInvoiceId) {
        if (filtered.length > 0) {
          setCurrentInvoiceId(filtered[0].id)
        } else {
          const newInvoice = createEmptyInvoice([])
          setCurrentInvoiceId(newInvoice.id)
          toast.success('Invoice deleted')
          return [newInvoice]
        }
      }
      
      toast.success('Invoice deleted')
      return filtered
    })
  }

  const handleDownloadPDF = () => {
    if (!currentInvoice) return
    downloadInvoiceAsPDF(currentInvoice.invoiceNumber)
    toast.success('Downloading invoice...')
  }

  const handlePrint = () => {
    printInvoice()
  }

  if (!currentInvoice) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
          <p className="text-muted-foreground">Loading invoice...</p>
        </div>
      </div>
    )
  }

  const currencyData = CURRENCIES.find(c => c.code === currentInvoice.currency)
  const currencySymbol = currencyData?.symbol || '$'

  return (
    <>
      <div className="min-h-screen bg-muted/30">
        <header className="bg-background border-b border-border sticky top-0 z-10 no-print">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-foreground">Invoice Generator</h1>
                <p className="text-sm text-muted-foreground">Create professional invoices instantly</p>
              </div>
              
              <div className="flex items-center gap-2">
                <Button onClick={handlePrint} variant="outline" size="sm" className="gap-2">
                  <Printer size={18} />
                  <span className="hidden sm:inline">Print</span>
                </Button>
                <Button onClick={handleDownloadPDF} variant="outline" size="sm" className="gap-2">
                  <Download size={18} />
                  <span className="hidden sm:inline">Download PDF</span>
                </Button>
                <Button onClick={handleCreateNew} size="sm" className="gap-2">
                  <Plus size={18} />
                  <span className="hidden sm:inline">New Invoice</span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <aside className="lg:col-span-3 no-print">
              <div className="bg-background rounded-lg border border-border shadow-sm">
                <div className="p-4 border-b border-border">
                  <h2 className="font-semibold text-foreground">Saved Invoices</h2>
                  <p className="text-xs text-muted-foreground mt-1">{safeInvoices.length} total</p>
                </div>
                <div className="h-[calc(100vh-280px)]">
                  <InvoiceList
                    invoices={safeInvoices}
                    currentInvoiceId={currentInvoiceId}
                    onSelect={handleSelectInvoice}
                    onDuplicate={handleDuplicateInvoice}
                    onDelete={handleDeleteInvoice}
                  />
                </div>
              </div>
            </aside>

            <main className="lg:col-span-5 no-print">
              <InvoiceEditor
                invoice={currentInvoice}
                onUpdate={handleUpdateInvoice}
              />
            </main>

            <aside className="lg:col-span-4 hidden lg:block">
              <div className="sticky top-24">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="font-semibold text-foreground">Preview</h2>
                </div>
                <div className="max-h-[calc(100vh-140px)] overflow-auto">
                  <InvoicePreview
                    invoice={currentInvoice}
                    currencySymbol={currencySymbol}
                  />
                </div>
              </div>
            </aside>

            <div className="lg:hidden fixed bottom-4 right-4 no-print">
              <Button
                size="lg"
                onClick={() => setIsMobilePreviewOpen(!isMobilePreviewOpen)}
                className="rounded-full shadow-lg"
              >
                {isMobilePreviewOpen ? 'Close' : 'Preview'}
              </Button>
            </div>

            {isMobilePreviewOpen && (
              <div className="lg:hidden fixed inset-0 bg-background z-20 overflow-auto p-4 no-print">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-semibold text-foreground text-lg">Invoice Preview</h2>
                  <Button onClick={() => setIsMobilePreviewOpen(false)} variant="outline">
                    Close
                  </Button>
                </div>
                <InvoicePreview
                  invoice={currentInvoice}
                  currencySymbol={currencySymbol}
                />
              </div>
            )}
          </div>
        </div>

        <div className="hidden print:block">
          <InvoicePreview
            invoice={currentInvoice}
            currencySymbol={currencySymbol}
          />
        </div>

        <footer className="bg-background border-t border-border py-6 mt-12 no-print">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm text-muted-foreground">
              Created by{' '}
              <a 
                href="https://starfolksoftware.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                Starfolk Software Technology Limited
              </a>
            </p>
          </div>
        </footer>
      </div>
      <Toaster />
    </>
  )
}

export default App
