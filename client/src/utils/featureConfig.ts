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
  global: { enabled: false, scale: 0.75 },
  mobile: { enabled: false, scale: 1, breakpoint: 768, scaleUpContent: false },
};

export const getComputedScale = (screenWidth: number): number => {
  const { global, mobile } = scalingConfig;
  if (global.enabled) return global.scale;
  if (mobile.enabled && screenWidth <= mobile.breakpoint) return mobile.scale;
  return 1;
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