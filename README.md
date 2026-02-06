# Invoice Generator

A modern, responsive invoice generator web application built with React, TypeScript, and Tailwind CSS.

## Features

- **Create & Manage Invoices**: Create, edit, duplicate, and delete invoices
- **Business & Client Details**: Input comprehensive business and client information
- **Line Items**: Add multiple line items with descriptions, quantities, prices, tax, and discounts
- **Multi-Currency Support**: Supports USD, EUR, GBP, NGN, and other African currencies
- **Professional Templates**: Choose from multiple invoice templates
- **PDF Export**: Download invoices as PDF and print-ready formats
- **Local Storage**: All data persists locally in your browser
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## GitHub Pages Deployment

This project is optimized for GitHub Pages deployment.

### Setup Instructions

1. **Enable GitHub Pages in your repository**:
   - Go to Settings > Pages
   - Under "Build and deployment", select "GitHub Actions" as the source

2. **Update the base path**:
   - Open `vite.config.ts`
   - Change the base path from `/spark-template/` to `/<your-repo-name>/`
   ```typescript
   base: process.env.GITHUB_PAGES === 'true' ? '/<your-repo-name>/' : '/',
   ```

3. **Deploy**:
   - Push to the `main` branch
   - The GitHub Actions workflow will automatically build and deploy your app
   - Your app will be available at `https://<your-username>.github.io/<your-repo-name>/`

### Manual Deployment

You can also build and deploy manually:

```bash
# Build for GitHub Pages
npm run build:gh-pages

# Or use the deploy script
npm run deploy
```

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Tech Stack

- **React 19** with TypeScript
- **Vite** for fast builds and development
- **Tailwind CSS** for styling
- **Shadcn UI** components
- **Radix UI** primitives
- **Framer Motion** for animations
- **Phosphor Icons** for iconography

## Browser Support

Works on all modern browsers with localStorage support.

## License

MIT License - Copyright GitHub, Inc.
