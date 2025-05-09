import React, { FC, ReactNode, useState, useEffect } from 'react';
import Navbar from '../common/Navbar';
import ScaleWrapper from './ScaleWrapper';
import { isFeatureEnabled } from '../../utils/featureToggles';
import { getComputedScale } from '../../utils/featureConfig';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: FC<MainLayoutProps> = ({ children }) => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden overflow-y-hidden">
      <Navbar />
      <div style={{ height: `${100 / getComputedScale(screenWidth)}vh`, minHeight: '100vh' }}>
        <ScaleWrapper>
          {children}
        </ScaleWrapper>
      </div>
      {isFeatureEnabled('showTestPanel') && (
        <div className="fixed bottom-3 right-3 bg-white p-2 rounded shadow-lg border text-xs">
          <div>Scale: {getComputedScale(screenWidth).toFixed(2)}x</div>
          <div>Screen: {screenWidth}px</div>
        </div>
      )}
    </div>
  );
};

export default MainLayout; 