import type { SVGProps } from "react";

export function TrackIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      display="block"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M5 5.5c2.8 0 4.2 1.6 4.2 4s-2 3.5-2 5.4 1.4 3.6 3.7 3.6 3.2-1.5 3.2-3.5 1-3.5 3.3-3.5 3.6 1.5 3.6 4c0 2.3-1.5 4-4 4H9c-2.5 0-4-1.7-4-4"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
