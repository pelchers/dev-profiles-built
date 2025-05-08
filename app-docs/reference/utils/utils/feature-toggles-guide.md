# Feature Toggles Guide

This guide explains how to use and extend the feature toggles system in our application.

## Overview

Feature toggles allow us to:

1. Enable/disable features globally across the application
2. Control visibility of testing & debugging tools
3. Gradually roll out new features
4. Manage feature availability without code changes

## How It Works

The `featureToggles.ts` file contains a single source of truth for all toggle states:

```typescript
interface FeatureToggles {
  showTestPanel: boolean;
  // Add more feature toggles here
}

export const featureToggles: FeatureToggles = {
  showTestPanel: true,  // Set to false to hide the test panel
};

export const isFeatureEnabled = (featureName: keyof FeatureToggles): boolean => {
  return featureToggles[featureName];
};
```

## Adding New Toggles

To add a new feature toggle:

1. Add the property to the `FeatureToggles` interface
2. Add the corresponding value in the `featureToggles` object

Example adding a logging feature:

```typescript
interface FeatureToggles {
  showTestPanel: boolean;
  enableLogging: boolean; // New toggle
}

export const featureToggles: FeatureToggles = {
  showTestPanel: true,
  enableLogging: true, // New toggle value
};
```

## Using Toggles in Components

Use the `isFeatureEnabled` utility function to conditionally render or enable features:

```tsx
import { isFeatureEnabled } from '../utils/featureToggles';

function MyComponent() {
  // Check if a feature is enabled
  if (isFeatureEnabled('enableLogging')) {
    // Log something
    console.log('Logging is enabled');
  }

  return (
    <div>
      {/* Conditionally render based on feature toggle */}
      {isFeatureEnabled('showTestPanel') && <TestPanelComponent />}
    </div>
  );
}
```

## Future Use: Logging Utility

We'll soon implement a logging utility that will use the feature toggle system:

1. Add an `enableLogging` toggle to control global logging
2. Create a logger utility that checks the toggle before logging
3. Allow different log levels based on configuration
4. Potentially connect to backend logging endpoints

Example future implementation:

```typescript
// Example of a future logger that leverages feature toggles
export const logger = {
  debug: (message: string) => {
    if (isFeatureEnabled('enableLogging')) {
      console.debug(`[DEBUG] ${message}`);
      // Could also send to a backend API
    }
  },
  error: (message: string) => {
    if (isFeatureEnabled('enableLogging')) {
      console.error(`[ERROR] ${message}`);
      // Could also send to a backend API
    }
  }
};
```

## Best Practices

1. Keep toggle names descriptive and consistent
2. Document new toggles when adding them
3. Default to `false` for testing/debugging features in production
4. Use TypeScript's type safety to ensure valid toggle names 