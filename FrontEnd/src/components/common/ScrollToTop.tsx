import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 100 && !isVisible) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    toggleVisibility();
    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className="scroll-to-top-button"
      aria-label="Scroll to top"
      style={{
        display: isVisible ? 'flex' : 'none'
      }}
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
}
