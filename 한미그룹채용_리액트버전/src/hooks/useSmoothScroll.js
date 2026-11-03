import { useEffect } from "react";

export function useSmoothScroll(toggleRef) {
  useEffect(() => {
    const toggle = toggleRef.current;
    const root = document.documentElement;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!toggle) return;

    const duration = 360;
    let frameRequest = 0;
    let startY = window.scrollY;
    let targetY = startY;
    let startTime = 0;

    function stopAnimation() {
      if (frameRequest) window.cancelAnimationFrame(frameRequest);
      frameRequest = 0;
      startY = window.scrollY;
      targetY = startY;
    }

    function updateMode() {
      if (reducedMotion.matches) toggle.checked = true;
      root.style.scrollBehavior = toggle.checked ? "auto" : "smooth";
      if (toggle.checked) stopAnimation();
    }

    function hasScrollableAncestor(target, deltaY) {
      let element = target instanceof Element ? target : target?.parentElement;
      while (element && element !== document.body && element !== root) {
        const style = window.getComputedStyle(element);
        const canScroll = /(auto|scroll|overlay)/.test(style.overflowY);
        if (canScroll && element.scrollHeight > element.clientHeight + 1) {
          if (
            (deltaY > 0 &&
              element.scrollTop + element.clientHeight < element.scrollHeight - 1) ||
            (deltaY < 0 && element.scrollTop > 0)
          ) {
            return true;
          }
        }
        element = element.parentElement;
      }
      return false;
    }

    function animateScroll(timestamp) {
      if (toggle.checked || reducedMotion.matches) {
        stopAnimation();
        return;
      }
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const nextY = startY + (targetY - startY) * eased;
      window.scrollTo({ top: nextY, behavior: "instant" });
      if (progress < 1) {
        frameRequest = window.requestAnimationFrame(animateScroll);
      } else if (Math.abs(targetY - window.scrollY) > 1) {
        startY = window.scrollY;
        startTime = timestamp;
        frameRequest = window.requestAnimationFrame(animateScroll);
      } else {
        frameRequest = 0;
        startY = window.scrollY;
        targetY = startY;
      }
    }

    function onWheel(event) {
      if (
        toggle.checked ||
        reducedMotion.matches ||
        root.classList.contains("menu-open") ||
        event.ctrlKey ||
        event.metaKey
      ) {
        return;
      }
      let deltaY = event.deltaY;
      if (event.deltaMode === 1) deltaY *= 16;
      else if (event.deltaMode === 2) deltaY *= window.innerHeight;
      if (
        !deltaY ||
        Math.abs(event.deltaX) > Math.abs(deltaY) ||
        hasScrollableAncestor(event.target, deltaY)
      ) {
        return;
      }
      const maxY = Math.max(0, root.scrollHeight - window.innerHeight);
      const baseY = frameRequest ? targetY : window.scrollY;
      const nextTargetY = Math.max(0, Math.min(maxY, baseY + deltaY));
      if (nextTargetY === baseY) return;
      event.preventDefault();
      targetY = nextTargetY;
      if (!frameRequest) {
        startY = window.scrollY;
        startTime = performance.now();
        frameRequest = window.requestAnimationFrame(animateScroll);
      }
    }

    function onReduceChange(event) {
      if (event.matches) toggle.checked = true;
      updateMode();
    }

    toggle.checked = reducedMotion.matches;
    updateMode();
    toggle.addEventListener("change", updateMode);
    reducedMotion.addEventListener("change", onReduceChange);
    window.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      stopAnimation();
      toggle.removeEventListener("change", updateMode);
      reducedMotion.removeEventListener("change", onReduceChange);
      window.removeEventListener("wheel", onWheel);
    };
  }, [toggleRef]);
}
