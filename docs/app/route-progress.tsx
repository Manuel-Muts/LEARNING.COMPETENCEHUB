"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const navigationTimeoutMs = 15000;

export default function RouteProgress() {
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    setIsNavigating(false);
  }, [pathname]);

  useEffect(() => {
    let timeoutId: number | undefined;

    function beginNavigation() {
      setIsNavigating(true);
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => setIsNavigating(false), navigationTimeoutMs);
    }

    function handleDocumentClick(event: MouseEvent) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        !(event.target instanceof Element)
      ) {
        return;
      }

      const anchor = event.target.closest("a");
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) {
        return;
      }

      const destination = new URL(anchor.href, window.location.href);
      if (
        destination.origin !== window.location.origin ||
        (destination.pathname === window.location.pathname &&
          destination.search === window.location.search)
      ) {
        return;
      }

      beginNavigation();
    }

    document.addEventListener("click", handleDocumentClick, true);
    window.addEventListener("popstate", beginNavigation);

    return () => {
      document.removeEventListener("click", handleDocumentClick, true);
      window.removeEventListener("popstate", beginNavigation);
      window.clearTimeout(timeoutId);
    };
  }, []);

  if (!isNavigating) {
    return null;
  }

  return (
    <div
      className="route-progress"
      role="progressbar"
      aria-label="Loading page"
      aria-valuetext="Loading"
    >
      <span />
    </div>
  );
}
