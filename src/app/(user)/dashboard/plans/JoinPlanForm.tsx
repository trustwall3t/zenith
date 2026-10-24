"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function JoinPlanForm({
  planId,
  minPrice,
  maxPrice,
  currency,
}: {
  planId: number;
  minPrice: number;
  maxPrice: number;
  currency: string;
}) {
  const router = useRouter();
  const [amount, setAmount] = useState(minPrice);
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    try {
      const res = await fetch("/api/investment/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, amount }),
      });
      const j = await res.json();
      if (!res.ok) {
        toast.error(j.error ?? "Could not join plan");
        return;
      }
      toast.success("Plan activated — see My plans & ROI tab");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-wrap items-end gap-2 pt-2">
      <label className="text-xs block">
        Amount ({currency})
        <input
          type="number"
          min={minPrice}
          max={maxPrice}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="mt-1 block w-32 rounded border border-border px-2 py-1 text-sm"
        />
      </label>
      <Button size="sm" disabled={busy} onClick={submit}>
        Join plan
      </Button>
    </div>
  );
}
