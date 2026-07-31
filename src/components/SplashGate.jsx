import React, { useEffect, useState } from "react";
import "./SplashGate.css";

const SESSION_KEY = "gentleman_splash_seen";

/**
 * SplashGate — Curtain Reveal splash for Gentleman.
 *
 * Shows the splash once per browser session (controlled by sessionStorage).
 * On the first visit:
 *
 *   1. "opening": two dark-green panels meet centre with the wordmark
 *      animating in (~2.4s)
 *   2. "closing": panels slide apart vertically to reveal the page (~0.7s)
 *   3. "done":   splash unmounts, page interactive
 *
 * On any subsequent navigation in the same session, the splash is skipped
 * and children render immediately.
 */
export default function SplashGate({ children, force = false }) {
  const [phase, setPhase] = useState(() => {
    if (force) return "opening";
    return sessionStorage.getItem(SESSION_KEY) ? "done" : "opening";
  });

  useEffect(() => {
    if (phase === "done") return;
    const t1 = setTimeout(() => setPhase("closing"), 2400);
    const t2 = setTimeout(() => {
      sessionStorage.setItem(SESSION_KEY, "1");
      setPhase("done");
    }, 3100);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [phase]);

  return (
    <>
      {phase !== "done" && (
        <div className={`splash-gate splash-${phase}`} aria-hidden="true">
          <div className="splash-panel splash-top" />
          <div className="splash-panel splash-bot" />
          <div className="splash-center">
            <div className="splash-word">GENTLEMAN</div>
            <div className="splash-rule" />
            <div className="splash-sub">— A HOUSE OF CRAFT —</div>
          </div>
        </div>
      )}
      {children}
    </>
  );
}

/**
 * Helper to force-replay the splash (e.g. from a "watch the intro again" link).
 */
export function resetSplash() {
  sessionStorage.removeItem(SESSION_KEY);
  window.location.reload();
}
