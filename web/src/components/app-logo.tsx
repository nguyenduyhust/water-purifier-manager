import { useId } from 'react';
import { cn } from '@/lib/utils';

interface AppLogoProps {
  className?: string;
}

// Same artwork as the app icon (web/public/favicon.svg, ios AppIcon).
export function AppLogo({ className }: AppLogoProps) {
  // Each instance needs its own clipPath id when several logos are on screen.
  const clipId = useId();

  return (
    <svg viewBox="0 0 512 512" className={cn('h-8 w-8 shrink-0', className)} aria-hidden="true">
      <defs>
        <clipPath id={clipId}>
          <path d="M256 76C256 76 128 222 128 312a128 128 0 0 0 256 0C384 222 256 76 256 76Z" />
        </clipPath>
      </defs>
      <rect width="512" height="512" rx="115" fill="#0B4F71" />
      <path d="M256 76C256 76 128 222 128 312a128 128 0 0 0 256 0C384 222 256 76 256 76Z" fill="#fff" />
      <g clipPath={`url(#${clipId})`}>
        <rect x="100" y="286" width="312" height="34" fill="#ABE0F7" />
        <rect x="100" y="336" width="312" height="34" fill="#6EC9F2" />
        <rect x="100" y="386" width="312" height="60" fill="#0EA5E9" />
      </g>
    </svg>
  );
}
