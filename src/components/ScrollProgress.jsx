
import { useState, useEffect } from 'react';

const ScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = window.scrollY;
      const progress = (scrolled / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={`fixed top-[3.6rem] left-0 w-full h-1 md:h-1.5 z-[60] shadow-md flex bg-[#6096B4] transition ease-linear ${scrollProgress === 0 ? "hidden" : "block"}`}>
      <div className={`h-full bg-[#FF90D4] transition ease-linear relative rounded-full ${scrollProgress === 0 ? "hidden" : "block"}`} style={{ width: `${scrollProgress}%`}}></div>
      {/* <div className={`w-2 md:w-3 h-2 md:h-3 top-[-0.12rem] md:top-[-0.15rem] shadow-md rounded-full bg-white absolute`} style={{ left:`${scrollProgress - 0.2}%` }}></div> */}
    </div>
  );
};

export default ScrollProgress;
