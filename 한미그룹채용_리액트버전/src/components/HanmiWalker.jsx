import { useEffect, useRef } from "react";
import { DESKTOP_POINTER_QUERY, HanmiWalkerPlayer } from "../lib/hanmiWalker";

const VARIANTS = {
  walk: {
    metaUrl: "./hanmi-eye-tracking/metadata.json",
    assetBase: "./hanmi-eye-tracking/assets/",
  },
  read: {
    metaUrl: "./hanmi-reading-eye-tracking/metadata.json",
    assetBase: "./hanmi-reading-eye-tracking/assets/",
  },
};

export default function HanmiWalker({
  className,
  variant = "walk",
  lazy = false,
  ariaLabel,
}) {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let player;
    let cancelled = false;
    let loadObserver;
    const desktopPointer = window.matchMedia(DESKTOP_POINTER_QUERY);

    function syncTrackingMode() {
      if (!player) return;
      player.tracking = desktopPointer.matches;
      player.pointer = null;
      player.gaze = { x: 0, y: 0 };
      player.update();
    }

    async function start() {
      const config = VARIANTS[variant];
      const response = await fetch(config.metaUrl);
      const meta = await response.json();
      if (cancelled) return;
      player = new HanmiWalkerPlayer(root, {
        meta,
        assetBase: config.assetBase,
        variant,
      });
      syncTrackingMode();
      desktopPointer.addEventListener("change", syncTrackingMode);
    }

    if (lazy && window.IntersectionObserver) {
      loadObserver = new IntersectionObserver(
        (entries) => {
          if (!entries[0].isIntersecting) return;
          loadObserver.disconnect();
          start();
        },
        { rootMargin: "240px" },
      );
      loadObserver.observe(root);
    } else {
      start();
    }

    return () => {
      cancelled = true;
      loadObserver?.disconnect();
      desktopPointer.removeEventListener("change", syncTrackingMode);
      player?.destroy();
    };
  }, [lazy, variant]);

  return (
    <div className={className} ref={rootRef}>
      <canvas
        width="1920"
        height="1080"
        role="img"
        aria-label={ariaLabel}
      />
      <span data-status role="status">
        이미지 준비 중
      </span>
    </div>
  );
}
