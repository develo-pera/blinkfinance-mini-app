import { useState, useEffect } from "react";

export const useKeyboardDetection = () => {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      // Get initial viewport height
      const initialHeight = window.innerHeight;

      // Check if viewport height decreased significantly (keyboard open)
      const currentHeight = window.innerHeight;
      const heightDifference = initialHeight - currentHeight;

      // If height decreased by more than 150px, keyboard is likely open
      setIsKeyboardOpen(heightDifference > 150);
    };

    // Listen for resize events
    window.addEventListener("resize", handleResize);

    // Also listen for visual viewport changes (more accurate on some devices)
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleResize);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  return isKeyboardOpen;
};
