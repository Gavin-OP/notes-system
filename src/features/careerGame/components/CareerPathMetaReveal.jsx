import { useEffect, useRef, useState } from "react";

import "./CareerPathMetaReveal.css";

function MetaGlyph() {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M7 24h9l5-11 7 22 5-11h8" />
      <circle cx="7" cy="24" r="2.5" />
      <circle cx="41" cy="24" r="2.5" />
    </svg>
  );
}

function MetaParticleField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (navigator.userAgent.includes("jsdom")) return undefined;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return undefined;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = { x: -1000, y: -1000 };
    let bounds = { width: 0, height: 0, left: 0, top: 0 };
    let frame = 0;
    let particles = [];

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      bounds = { width: rect?.width || 0, height: rect?.height || 0, left: rect?.left || 0, top: rect?.top || 0 };
      const scale = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(bounds.width * scale);
      canvas.height = Math.round(bounds.height * scale);
      canvas.style.width = `${bounds.width}px`;
      canvas.style.height = `${bounds.height}px`;
      context.setTransform(scale, 0, 0, scale, 0, 0);
      const count = Math.max(44, Math.min(90, Math.round(bounds.width * bounds.height / 12000)));
      particles = Array.from({ length: count }, (_, index) => ({
        x: (index * 97.3 % 100) / 100 * bounds.width,
        y: (index * 61.7 % 100) / 100 * bounds.height,
        vx: ((index % 5) - 2) * .018,
        vy: ((index % 7) - 3) * .012,
        radius: .7 + (index % 3) * .28,
      }));
    };
    const onPointerMove = (event) => { pointer.x = event.clientX; pointer.y = event.clientY; };
    const onPointerLeave = () => { pointer.x = -1000; pointer.y = -1000; };
    const draw = () => {
      context.clearRect(0, 0, bounds.width, bounds.height);
      particles.forEach((particle) => {
        const dx = pointer.x - bounds.left - particle.x;
        const dy = pointer.y - bounds.top - particle.y;
        const distance = Math.hypot(dx, dy);
        const response = Math.max(0, 1 - distance / 150);
        if (!reducedMotion) {
          particle.x = (particle.x + particle.vx + dx * response * .00035 + bounds.width) % bounds.width;
          particle.y = (particle.y + particle.vy + dy * response * .00035 + bounds.height) % bounds.height;
        }
        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius + response * .5, 0, Math.PI * 2);
        context.fillStyle = `rgba(235, 242, 239, ${.28 + response * .54})`;
        context.fill();
        if (response > .12) {
          context.beginPath();
          context.arc(particle.x, particle.y, 3 + response * 8, 0, Math.PI * 2);
          context.fillStyle = `rgba(230, 239, 235, ${response * .055})`;
          context.fill();
        }
      });
      if (!reducedMotion) frame = window.requestAnimationFrame(draw);
    };
    resize();
    draw();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas.parentElement);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);
    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="career-meta-particles" aria-hidden="true" />;
}

export default function CareerPathMetaReveal({ observations, pathNodeCount = 0, onEnterWorkspace, materializing = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const closeButtonRef = useRef(null);
  const triggerRef = useRef(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = [...(dialogRef.current?.querySelectorAll("button, [href], [tabindex]:not([tabindex='-1'])") || [])]
        .filter((element) => !element.disabled);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  const close = () => {
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <>
      <section className={`career-meta-trigger${materializing ? " is-materializing" : ""}`} aria-label="隐藏内容">
        <div className="career-meta-trigger__signal" aria-hidden="true"><i /><i /><i /></div>
        <div className="career-meta-trigger__copy">
          <span className="career-meta-trigger__status">REAL-WORLD PATH DISCOVERED</span>
          <h2>你发现了通往现实求职道路的入口</h2>
        </div>
        <button ref={triggerRef} type="button" onClick={() => setIsOpen(true)}>
          <MetaGlyph />
          <span>打开隐藏内容</span>
          <b aria-hidden="true">UNLOCK →</b>
        </button>
      </section>

      {isOpen ? (
        <div className="career-meta-overlay" role="presentation">
          <section
            ref={dialogRef}
            className="career-meta-reveal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="career-meta-title"
          >
            <MetaParticleField />
            <header className="career-meta-reveal__header">
              <div><span>HIDDEN LAYER</span><small>REAL WORLD LINK · {pathNodeCount} NODES</small></div>
              <button ref={closeButtonRef} type="button" onClick={close} aria-label="关闭隐藏内容">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
              </button>
            </header>

            <div className="career-meta-reveal__intro">
              <span className="career-meta-reveal__eyebrow">THE RUN CONTINUES</span>
              <h2 id="career-meta-title">你以为游戏结束了？</h2>
              <p className="career-meta-reveal__lead">或许这不只是一个游戏……</p>
              <p>你刚才遇到的拒信、面试、Networking 和选择，不只是游戏里的随机事件。</p>
              <p>我们会根据你在这局游戏里做出的真实选择，为你生成一条「个性化求职道路」。</p>
              <p>从岗位探索、简历润色，到面试准备、Offer 选择，我们会列出求职中你或许需要走过的每一步。每个节点都有我们准备的经验分享，希望能为你带去一些帮助和鼓励。</p>
            </div>

            <div className="career-meta-reveal__observations">
              <div className="career-meta-reveal__section-title"><span>RUN TRACE</span><h3>根据这一局……</h3></div>
              <ol>
                {observations.map((observation, index) => (
                  <li key={observation.id}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <div><strong>{observation.title}</strong><p>{observation.body}</p></div>
                  </li>
                ))}
              </ol>
            </div>

            <footer className="career-meta-reveal__footer">
              <div><span>PATH READY</span><small>游戏里的选择，正在变成现实里的下一步。</small></div>
              <button type="button" onClick={onEnterWorkspace}>进入 Learning Workspace <span aria-hidden="true">→</span></button>
            </footer>
          </section>
        </div>
      ) : null}
    </>
  );
}
