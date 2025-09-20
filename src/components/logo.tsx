import { Landmark } from 'lucide-react';
import { cn } from '@/lib/utils';

type LogoProps = {
  className?: string;
  iconClassName?: string;
};

export function Logo({ className, iconClassName }: LogoProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Landmark
        className={cn('h-6 w-6 text-primary', iconClassName)}
        strokeWidth={2.5}
      />
      <span className="font-headline text-xl font-bold text-foreground">
        FinWise
      </span>
    </div>
  );
}
