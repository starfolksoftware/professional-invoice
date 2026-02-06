# Product Requirements Document: Online Invoice Generator

A professional, full-featured invoice generator that enables users to create, manage, and export polished invoices with real-time preview capabilities and persistent storage.

**Experience Qualities**:
1. **Efficient** - Streamlined workflow that minimizes steps from data entry to finished invoice
2. **Professional** - Clean, business-appropriate aesthetic that inspires confidence in generated documents
3. **Intuitive** - Self-explanatory interface requiring no learning curve or documentation

**Complexity Level**: Light Application (multiple features with basic state)
This is a single-purpose tool with multiple interconnected features (CRUD operations, calculations, PDF export) but maintains focused functionality around invoice generation without complex routing or user management systems.

## Essential Features

### Invoice CRUD Operations
- **Functionality**: Create new invoices, edit existing ones, duplicate for reuse, and delete unwanted invoices
- **Purpose**: Core workflow management enabling users to maintain an invoice library
- **Trigger**: Action buttons in invoice list and header toolbar
- **Progression**: Click "New Invoice" → Fill form fields → Auto-save to storage → Appear in invoice list → Select to edit → Modify fields → Changes persist → Delete via action menu
- **Success criteria**: Invoices persist across sessions, changes save automatically, deletion removes from list immediately

### Business & Client Information Management
- **Functionality**: Input and store sender/receiver details including logo upload, contact information, addresses
- **Purpose**: Reusable business identity and client database for faster invoice creation
- **Trigger**: Form fields in invoice editor with autocomplete for previously used clients
- **Progression**: Upload logo → Input business details → Enter client info → Autocomplete suggests past clients → Select or create new → Details populate invoice
- **Success criteria**: Logo displays properly on invoice, details persist, autocomplete works after first use

### Dynamic Line Items with Calculations
- **Functionality**: Add/remove line items with description, quantity, unit price, individual tax rates, and discounts
- **Purpose**: Flexible itemization with accurate automatic calculations
- **Trigger**: "Add Item" button and inline remove buttons
- **Progression**: Click add item → Fill description/qty/price → Apply tax/discount → See line total update → Subtotal recalculates → Tax applied → Discount deducted → Grand total updates
- **Success criteria**: All calculations accurate to 2 decimals, updates happen instantly, supports multiple items without performance degradation

### Multi-Currency Support
- **Functionality**: Select from major world currencies with proper symbol display
- **Purpose**: International business capability
- **Trigger**: Currency dropdown in invoice header
- **Progression**: Open currency selector → Choose from list → All amounts display with correct symbol → Currency saves with invoice
- **Success criteria**: Symbols display correctly, formatting matches currency conventions, currency persists per invoice

### Invoice Numbering & Dating
- **Functionality**: Auto-generated sequential invoice numbers with manual override, issue date and due date pickers
- **Purpose**: Professional invoice tracking and payment terms
- **Trigger**: Automatic on new invoice creation
- **Progression**: Create invoice → Number auto-generates (INV-001, INV-002...) → Set issue date (defaults to today) → Set due date → Terms calculate automatically
- **Success criteria**: No duplicate numbers, dates validate properly, sequence continues across sessions

### Real-Time Invoice Preview
- **Functionality**: Live-updating professional invoice document displayed alongside edit form
- **Purpose**: Immediate visual feedback and WYSIWYG editing experience
- **Trigger**: Continuous during editing
- **Progression**: User types in field → Preview updates instantly → Format maintains professional appearance → Layout adjusts responsively
- **Success criteria**: Preview updates within 100ms, matches PDF output exactly, remains readable at all screen sizes

### PDF Export & Print
- **Functionality**: Generate downloadable PDF and print-optimized view
- **Purpose**: Professional document delivery to clients
- **Trigger**: Export and Print buttons in toolbar
- **Progression**: Click Export → PDF generates with all current data → Download dialog appears → File saves with invoice number as filename
- **Success criteria**: PDF matches preview exactly, fonts render correctly, file size < 500KB, prints cleanly without browser chrome

### Data Persistence
- **Functionality**: All invoice data stored locally using useKV persistence
- **Purpose**: Work continuity and invoice history
- **Trigger**: Automatic on every change
- **Progression**: User makes change → Data serializes → Saves to KV store → Survives browser close → Loads on next session
- **Success criteria**: Zero data loss between sessions, saves complete within 100ms, handles 100+ invoices without slowdown

## Edge Case Handling

- **Empty Invoices**: Show helpful placeholder text guiding users to add first line item
- **Zero Amounts**: Allow zero-value items for complementary services, handle gracefully in totals
- **Negative Discounts**: Validate discount fields to prevent negative values, show error state
- **Missing Required Fields**: Highlight incomplete fields before PDF generation, block export until valid
- **Large Item Lists**: Virtual scrolling for 50+ line items, maintain performance
- **Image Upload Failures**: Show upload error state, allow retry, suggest smaller file size
- **Invalid Dates**: Prevent due date before issue date, validate date formats
- **Duplicate Invoice Numbers**: Warn user and offer auto-increment to next available
- **Currency Symbol Conflicts**: Properly encode special characters in PDF export
- **Browser Storage Limits**: Handle gracefully with warning when approaching limits

## Design Direction

The design should evoke **professional confidence and operational efficiency**. It should feel like premium business software—trusted, capable, and polished—while maintaining approachability through clean layouts and clear hierarchy. The aesthetic should balance modern sophistication with timeless business professionalism, avoiding trends that might feel dated quickly.

## Color Selection

A refined professional palette with trustworthy blues and crisp neutrals, accented with purpose-driven highlights.

- **Primary Color**: Deep Professional Blue (oklch(0.45 0.15 250)) - Conveys trust, stability, and business credibility. Used for primary actions and key interactive elements.
- **Secondary Colors**: 
  - Crisp Slate (oklch(0.35 0.02 250)) - Supporting structure for secondary actions
  - Warm Grey (oklch(0.65 0.01 250)) - Muted backgrounds for secondary cards
- **Accent Color**: Energetic Cyan (oklch(0.70 0.12 210)) - Draws attention to CTAs and active states, energizing the interface without overwhelming
- **Foreground/Background Pairings**:
  - Background (Pure White oklch(1 0 0)): Dark Text (oklch(0.20 0.01 250)) - Ratio 14.2:1 ✓
  - Primary (Deep Blue oklch(0.45 0.15 250)): White Text (oklch(1 0 0)) - Ratio 6.8:1 ✓
  - Accent (Energetic Cyan oklch(0.70 0.12 210)): Dark Text (oklch(0.20 0.01 250)) - Ratio 5.2:1 ✓
  - Secondary (Crisp Slate oklch(0.35 0.02 250)): White Text (oklch(1 0 0)) - Ratio 9.1:1 ✓
  - Muted (Light Grey oklch(0.96 0.005 250)): Dark Text (oklch(0.20 0.01 250)) - Ratio 13.8:1 ✓

## Font Selection

Typography should communicate professionalism and precision—the qualities essential to financial documents—while maintaining excellent readability across all interface sizes.

- **Primary Typeface**: Inter (Display and UI) - Modern, highly legible sans-serif with excellent number rendering
- **Secondary Typeface**: JetBrains Mono (Invoice numbers and amounts) - Monospace for precise alignment of numerical data

**Typographic Hierarchy**:
- H1 (Page Title): Inter SemiBold / 32px / -0.02em letter spacing / 1.2 line height
- H2 (Section Headers): Inter SemiBold / 24px / -0.01em letter spacing / 1.3 line height
- H3 (Card Titles): Inter Medium / 18px / normal letter spacing / 1.4 line height
- Body (Form Labels): Inter Regular / 14px / normal letter spacing / 1.5 line height
- Body Large (Invoice Content): Inter Regular / 16px / normal letter spacing / 1.6 line height
- Caption (Helper Text): Inter Regular / 12px / normal letter spacing / 1.4 line height
- Numbers (Amounts): JetBrains Mono Medium / 16px / tabular-nums / right-aligned

## Animations

Animations should reinforce the sense of precision and responsiveness, using subtle movements that guide attention and confirm actions without creating delays.

**Functional Animations**:
- Form field focus: 150ms ease-out scale and glow effect on focus ring
- Button interactions: 100ms ease-out background color shifts on hover, 50ms scale down on press
- Invoice preview updates: 200ms ease-in-out fade for content changes to reduce jarring updates
- Add/remove line items: 250ms ease-out height animation with fade, feeling smooth and intentional
- Modal appearances: 200ms ease-out scale from 0.95 with fade, establishing spatial relationship
- Success confirmations: 300ms bounce on checkmark icons after save/export actions

**Delightful Moments**:
- PDF export button: Subtle download icon animation (arrow slides down) during generation
- Invoice number increment: Brief highlight flash on number when auto-generated
- Total calculation: Gentle pulse effect when grand total changes significantly (>10%)

## Component Selection

**Components**:
- **Card**: Primary container for invoice editor and preview, using subtle shadows for depth
- **Input/Textarea**: All text entry fields with clear labels, focus states with blue ring, error states with red borders
- **Button**: Primary (filled blue), Secondary (outlined slate), Ghost (text-only for tertiary actions)
- **Select**: Currency chooser, template selector with custom dropdown styling
- **Dialog**: Confirmation modals for delete actions and unsaved changes warnings
- **Popover**: Date pickers for issue/due dates, positioned intelligently near trigger
- **Table**: Line items display with alternating row backgrounds for scanability
- **Badge**: Status indicators (Draft, Paid, Overdue) with color-coded backgrounds
- **Separator**: Subtle dividers between invoice sections
- **ScrollArea**: Invoice list sidebar for when users have many saved invoices
- **Avatar**: Fallback display when no business logo uploaded
- **Skeleton**: Loading states during PDF generation and initial data load

**Customizations**:
- Custom file upload component with drag-and-drop for logo with preview thumbnail
- Custom currency input with proper symbol placement and decimal handling
- Custom line item row component with inline add/remove and calculation display
- Custom invoice preview component matching print styles exactly

**States**:
- Buttons: Default → Hover (background lightens 5%) → Active (scale 0.98) → Loading (spinner) → Success (checkmark) → Disabled (reduced opacity)
- Inputs: Empty → Focused (blue ring) → Filled → Error (red ring + message) → Disabled (grey background)
- Invoices: Draft → Finalized (darker badge) → Archived (greyed out)

**Icon Selection** (from @phosphor-icons/react):
- Invoice: `Receipt` for invoice representation in lists
- Add: `Plus` for new invoice and line items
- Edit: `PencilSimple` for edit actions
- Delete: `Trash` for remove/delete operations
- Duplicate: `Copy` for invoice duplication
- Export: `Download` for PDF generation
- Print: `Printer` for print action
- Upload: `UploadSimple` for logo uploads
- Currency: `CurrencyDollar` for currency selection
- Calendar: `Calendar` for date pickers
- Client: `User` for client information
- Business: `Buildings` for business details
- Calculate: `Calculator` for totals section

**Spacing**:
- Container padding: p-6 (24px) for main content areas
- Card internal padding: p-6 for invoice editor and preview
- Section gaps: gap-8 (32px) between major sections
- Form field gaps: gap-4 (16px) between related inputs
- Line item gaps: gap-2 (8px) for tight grouping within rows
- Button padding: px-6 py-2 for primary, px-4 py-2 for secondary
- Horizontal layout gaps: gap-6 for side-by-side split editor/preview

**Mobile**:
- Two-column editor/preview stacks to single column below 1024px
- Invoice preview becomes expandable accordion on mobile rather than always visible
- Line item table becomes stacked cards on screens <768px
- Touch targets minimum 44px height for all interactive elements
- Bottom sheet for currency/template selectors on mobile
- Sticky header with primary actions remains accessible during scroll
- Form fields full-width on mobile with consistent 16px horizontal padding
