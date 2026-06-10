// Placeholder CF Consumer Finance brand mark.
// Swap this for the official logo asset (e.g. an <Image src="/cf-logo.svg" />)
// once the brand file is added to /public.
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex min-w-0 items-center gap-2 sm:gap-3 ${className}`}>
      <svg
        viewBox="0 0 64 64"
        width="36"
        height="36"
        aria-hidden="true"
        className="h-8 w-8 shrink-0 sm:h-10 sm:w-10"
      >
        <circle cx="32" cy="32" r="31" fill="none" stroke="var(--cf-purple)" strokeWidth="1.5" opacity="0.35" />
        <circle cx="32" cy="32" r="26" fill="none" stroke="var(--cf-purple)" strokeWidth="1.5" opacity="0.55" />
        <circle cx="32" cy="32" r="21" fill="var(--cf-purple)" />
        <text
          x="32"
          y="33"
          textAnchor="middle"
          dominantBaseline="central"
          fill="white"
          fontSize="18"
          fontWeight="700"
          fontFamily="var(--font-geist-sans), sans-serif"
          letterSpacing="0.5"
        >
          CF
        </text>
      </svg>
      <div className="min-w-0 leading-tight">
        <p className="truncate text-xs font-semibold text-cf-purple-darker tracking-wide sm:text-sm">
          CF Consumer Finance
        </p>
        <p className="truncate text-[11px] text-cf-gray sm:text-xs">CF BOT Feedback</p>
      </div>
    </div>
  );
}
