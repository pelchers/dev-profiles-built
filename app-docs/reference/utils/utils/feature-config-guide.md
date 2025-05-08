# Feature Configuration Guide

This guide explains how to use and extend the feature configuration system in our application.

## Overview

Feature configurations allow us to:

1. Define global settings for features
2. Adapt features based on conditions (screen size, user preferences, etc.)
3. Maintain consistent behavior across the application
4. Change feature behavior without modifying component code

## How It Works: Scaling Example

The scaling system demonstrates how feature configurations work (with examples):

1. **Configuration Definition** - `featureConfig.ts` defines the configuration interface and default values
2. **Helper Functions** - Utility functions process the configuration
3. **Component Wrapper** - `ScaleWrapper` component applies the configuration
4. **Application Integration** - `MainLayout` uses the wrapper and utilities

## EXAMPLE FLOW USING OUR EXISTING SCALING SETUP
### Step 1: Configuration Definition

```typescript
// featureConfig.ts
interface ScalingConfiguration {
  global: {
    enabled: boolean;
    scale: number;
  };
  mobile: {
    enabled: boolean;
    scale: number;
    breakpoint: number;
    scaleUpContent: boolean;
  };
}

export const scalingConfig: ScalingConfiguration = {
  global: {
    enabled: false,
    scale: 0.75,
  },
  mobile: {
    enabled: false,
    scale: 1,
    breakpoint: 768,
    scaleUpContent: false,
  }
};
```

### Step 2: Helper Functions

```typescript
// featureConfig.ts
export const getComputedScale = (screenWidth: number): number => {
  const { global, mobile } = scalingConfig;
  
  if (global.enabled) {
    return global.scale;
  }
  
  if (mobile.enabled && screenWidth <= mobile.breakpoint) {
    return mobile.scale;
  }
  
  return 1; // Default no scaling
};

export const getScaledStyles = (screenWidth: number) => {
  const scale = getComputedScale(screenWidth);
  
  return {
    transform: `scale(${scale})`,
    transformOrigin: 'top left',
    width: `${100 / scale}%`,
    height: 'auto',
  };
};
```

### Step 3: Component Wrapper

```tsx
// ScaleWrapper.tsx
import { FC, ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { getScaledStyles } from '../../utils/featureConfig';

interface ScaleWrapperProps {
  children: ReactNode;
}

const ScaleWrapper: FC<ScaleWrapperProps> = ({ children }) => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{
      ...getScaledStyles(screenWidth),
      minHeight: '100%',
      overflow: 'hidden',
    }}>
      {children}
    </div>
  );
};
```

### Step 4: Application Integration

```tsx
// MainLayout.tsx
import { FC, ReactNode } from 'react';
import ScaleWrapper from '../utils/ScaleWrapper';
import { getComputedScale } from '../../utils/featureConfig';

const MainLayout: FC<MainLayoutProps> = ({ children }) => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  
  // ...resize handler...

  return (
    <div className="min-h-screen relative">
      <div 
        style={{ 
          height: `${100 / getComputedScale(screenWidth)}vh`,
          minHeight: '100vh'
        }}
      >
        <ScaleWrapper>
          {children}
        </ScaleWrapper>
      </div>
    </div>
  );
};
```

## Adding New Feature Configurations

To add a new feature configuration:

1. **Define Configuration Interface** - Create a TypeScript interface for your configuration
2. **Set Default Values** - Define default configuration values
3. **Create Helper Functions** - Add utilities to process and apply the configuration
4. **Build Component Wrappers** - Create components that apply the configuration
5. **Integrate in Application** - Use the configuration in your application

### Example (THIS IS JUST AN EXAMPLE - WE DO NOT HAVE TO DO THIS): Adding a Theme Configuration

```typescript
// 1. Define Configuration Interface
interface ThemeConfiguration {
  darkMode: {
    enabled: boolean;
    auto: boolean; // Follow system preference
  };
  primaryColor: string;
  secondaryColor: string;
}

// 2. Set Default Values
export const themeConfig: ThemeConfiguration = {
  darkMode: {
    enabled: false,
    auto: true,
  },
  primaryColor: '#0284c7',
  secondaryColor: '#7c3aed',
};

// 3. Create Helper Functions
export const isDarkModeEnabled = (): boolean => {
  const { darkMode } = themeConfig;
  
  if (darkMode.auto) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  
  return darkMode.enabled;
};

export const getThemeColors = () => {
  return {
    primary: themeConfig.primaryColor,
    secondary: themeConfig.secondaryColor,
  };
};
```

## Best Practices

1. Keep configuration options grouped by feature
2. Use TypeScript interfaces for type safety
3. Provide sensible defaults
4. Create clear, well-named helper functions
5. Keep logic for computing derived values in the utility file, not components
6. Make configuration changes in one place only 