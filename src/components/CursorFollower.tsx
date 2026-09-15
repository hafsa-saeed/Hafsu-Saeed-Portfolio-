import React, { useEffect, useRef } from "react";

export const CursorFollower: React.FC = () => {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Only enable on desktop pointer devices
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!hasFinePointer) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Position state
    let targetX = -100;
    let targetY = -100;
    let ringX = -100;
    let ringY = -100;
    let isVisible = false;
    let isHoveringInteractive = false;
    let isHoveringText = false;
    let animId: number;

    const onMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        ringX = e.clientX;
        ringY = e.clientY;
      }

      // Check the element underneath the pointer
      const target = e.target as HTMLElement | null;
      if (target) {
        // Check for interactive clickables
        const interactive = Boolean(
          target.tagName === "BUTTON" ||
          target.tagName === "A" ||
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.closest("button") ||
          target.closest("a") ||
          target.getAttribute("role") === "button" ||
          target.classList.contains("cursor-pointer"),
        );

        // Check if cursor is directly over reading text
        const textElement = Boolean(
          !interactive &&
          (target.tagName === "P" ||
            target.tagName === "SPAN" ||
            target.tagName === "H1" ||
            target.tagName === "H2" ||
            target.tagName === "H3" ||
            target.tagName === "H4" ||
            target.tagName === "H5" ||
            target.tagName === "H6" ||
            target.tagName === "LI" ||
            target.tagName === "LABEL"),
        );

        isHoveringInteractive = interactive;
        isHoveringText = textElement;
      }
    };

    const onMouseEnter = (e: MouseEvent) => {
      isVisible = true;
      targetX = e.clientX;
      targetY = e.clientY;
      ringX = e.clientX;
      ringY = e.clientY;
    };

    const onMouseLeave = () => {
      isVisible = false;
    };

    const onWindowBlur = () => {
      isVisible = false;
    };

    // Smooth physics loop via requestAnimationFrame
    const updateLoop = () => {
      if (isVisible) {
        // Silky smooth interpolation (lerp)
        const dx = targetX - ringX;
        const dy = targetY - ringY;
        ringX += dx * 0.16;
        ringY += dy * 0.16;

        // Position the center dot directly on the mouse pointer
        dot.style.opacity = "1";
        dot.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%)`;

        // Position the smooth follower ring
        ring.style.opacity = "1";
        ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;

        if (isHoveringInteractive) {
          // Interactive hover: Ring expands into an elegant emerald halo, dot stays crisp
          ring.style.width = "44px";
          ring.style.height = "44px";
          ring.style.borderColor = "rgba(52, 211, 153, 0.9)";
          ring.style.boxShadow = "0 0 16px rgba(16, 185, 129, 0.45)";
          ring.style.borderWidth = "2px";
          dot.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%) scale(1.4)`;
          dot.style.opacity = "1";
        } else if (isHoveringText) {
          // Over text: NEVER obscure text! Ring contracts lightly, center dot softens to prevent hiding letters
          ring.style.width = "28px";
          ring.style.height = "28px";
          ring.style.borderColor = "rgba(16, 185, 129, 0.4)";
          ring.style.boxShadow = "0 0 8px rgba(16, 185, 129, 0.2)";
          ring.style.borderWidth = "1px";
          dot.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%) scale(0.6)`;
          dot.style.opacity = "0.35"; // Soften dot so letters shine straight through
        } else {
          // Standard idle wandering
          ring.style.width = "34px";
          ring.style.height = "34px";
          ring.style.borderColor = "rgba(16, 185, 129, 0.65)";
          ring.style.boxShadow = "0 0 10px rgba(16, 185, 129, 0.25)";
          ring.style.borderWidth = "1.5px";
          dot.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%) scale(1)`;
          dot.style.opacity = "1";
        }
      } else {
        dot.style.opacity = "0";
        ring.style.opacity = "0";
      }

      animId = requestAnimationFrame(updateLoop);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseenter", onMouseEnter, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("blur", onWindowBlur);

    animId = requestAnimationFrame(updateLoop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseenter", onMouseEnter);
      document.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("blur", onWindowBlur);
    };
  }, []);

  return (
    <>
      {/* Precision emerald jewel core dot */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999] w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981] will-change-transform opacity-0 transition-opacity duration-150"
      />
      {/* Transparent hollow luminous follower ring - strictly ZERO background fill to avoid blocking text */}
      <div
        ref={ringRef}
        style={{ backgroundColor: "transparent" }}
        className="pointer-events-none fixed top-0 left-0 z-[9998] rounded-full border border-emerald-400/65 will-change-transform opacity-0 transition-[width,height,border-color,box-shadow,border-width] duration-200 ease-out"
      />
    </>
  );
};
