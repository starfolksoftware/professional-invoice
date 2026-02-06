import { Invoice, InvoiceLineItem, CURRENCIES } from '@/lib/types'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Plus, UploadSimple } from '@phosphor-icons/react'
import { LineItemRow } from './LineItemRow'
import { createEmptyLineItem } from '@/lib/invoice-utils'
import { TemplateSelector } from './TemplateSelector'

interface InvoiceEditorProps {
  invoice: Invoice
  onUpdate: (updates: Partial<Invoice>) => void
}

export function InvoiceEditor({ invoice, onUpdate }: InvoiceEditorProps) {
  const currencyData = CURRENCIES.find(c => c.code === invoice.currency)
  const currencySymbol = currencyData?.symbol || '$'

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Logo file size must be less than 2MB')
        return
      }
      
      const reader = new FileReader()
      reader.onloadend = () => {
        onUpdate({
          business: {
            ...invoice.business,
            logo: reader.result as string
          }
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const updateBusinessField = (field: keyof Invoice['business'], value: string) => {
    onUpdate({
      business: {
        ...invoice.business,
        [field]: value
      }
    })
  }

  const updateClientField = (field: keyof Invoice['client'], value: string) => {
    onUpdate({
      client: {
        ...invoice.client,
        [field]: value
      }
    })
  }

  const addLineItem = () => {
    onUpdate({
      lineItems: [...invoice.lineItems, createEmptyLineItem()]
    })
  }

  const updateLineItem = (id: string, field: keyof InvoiceLineItem, value: string | number) => {
    onUpdate({
      lineItems: invoice.lineItems.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    })
  }

  const removeLineItem = (id: string) => {
    onUpdate({
      lineItems: invoice.lineItems.filter(item => item.id !== id)
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <Accordion type="single" collapsible defaultValue="template-style">
          <AccordionItem value="template-style" className="border-0">
            <CardHeader className="pb-0">
              <AccordionTrigger className="hover:no-underline py-4">
                <CardTitle className="text-lg">Template Style</CardTitle>
              </AccordionTrigger>
            </CardHeader>
            <AccordionContent>
              <CardContent className="pt-4">
                <TemplateSelector
                  selectedTemplate={invoice.template || 'classic'}
                  onSelect={(template) => onUpdate({ template })}
                />
              </CardContent>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Invoice Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="invoiceNumber">Invoice Number</Label>
              <Input
                id="invoiceNumber"
                value={invoice.invoiceNumber}
                onChange={(e) => onUpdate({ invoiceNumber: e.target.value })}
                className="font-mono"
              />
            </div>
            
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select value={invoice.currency} onValueChange={(value) => onUpdate({ currency: value })}>
                <SelectTrigger id="currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map(curr => (
                    <SelectItem key={curr.code} value={curr.code}>
                      {curr.symbol} - {curr.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="issueDate">Issue Date</Label>
              <Input
                id="issueDate"
                type="date"
                value={invoice.issueDate}
                onChange={(e) => onUpdate({ issueDate: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={invoice.dueDate}
                onChange={(e) => onUpdate({ dueDate: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Business Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="logo-upload">Business Logo</Label>
            <div className="flex items-center gap-4 mt-2">
              {invoice.business.logo && (
                <img 
                  src={invoice.business.logo} 
                  alt="Logo preview" 
                  className="h-16 w-16 object-contain border rounded"
                />
              )}
              <label htmlFor="logo-upload" className="cursor-pointer">
                <div className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-muted transition-colors">
                  <UploadSimple size={18} />
                  <span className="text-sm">{invoice.business.logo ? 'Change Logo' : 'Upload Logo'}</span>
                </div>
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div>
            <Label htmlFor="businessName">Business Name</Label>
            <Input
              id="businessName"
              value={invoice.business.name}
              onChange={(e) => updateBusinessField('name', e.target.value)}
              placeholder="Your Company Name"
            />
          </div>

          <div>
            <Label htmlFor="businessAddress">Address</Label>
            <Textarea
              id="businessAddress"
              value={invoice.business.address}
              onChange={(e) => updateBusinessField('address', e.target.value)}
              placeholder="123 Business St, City, State ZIP"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="businessEmail">Email</Label>
              <Input
                id="businessEmail"
                type="email"
                value={invoice.business.email}
                onChange={(e) => updateBusinessField('email', e.target.value)}
                placeholder="contact@business.com"
              />
            </div>
            
            <div>
              <Label htmlFor="businessPhone">Phone</Label>
              <Input
                id="businessPhone"
                type="tel"
                value={invoice.business.phone}
                onChange={(e) => updateBusinessField('phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Client Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="clientName">Client Name</Label>
            <Input
              id="clientName"
              value={invoice.client.name}
              onChange={(e) => updateClientField('name', e.target.value)}
              placeholder="Client Company Name"
            />
          </div>

          <div>
            <Label htmlFor="clientAddress">Address</Label>
            <Textarea
              id="clientAddress"
              value={invoice.client.address}
              onChange={(e) => updateClientField('address', e.target.value)}
              placeholder="456 Client Ave, City, State ZIP"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="clientEmail">Email</Label>
              <Input
                id="clientEmail"
                type="email"
                value={invoice.client.email}
                onChange={(e) => updateClientField('email', e.target.value)}
                placeholder="client@company.com"
              />
            </div>
            
            <div>
              <Label htmlFor="clientPhone">Phone</Label>
              <Input
                id="clientPhone"
                type="tel"
                value={invoice.client.phone}
                onChange={(e) => updateClientField('phone', e.target.value)}
                placeholder="+1 (555) 987-6543"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-lg">Line Items</CardTitle>
          <Button onClick={addLineItem} size="sm" className="gap-2">
            <Plus size={18} />
            Add Item
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {invoice.lineItems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
              <p className="mb-2">No items added yet</p>
              <Button onClick={addLineItem} variant="outline" size="sm" className="gap-2">
                <Plus size={18} />
                Add Your First Item
              </Button>
            </div>
          ) : (
            invoice.lineItems.map((item) => (
              <LineItemRow
                key={item.id}
                item={item}
                currencySymbol={currencySymbol}
                onUpdate={updateLineItem}
                onRemove={removeLineItem}
                canRemove={invoice.lineItems.length > 1}
              />
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Additional Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            id="notes"
            value={invoice.notes || ''}
            onChange={(e) => onUpdate({ notes: e.target.value })}
            placeholder="Payment terms, thank you note, or other details..."
            rows={4}
          />
        </CardContent>
      </Card>
    </div>
  )
}
