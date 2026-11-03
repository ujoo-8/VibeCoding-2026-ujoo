import { useEffect } from "react";

export function useMvScale() {
  useEffect(() => {
    const root = document.documentElement;
    const mv = document.getElementById("main_visual");

    function updateVisualScale() {
      const width = window.innerWidth;
      if (width > 1024 && width < 1440) {
        root.style.setProperty("--mv-scale", String(width / 1440));
        if (mv) mv.style.height = `${(900 * width) / 1440}px`;
      } else {
        root.style.removeProperty("--mv-scale");
        if (mv) mv.style.removeProperty("height");
      }
    }

    updateVisualScale();
    window.addEventListener("resize", updateVisualScale);
    return () => window.removeEventListener("resize", updateVisualScale);
  }, []);
}
