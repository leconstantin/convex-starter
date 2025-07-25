// Spinner component for reuse
export function Spinner({ text = "Loading..." }: { text?: string }) {
  return (
    <span className="flex items-center gap-2">
      <svg
        className="size-5 animate-spin text-background"
        fill="none"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Loading...</title>
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          fill="currentColor"
        />
      </svg>
      {text}
    </span>
  );
}
