# Render Build & Deployment Guide

This guide explains the build and deployment process for our application on Render.com, with specific focus on when and how builds occur.

## Render Build Process Overview

Render offers an automated build and deployment pipeline that works as follows:

1. You push code to your GitHub repository
2. Render detects the changes and pulls the latest code
3. Render executes the build command specified in `render.yaml` or the dashboard
4. If the build succeeds, Render deploys the application using the start command

## Local Build vs. Render Build

### Do I Need to Build Locally Before Deploying?

**No, you do not need to build the application locally before pushing to GitHub.**

Render automatically builds your application using the `buildCommand` specified in your `render.yaml` file:

```yaml
buildCommand: npm install && npm run build
```

This command:
1. Installs all dependencies (`npm install`)
2. Runs the build script from package.json (`npm run build`)
3. Which compiles TypeScript and builds the Vite frontend (`tsc && vite build`)

### Advantages of Render's Build Process

1. **Consistent Environment**: Builds occur in the same environment where the app will run
2. **Infrastructure as Code**: Build configuration is version-controlled in `render.yaml`
3. **No Local Build Required**: Push code changes directly without building locally
4. **Build Logs**: Detailed build logs are available in the Render dashboard
5. **Automatic Dependency Installation**: Dependencies are automatically installed

### When You Might Want to Build Locally First

While not required, building locally before pushing has some advantages:

1. **Early Error Detection**: Catch build errors before they reach the deployment pipeline
2. **Faster Feedback**: Get immediate feedback on build issues
3. **Testing Production Build**: Verify the production build works correctly
4. **Save Build Minutes**: If you're on a limited plan, local builds save Render build minutes

## Deployment & Redeployment Checklist

### First-Time Deployment Checklist

1. **Repository Setup**:
   - Ensure your code is pushed to GitHub
   - Verify `render.yaml` exists with proper configuration

2. **Render Service Setup**:
   - Create a new Web Service in Render dashboard
   - Connect to your GitHub repository
   - Confirm build and start commands

3. **Environment Variables**:
   - Set required environment variables in Render dashboard:
     - `NODE_ENV=production`
     - `PORT=10000`
     - `EMAIL_SERVICE`, `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_RECIPIENT` (if using email)

4. **Initial Deployment**:
   - Let Render build and deploy your application
   - Monitor build logs for any issues
   - Check the deployed application URL

### Redeployment Checklist

For subsequent deployments after code changes:

1. **Code Changes**:
   - Make and test changes locally
   - Ensure there are no build errors locally (optional but recommended)
   - Commit changes to your repository

2. **Push to GitHub**:
   - Push your changes to the branch connected to Render
   - Render will automatically detect changes and start a new deployment

3. **Monitor Deployment**:
   - Check Render dashboard for build status
   - Review build logs if issues occur
   - Test the application once deployment completes

4. **Environment Variable Changes**:
   - If you've added new environment variables, update them in Render dashboard
   - Manually trigger a redeployment if environment variables were changed

### Manual Redeployment

If you need to redeploy without code changes:

1. Go to your service in the Render dashboard
2. Click "Manual Deploy" and select "Clear build cache & deploy"

## Troubleshooting Build Issues

### Common Build Failures

1. **Missing Dependencies**:
   - Check if all dependencies are listed in package.json
   - Ensure necessary dev dependencies are not in devDependencies if needed during build

2. **Build Script Errors**:
   - Review build logs in Render dashboard
   - Try building locally with `npm run build` to reproduce errors

3. **Environment Variable Issues**:
   - Verify all required environment variables are set in Render
   - Check for environment variables used in build process

4. **Node.js Version Mismatch**:
   - Check if your application requires a specific Node.js version
   - Set Node.js version in package.json engines field if needed

## Advanced Build Configuration

### Custom Build Scripts

Our application uses the standard build script in package.json:

```json
"build": "tsc && vite build"
```

If you need to customize the build process:

1. Update the `build` script in package.json
2. Render will use the updated script automatically

### Prebuild Scripts

For more complex builds, consider adding a prebuild script:

1. Create a `prebuild.sh` file with setup commands
2. Update package.json to include a render-prebuild script
3. Update buildCommand in render.yaml to run the prebuild script

Example:
```json
"scripts": {
  "render-prebuild": "chmod +x prebuild.sh && ./prebuild.sh",
  "build": "tsc && vite build"
}
```

### Build Cache

Render caches node_modules between builds to speed up the process. To clear the cache:

1. Go to your service in Render dashboard
2. Click "Manual Deploy"
3. Select "Clear build cache & deploy"

## Email Configuration with Builds

Our application uses different email configurations depending on the environment:

- **Development**: Uses Ethereal for test emails (no real emails sent)
- **Production**: Uses real email service (Gmail/Outlook)

When deploying to Render, ensure:

1. `NODE_ENV` is set to `production`
2. Email environment variables are properly configured
3. If using Gmail, an App Password is set up (see app-docs/utils/gmail-app-password-guide.md)

## Conclusion

Render handles the build process automatically based on the configuration in render.yaml. You don't need to build locally before pushing to GitHub, but doing so can help catch issues earlier.

Following the deployment and redeployment checklists will ensure smooth deployments to Render.
