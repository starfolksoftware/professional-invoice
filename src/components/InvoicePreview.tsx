import { Invoice } from '@/lib/types'
import { ClassicTemplate } from './templates/ClassicTemplate'
import { ModernTemplate } from './templates/ModernTemplate'
import { MinimalTemplate } from './templates/MinimalTemplate'
import { BoldTemplate } from './templates/BoldTemplate'
import { ElegantTemplate } from './templates/ElegantTemplate'

interface InvoicePreviewProps {
  invoice: Invoice
  currencySymbol: string
}

export function InvoicePreview({ invoice, currencySymbol }: InvoicePreviewProps) {
  const template = invoice.template || 'classic'

  return (
    <div id="invoice-preview-content">
      {template === 'modern' && <ModernTemplate invoice={invoice} currencySymbol={currencySymbol} />}
      {template === 'minimal' && <MinimalTemplate invoice={invoice} currencySymbol={currencySymbol} />}
      {template === 'bold' && <BoldTemplate invoice={invoice} currencySymbol={currencySymbol} />}
      {template === 'elegant' && <ElegantTemplate invoice={invoice} currencySymbol={currencySymbol} />}
      {template === 'classic' && <ClassicTemplate invoice={invoice} currencySymbol={currencySymbol} />}
    </div>
  )
}
