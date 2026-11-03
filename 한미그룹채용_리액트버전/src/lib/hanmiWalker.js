export class HanmiWalkerPlayer {
  constructor(root, { meta, assetBase, variant = "walk" }) {
    this.root = root;
    this.canvas = root.querySelector("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.meta = meta;
    this.assetBase = assetBase.endsWith("/") ? assetBase : `${assetBase}/`;
    this.variant = variant;
    this.frames = [];
    this.index = 0;
    this.elapsed = 0;
    this.last = 0;
    this.raf = 0;
    this.ready = false;
    this.visible = true;
    this.tracking = true;
    this.pointer = null;
    this.gaze = { x: 0, y: 0 };
    this.reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    this.paused = this.reduce.matches;
    this.tick = this.tick.bind(this);
    this.onVisibility = () => {
      this.last = 0;
      this.update();
    };
    document.addEventListener("visibilitychange", this.onVisibility);
    this.canvas.addEventListener("pointermove", (event) => {
      if (event.pointerType === "touch") return;
      const rect = this.canvas.getBoundingClientRect();
      this.pointer = {
        x: ((event.clientX - rect.left) * 1920) / rect.width,
        y: ((event.clientY - rect.top) * 1080) / rect.height,
      };
      this.update();
    });
    this.canvas.addEventListener("pointerleave", () => {
      this.pointer = null;
      this.update();
    });
    this.canvas.addEventListener("pointercancel", () => {
      this.pointer = null;
      this.update();
    });
    this.observer = new IntersectionObserver(
      (entries) => {
        this.visible = entries[0].isIntersecting;
        this.last = 0;
        this.update();
      },
      { rootMargin: "80px" },
    );
    this.observer.observe(root);
    this.onReduce = (event) => {
      this.paused = event.matches;
      this.update();
    };
    this.reduce.addEventListener("change", this.onReduce);
    this.load();
  }

  async load() {
    const status = this.root.querySelector("[data-status]");
    let loaded = 0;
    let next = 0;
    const worker = async () => {
      while (next < this.meta.count) {
        const i = next++;
        const img = new Image();
        const fileName = this.meta.src.replace("{n}", String(i + 1));
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = () => reject(new Error(fileName));
          img.src = this.assetBase + fileName;
        });
        if (img.decode) await img.decode();
        this.frames[i] = img;
        loaded += 1;
        if (i === 0) this.draw();
        if (status) status.textContent = `이미지 준비 중 ${loaded}/${this.meta.count}`;
      }
    };
    try {
      await Promise.all(Array.from({ length: 4 }, worker));
      this.ready = true;
      if (status) status.hidden = true;
      this.update();
    } catch (error) {
      if (status) {
        status.textContent = `이미지를 불러오지 못했습니다. assets 폴더를 확인하세요. (${error.message})`;
      }
    }
  }

  target() {
    if (!this.tracking || !this.pointer) return { x: 0, y: 0 };
    const eyes = this.meta.eyes[this.index];
    const off = this.meta.offset[this.index];
    const x = off[0] + (eyes[0].x + eyes[1].x) / 2;
    const y = off[1] + (eyes[0].y + eyes[1].y) / 2;
    const dx = this.pointer.x - x;
    const dy = this.pointer.y - y;
    const length = Math.hypot(dx, dy);
    const amount = Math.min(1, length / 210);
    return length ? { x: (dx / length) * amount, y: (dy / length) * amount } : { x: 0, y: 0 };
  }

  update() {
    if (!this.ready || !this.visible || document.hidden) {
      if (this.raf) cancelAnimationFrame(this.raf);
      this.raf = 0;
      this.last = 0;
      return;
    }
    if (this.reduce.matches) {
      this.gaze = this.target();
      this.draw();
    }
    if (!this.raf) this.raf = requestAnimationFrame(this.tick);
  }

  tick(now) {
    this.raf = 0;
    if (!this.ready || !this.visible || document.hidden) {
      this.last = 0;
      return;
    }
    const dt = this.last ? Math.min((now - this.last) / 1000, 0.1) : 0;
    this.last = now;
    if (!this.paused) {
      this.elapsed += dt;
      this.index = Math.floor(this.elapsed * this.meta.fps) % this.meta.count;
    }
    const target = this.target();
    const blend = 1 - Math.exp(-16 * dt);
    this.gaze.x += (target.x - this.gaze.x) * blend;
    this.gaze.y += (target.y - this.gaze.y) * blend;
    this.draw();
    const movingEyes =
      Math.abs(target.x - this.gaze.x) + Math.abs(target.y - this.gaze.y) > 0.002;
    if (!this.paused || movingEyes) this.raf = requestAnimationFrame(this.tick);
    else this.last = 0;
  }

  draw() {
    const img = this.frames[this.index];
    if (!img) return;
    const ctx = this.ctx;
    const off = this.meta.offset[this.index];
    ctx.clearRect(0, 0, 1920, 1080);
    ctx.drawImage(img, off[0], off[1]);
    if (!this.tracking) return;
    for (const eye of this.meta.eyes[this.index]) {
      const x = off[0] + eye.x;
      const y = off[1] + eye.y;
      const rx = eye.rx;
      const ry = eye.ry;
      ctx.save();
      ctx.beginPath();
      if (this.variant === "read") {
        ctx.ellipse(x, y, rx, ry, eye.rotation || 0, 0, Math.PI * 2);
      } else {
        ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
      }
      ctx.clip();
      const white = ctx.createRadialGradient(x - rx * 0.3, y - ry * 0.4, 2, x, y, ry * 1.3);
      white.addColorStop(0, "#ffffff");
      white.addColorStop(0.65, "#fcfcfd");
      white.addColorStop(1, "#dce8ed");
      ctx.fillStyle = white;
      ctx.fillRect(
        this.variant === "read" ? x - rx * 2 : x - rx,
        this.variant === "read" ? y - ry * 2 : y - ry,
        this.variant === "read" ? rx * 4 : rx * 2,
        this.variant === "read" ? ry * 4 : ry * 2,
      );
      const px = x + this.gaze.x * rx * 0.29;
      const py = y + this.gaze.y * ry * 0.23;
      const pupil = ctx.createRadialGradient(px - rx * 0.12, py - ry * 0.12, 1, px, py, ry * 0.59);
      pupil.addColorStop(0, "#34434a");
      pupil.addColorStop(1, "#101b21");
      ctx.fillStyle = pupil;
      ctx.beginPath();
      ctx.ellipse(px, py, rx * 0.55, ry * 0.59, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,.93)";
      ctx.beginPath();
      ctx.ellipse(px - rx * 0.16, py - ry * 0.25, rx * 0.12, ry * 0.13, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,.35)";
      ctx.beginPath();
      ctx.arc(px + rx * 0.16, py + ry * 0.18, rx * 0.06, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    if (this.variant === "read" && this.meta.occluders?.[this.index]) {
      ctx.save();
      ctx.beginPath();
      for (const [x, y, w] of this.meta.occluders[this.index]) {
        ctx.rect(off[0] + x - 0.5, off[1] + y - 0.5, w + 1, 2);
      }
      ctx.clip();
      ctx.drawImage(img, off[0], off[1]);
      ctx.restore();
    }
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    this.observer.disconnect();
    document.removeEventListener("visibilitychange", this.onVisibility);
    this.reduce.removeEventListener("change", this.onReduce);
    this.ready = false;
    this.frames = [];
  }
}

export const DESKTOP_POINTER_QUERY =
  "(min-width: 1025px) and (hover: hover) and (pointer: fine)";
