import Link from "next/link";
import { ThemeLogo } from "@/components/brand/ThemeLogo";

type Props = {
  className?: string;
  priority?: boolean;
};

export function AuthBrandLogo({ className = "h-10 w-auto object-contain", priority }: Props) {
  return (
    <Link href="/" className="inline-flex items-center">
      <ThemeLogo
        alt="Home"
        width={200}
        height={100}
        className={className}
        priority={priority}
      />
    </Link>
  );
}
