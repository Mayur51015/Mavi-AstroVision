import { useEffect, useRef } from 'react';

const StarsBackground = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const stars = [];
    const count = 150;

    for (let i = 0; i < count; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      const size = Math.random() * 3 + 1;
      star.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        --duration: ${Math.random() * 3 + 1.5}s;
        --delay: ${Math.random() * 3}s;
        opacity: ${Math.random() * 0.7 + 0.3};
      `;
      container.appendChild(star);
      stars.push(star);
    }

    return () => {
      stars.forEach(s => s.remove());
    };
  }, []);

  return <div ref={containerRef} className="stars-container" aria-hidden="true" />;
};

export default StarsBackground;
