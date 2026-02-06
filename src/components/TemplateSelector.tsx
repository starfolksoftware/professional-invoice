import { InvoiceTemplate } from '@/lib/types'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Check } from '@phosphor-icons/react'

interface TemplateSelectorProps {
  selectedTemplate: InvoiceTemplate
  onSelect: (template: InvoiceTemplate) => void
}

const templates = [
  {
    id: 'classic' as InvoiceTemplate,
    name: 'Classic',
    description: 'Traditional professional layout',
    preview: 'bg-white border-2 border-primary/20',
    features: ['Clean layout', 'Striped rows', 'Standard formatting']
  },
  {
    id: 'modern' as InvoiceTemplate,
    name: 'Modern',
    description: 'Contemporary gradient header',
    preview: 'bg-gradient-to-br from-primary to-primary/80',
    features: ['Gradient header', 'Card sections', 'Bold typography']
  },
  {
    id: 'minimal' as InvoiceTemplate,
    name: 'Minimal',
    description: 'Clean and sophisticated',
    preview: 'bg-white border border-border/50',
    features: ['Ultra clean', 'Generous spacing', 'Light typography']
  },
  {
    id: 'bold' as InvoiceTemplate,
    name: 'Bold',
    description: 'High contrast statement',
    preview: 'bg-foreground border-4 border-foreground',
    features: ['High contrast', 'Strong borders', 'Impactful design']
  },
  {
    id: 'elegant' as InvoiceTemplate,
    name: 'Elegant',
    description: 'Refined serif styling',
    preview: 'bg-gradient-to-br from-white via-white to-accent/10 border border-accent/30',
    features: ['Serif fonts', 'Subtle gradients', 'Refined details']
  }
]

export function TemplateSelector({ selectedTemplate, onSelect }: TemplateSelectorProps) {
  return (
    <div>
      <Label className="text-base mb-4 block">Invoice Template</Label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((template) => {
          const isSelected = selectedTemplate === template.id
          
          return (
            <Card
              key={template.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                isSelected ? 'ring-2 ring-primary shadow-md' : ''
              }`}
              onClick={() => onSelect(template.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className={`w-16 h-20 rounded ${template.preview} flex-shrink-0 shadow-sm`}>
                    {template.id === 'modern' && (
                      <div className="h-full flex items-end p-2">
                        <div className="w-full h-2 bg-white/30 rounded"></div>
                      </div>
                    )}
                    {template.id === 'minimal' && (
                      <div className="h-full flex flex-col justify-between p-2">
                        <div className="w-8 h-1 bg-foreground/20"></div>
                        <div className="space-y-1">
                          <div className="w-full h-px bg-border"></div>
                          <div className="w-full h-px bg-border"></div>
                        </div>
                      </div>
                    )}
                    {template.id === 'bold' && (
                      <div className="h-full flex flex-col p-2">
                        <div className="w-8 h-2 bg-accent mb-2"></div>
                        <div className="flex-1 bg-background rounded"></div>
                      </div>
                    )}
                    {template.id === 'elegant' && (
                      <div className="h-full flex flex-col justify-between p-2">
                        <div className="w-10 h-1 bg-accent/40 rounded-full"></div>
                        <div className="w-full h-2 bg-accent/20 rounded"></div>
                      </div>
                    )}
                    {template.id === 'classic' && (
                      <div className="h-full flex flex-col justify-end p-2">
                        <div className="space-y-0.5">
                          <div className="w-full h-1 bg-primary/30"></div>
                          <div className="w-full h-1 bg-muted/50"></div>
                          <div className="w-full h-1 bg-primary/30"></div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-foreground">{template.name}</h3>
                      {isSelected && (
                        <div className="flex-shrink-0 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                          <Check size={14} weight="bold" className="text-primary-foreground" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{template.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {template.features.map((feature) => (
                        <span
                          key={feature}
                          className="text-xs bg-muted px-2 py-0.5 rounded text-muted-foreground"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
