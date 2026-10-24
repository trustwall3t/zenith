import testimonialsJson from "@/data/testimonials.json";
import type { Testimonial } from "@/types/site";

type JsonRow = {
  id?: number;
  name?: string;
  position?: string;
  what_is_said?: string;
  picture?: string;
  reviewed_at?: string;
};

export function portraitUrl(id: number | null, picture: string | null): string {
  const pic = picture?.trim() ?? "";
  if (pic.startsWith("http://") || pic.startsWith("https://")) return pic;

  const relative = pic.replace(/^\//, "");
  if (relative) {
    const base = relative.startsWith("main/img/")
      ? `/${relative}`
      : `/main/img/${relative.startsWith("testimonials/") ? relative : `testimonials/${relative.split("/").pop()}`}`;
    return base;
  }

  const seed = id ?? 0;
  const gender = seed % 2 === 0 ? "men" : "women";
  return `https://randomuser.me/api/portraits/${gender}/${seed % 100}.jpg`;
}

export function loadHomeTestimonials(): Testimonial[] {
  const rows = (testimonialsJson as { testimonials?: JsonRow[] }).testimonials ?? [];
  return rows.map((row) => {
    const id = row.id != null ? Number(row.id) : null;
    return {
      id,
      name: row.name ?? "Member",
      title: row.position ?? "Great experience",
      body: row.what_is_said ?? "",
      avatarUrl: portraitUrl(id, row.picture ?? null),
      reviewedAt: row.reviewed_at ?? null,
    };
  });
}
