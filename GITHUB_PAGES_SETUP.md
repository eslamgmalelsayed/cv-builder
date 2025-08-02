# GitHub Pages Deployment Guide

This guide will help you deploy your CV Builder to GitHub Pages for free hosting.

## Prerequisites

- A GitHub account
- Your CV Builder repository pushed to GitHub

## Setup Instructions

### 1. Repository Configuration

Make sure your repository name matches the expected path. If your repository is named something other than `cv-builder`, update the `basePath` in `next.config.mjs`:

```javascript
basePath: process.env.NODE_ENV === 'production' ? '/your-repo-name' : '',
assetPrefix: process.env.NODE_ENV === 'production' ? '/your-repo-name/' : '',
```

### 2. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings** tab
3. Scroll down to **Pages** section in the left sidebar
4. Under **Source**, select **GitHub Actions**

### 3. Set up Environment Variables (Optional)

For AI-powered suggestions, you can add your Groq API key:

1. Go to **Settings** > **Secrets and variables** > **Actions**
2. Click **New repository secret**
3. Name: `GROQ_API_KEY`
4. Value: Your Groq API key from https://console.groq.com/
5. Click **Add secret**

### 4. Deploy

The deployment will start automatically when you push to the main/master branch. You can also manually trigger it:

1. Go to **Actions** tab
2. Click on **Deploy to GitHub Pages** workflow
3. Click **Run workflow**

### 5. Access Your Site

Once deployed, your CV Builder will be available at:
```
https://yourusername.github.io/cv-builder/
```

## Features

### With API Key (Full Features)
- ✅ AI-powered ATS analysis
- ✅ Smart CV suggestions
- ✅ Industry-specific recommendations
- ✅ Advanced content optimization

### Without API Key (Basic Features)
- ✅ CV builder with all form fields
- ✅ Multiple themes and templates
- ✅ PDF export functionality
- ✅ Basic ATS scoring
- ✅ Local suggestion engine
- ✅ Responsive design

## Customization

### Adding Your Own Domain

1. Create a `CNAME` file in the `public` folder with your domain name
2. Configure your domain's DNS to point to GitHub Pages
3. Enable custom domain in repository settings

### Updating Styles

- Edit files in the `styles/` directory
- Modify Tailwind classes in components
- Update theme configurations

### Adding Features

Since this is a static deployment, all features must be client-side:
- No server-side API routes
- Use client-side libraries for additional functionality
- Consider external services for complex features

## Troubleshooting

### Build Failures

Check the Actions tab for build logs. Common issues:
- Missing dependencies in `package.json`
- TypeScript errors
- Environment variable issues

### Page Not Loading

- Verify the `basePath` configuration matches your repository name
- Check that GitHub Pages is enabled
- Ensure the workflow completed successfully

### API Features Not Working

- Verify `GROQ_API_KEY` is set in repository secrets
- Check browser console for errors
- Ensure API key has proper permissions

## Support

For issues specific to GitHub Pages deployment:
- Check GitHub Status: https://www.githubstatus.com/
- Review GitHub Pages documentation: https://docs.github.com/pages
- Check the Actions workflow logs for detailed error messages

## Security Notes

- API keys are exposed on the client side in static deployments
- Use services with domain restrictions when possible
- Consider rate limiting and usage monitoring
- For sensitive applications, consider server-side hosting alternatives

## Alternative Hosting

If you need server-side functionality, consider:
- **Vercel**: Free tier with serverless functions
- **Netlify**: Free tier with edge functions  
- **Railway**: Container-based hosting
- **Digital Ocean**: VPS hosting

Each offers different benefits for Next.js applications with API routes.
