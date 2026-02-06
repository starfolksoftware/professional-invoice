export function printInvoice() {
  window.print()
}

export function downloadInvoiceAsPDF(invoiceNumber: string) {
  const printWindow = window.open('', '_blank')
  if (!printWindow) {
    alert('Please allow popups to download PDF')
    return
  }

  const content = document.getElementById('invoice-preview-content')
  if (!content) return

  const styles = Array.from(document.styleSheets)
    .map(styleSheet => {
      try {
        return Array.from(styleSheet.cssRules)
          .map(rule => rule.cssText)
          .join('\n')
      } catch (e) {
        return ''
      }
    })
    .join('\n')

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${invoiceNumber}</title>
        <style>${styles}</style>
        <style>
          @media print {
            @page { margin: 0.5in; }
            body { margin: 0; padding: 20px; }
          }
        </style>
      </head>
      <body>
        ${content.innerHTML}
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 100);
          }
        </script>
      </body>
    </html>
  `)
  printWindow.document.close()
}
