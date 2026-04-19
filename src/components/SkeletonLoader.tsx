import React from 'react';
import { cn } from '@/utils';

interface SkeletonProps {
  className?: string;
  count?: number;
}

export const SkeletonLoader: React.FC<SkeletonProps> = ({ className, count = 3 }) => {
  return (
    <div className="space-y-4 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-20 w-full bg-muted animate-pulse rounded-2xl",
            className
          )}
        />
      ))}
    </div>
  );
};

export const EmailSkeleton = () => (
  <div className="h-16 w-full max-w-md bg-muted animate-pulse rounded-2xl" />
);
