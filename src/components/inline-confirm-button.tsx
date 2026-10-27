"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  action: () => Promise<void>;
  label: string;
  confirmLabel: string;
};

export function InlineConfirmButton({ action, label, confirmLabel }: Props) {
  const [confirming, setConfirming] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  return (
    <button
      type="button"
      className={confirming ? "dangerButton" : "secondaryButton"}
      onClick={() => {
        if (confirming) {
          if (timer.current) clearTimeout(timer.current);
          setConfirming(false);
          void action();
          return;
        }
        setConfirming(true);
        timer.current = setTimeout(() => setConfirming(false), 4000);
      }}
    >
      {confirming ? confirmLabel : label}
    </button>
  );
}
