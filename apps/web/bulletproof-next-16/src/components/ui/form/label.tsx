'use client';

import * as LabelPrimitive from '@radix-ui/react-label';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/libs/utils/cn';

const labelVariants = cva(
  'text-sm font-medium leading-none text-foreground select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
);

interface LabelProps
  extends
    React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>,
    VariantProps<typeof labelVariants> {
  ref?: React.Ref<React.ComponentRef<typeof LabelPrimitive.Root>>;
}

export const Label = ({ className, ref, ...props }: LabelProps) => (
  <LabelPrimitive.Root ref={ref} className={cn(labelVariants(), className)} {...props} />
);
Label.displayName = LabelPrimitive.Root.displayName;
