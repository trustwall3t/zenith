"use client";

import { useCallback, useState } from "react";

export function PublicNavToggle() {
  const [open, setOpen] = useState(false);

  const toggle = useCallback(() => {
    setOpen((prev) => {
      const next = !prev;
      document.body.classList.toggle("gg-nav-open", next);
      return next;
    });
  }, []);

  return (
    <button
      type="button"
      className="gg-nav-toggle"
      aria-expanded={open}
      aria-controls="gg-nav"
      aria-label={open ? "Close menu" : "Open menu"}
      onClick={toggle}
    >
      <span className="gg-nav-toggle-bars" aria-hidden />
    </button>
  );
}
