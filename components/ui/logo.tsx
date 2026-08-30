import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  /** Pixel size of the square mark. */
  size?: number;
}

/**
 * CVIFI brand mark — a résumé sheet with an approval check, drawn in the
 * active theme color (via `currentColor`, so it follows theme changes and
 * inherits `text-primary`). Vector + self-contained: crisp at any size.
 */
export function Logo({ className, size = 36 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="CVIFI"
      className={cn("text-primary", className)}
    >
      {/* Badge */}
      <rect x="1.5" y="1.5" width="37" height="37" rx="10" fill="currentColor" />
      {/* Résumé sheet */}
      <rect x="10.5" y="8" width="15" height="21" rx="2.5" fill="#fff" />
      {/* Name bar (accent) */}
      <rect
        x="13.5"
        y="12"
        width="9"
        height="2.6"
        rx="1.3"
        fill="currentColor"
      />
      {/* Text lines */}
      <rect
        x="13.5"
        y="17"
        width="9"
        height="1.7"
        rx="0.85"
        fill="currentColor"
        opacity="0.35"
      />
      <rect
        x="13.5"
        y="20.4"
        width="7"
        height="1.7"
        rx="0.85"
        fill="currentColor"
        opacity="0.35"
      />
      <rect
        x="13.5"
        y="23.8"
        width="8"
        height="1.7"
        rx="0.85"
        fill="currentColor"
        opacity="0.35"
      />
      {/* Approval check badge */}
      <circle cx="27.5" cy="27.5" r="6.5" fill="#fff" />
      <circle cx="27.5" cy="27.5" r="6.5" fill="currentColor" opacity="0.12" />
      <path
        d="M24.6 27.6l2 2 4-4.2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
