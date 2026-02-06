# GitHub Pages Deployment Guide

This project includes everything needed to deploy to GitHub Pages.

## Quick Start

1. **Fork or clone this repository**

2. **Enable GitHub Pages**:
   - Go to your repository Settings
   - Navigate to "Pages" in the sidebar
   - Under "Build and deployment", select **"GitHub Actions"**

3. **Configure the base path** (Important!):
   - Open `vite.config.ts`
   - Update line 13 to match your repository name:
   ```typescript
   base: process.env.GITHUB_PAGES === 'true' ? '/<YOUR-REPO-NAME>/' : '/',
   ```
   - Replace `<YOUR-REPO-NAME>` with your actual repository name

4. **Push to main branch**:
   ```bash
   git add .
   git commit -m "Configure for GitHub Pages"
   git push origin main
   ```

5. **Wait for deployment**:
   - Go to the "Actions" tab in your repository
   - Watch the deployment workflow run
   - Once complete, your site will be live!

## Accessing Your Site

Your invoice generator will be available at:
```
https://<your-username>.github.io/<your-repo-name>/
```

## Manual Build

To build locally for testing:

```bash
# Build with GitHub Pages configuration
npm run build:gh-pages

# Preview the build
npm run preview
```

## Troubleshooting

### Site shows blank page
- Check that the `base` path in `vite.config.ts` matches your repository name exactly
- Ensure it has leading and trailing slashes: `'/repo-name/'`

### 404 errors on navigation
- Verify GitHub Pages is set to use "GitHub Actions" not "Deploy from branch"

### Workflow fails
- Check that all dependencies are in `package.json`
- Ensure Node version in workflow (20) matches your development environment

## Custom Domain

To use a custom domain with your GitHub Pages site:

### Step 1: Add CNAME file
1. Create a `CNAME` file in the `public` folder containing your domain (e.g., `www.example.com` or `example.com`)
2. Commit and push the changes

### Step 2: Configure DNS Records

**Yes, you MUST configure DNS records with your domain provider.**

#### For Apex Domains (example.com)
Add **A records** pointing to GitHub's IP addresses:
```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

Example DNS configuration:
| Type | Name | Value |
|------|------|-------|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |

#### For Subdomains (www.example.com or docs.example.com)
Add a **CNAME record** pointing to your GitHub Pages domain:
```
<your-username>.github.io
```

Example DNS configuration:
| Type | Name | Value |
|------|------|-------|
| CNAME | www | your-username.github.io |

**Note**: DNS changes can take up to 24 hours to propagate, but typically take effect within a few minutes to hours.

### Step 3: Configure in GitHub Pages Settings
1. Go to your repository Settings
2. Navigate to "Pages" in the sidebar
3. Under "Custom domain", enter your domain (e.g., `www.example.com`)
4. Click "Save"
5. Wait for the DNS check to complete (a green checkmark will appear)
6. Enable "Enforce HTTPS" (recommended, available after DNS verification)

### Troubleshooting Custom Domains
- **DNS check failing?** Verify your DNS records are correct using `dig` or `nslookup`
- **Certificate errors?** Wait a few minutes for HTTPS certificate provisioning
- **Site not loading?** Ensure the `CNAME` file is in the `public` folder and deployed

## Environment Variables

The build automatically sets `GITHUB_PAGES=true` when using the deploy workflow or `build:gh-pages` script. For local development, this defaults to `false` and uses `/` as the base path.
