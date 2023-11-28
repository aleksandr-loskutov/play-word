import { useState, useEffect } from 'react';

function useScreenSize(): { isMobile: boolean; screenWidth: number } {
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { isMobile, screenWidth };
}

export default useScreenSize;
