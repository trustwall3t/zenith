"use client";

import { setGoogleTranslateEnabled } from "@/actions/admin/updateGoogleTranslate";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function GoogleTranslateToggle({ enabled }: { enabled: boolean }) {
  const router = useRouter();
  const [on, setOn] = useState(enabled);
  const [pending, startTransition] = useTransition();

  return (
    <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
      <input
        type="checkbox"
        className="h-4 w-4 rounded border-border"
        checked={on}
        disabled={pending}
        onChange={(e) => {
          const next = e.target.checked;
          setOn(next);
          startTransition(async () => {
            const res = await setGoogleTranslateEnabled(next);
            if (!res.ok) {
              setOn(!next);
              return;
            }
            router.refresh();
          });
        }}
      />
      <span>
        Google Translate on public site, auth &amp; dashboard{" "}
        {pending ? <span className="text-muted-foreground">(saving…)</span> : null}
      </span>
    </label>
  );
}
