import { cva } from "class-variance-authority";
import { forwardRef } from "react";

import { cn } from "@/libs/cn";

const buttonVariants = cva(
  "flex text-white justify-center items-center gap-2.5 border-0 rounded-lg",
  {
    variants: {
      intent: {
        active: "bg-primary-100 hover:bg-primary-200 active:bg-primary-300",
        // 에러상태일때 처리할 버튼 스타일 
        ghost: "bg-gray-50 text-error-red border border-error-red hover:bg-gray-200",
        danger: "bg-error-red hover:bg-red-600 active:bg-red-700 text-white"
      },
      size: {
        default: "h-10.5 py-3 px-5.75",
        small: "h-8 px-3 text-sm",
        large: "h-12 px-6 text-lg",
      },
      isDisabled: {
        true: "bg-gray-400 hover:bg-gray-500"
      },
    },
    defaultVariants: {
      intent: "active",
      size: "default"
    },
  }
);

const Button = forwardRef(
  (
    {
      className,
      intent,
      size,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        className={cn(
          buttonVariants({
            intent,
            size,
            isDisabled: disabled,
            className
          })
        )}
        disabled={disabled}
        ref={ref}
        {...props}
      />
    )
  }
);

Button.displayName = 'Button';
export { Button, buttonVariants }