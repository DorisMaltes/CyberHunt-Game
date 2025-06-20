import React, { useEffect, useRef, useState } from 'react';

type CloudProps = {
  speed: number; // segundos para cruzar la pantalla
  startSide: 'left' | 'right';
  topPosition?: string; // ej: '20%', '100px'
  cloudWidth?: string; // ancho de la imagen ej: '150px'
  imageUrl: string; // URL de la imagen de la nube
  zIndex?: number;
};

const Cloud: React.FC<CloudProps> = ({
  speed = 20,
  startSide = 'left',
  topPosition = '20%',
  cloudWidth = '150px',
  imageUrl,
  zIndex = 1,
}) => {
  const cloudRef = useRef<HTMLImageElement>(null);
  const [position, setPosition] = useState<string>('0px');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!cloudRef.current) return;

    const imgWidth = cloudRef.current.offsetWidth;
    const startPos = startSide === 'left' ? -imgWidth : windowWidth;
    const endPos = startSide === 'left' ? windowWidth : -imgWidth;

    setPosition(`${startPos}px`);

    const timeout = setTimeout(() => {
      setPosition(`${endPos}px`);
    }, 50);

    return () => clearTimeout(timeout);
  }, [startSide, windowWidth]);

  const handleTransitionEnd = () => {
    if (!cloudRef.current) return;
    const imgWidth = cloudRef.current.offsetWidth;
    const resetPos = startSide === 'left' ? -imgWidth : windowWidth;
    setPosition(`${resetPos}px`);

    setTimeout(() => {
      const newEndPos = startSide === 'left' ? windowWidth : -imgWidth;
      setPosition(`${newEndPos}px`);
    }, 50);
  };

  const cloudStyle: React.CSSProperties = {
    position: 'fixed',
    top: topPosition,
    left: position,
    width: cloudWidth,
    zIndex,
    transition: `left ${speed}s linear`,
    willChange: 'left',
  };

  return (
    <img
      ref={cloudRef}
      src={imageUrl}
      alt="Nube animada"
      style={cloudStyle}
      onTransitionEnd={handleTransitionEnd}
    />
  );
};

export default Cloud;