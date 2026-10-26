"use client";

import { loginAsUser } from "@/actions/admin/impersonateUser";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

type Props = {
  userId: string;
  className?: string;
  variant?: "default" | "outline" | "secondary";
  fullWidth?: boolean;
};

export function AdminLoginAsUserButton({
  userId,
  className,
  variant = "default",
  fullWidth,
}: Props) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant={variant}
      className={fullWidth ? `w-full justify-start gap-2 ${className ?? ""}` : className}
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          const result = await loginAsUser(userId);
          if (result?.ok === false) {
            toast.error(result.error);
          }
        });
      }}
    >
      <LogIn className="h-4 w-4 shrink-0" />
      {pending ? "Opening dashboard…" : "Open member dashboard"}
    </Button>
  );
}
