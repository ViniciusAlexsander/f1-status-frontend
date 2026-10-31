import type { SVGProps } from "react";

export function TrackIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 48 48"
      width="20"
      height="20"
      display="block"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M7 38c-3-4-2-9 2-12L32 7c4-4 10-3 12 1s1 9-4 12l-5 4c-4 3-5 7-2 11s1 8-4 9l-14 2c-4 1-7-2-8-5"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
