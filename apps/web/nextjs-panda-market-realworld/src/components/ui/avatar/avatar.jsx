import { cva } from "class-variance-authority"
import Image from "next/image"

import DefaultAvatar from "@/assets/ic_default_avatar.svg"
import { cn } from "@/libs/cn"

const avatarVariants = cva(
  "relative bg-gray-300 rounded-full shrink-0 overflow-hidden",
  {
    variants: {
      size: {
        small: "w-8 h-8",
        medium: "w-10 h-10",
        large: "w-16 h-16",
        xl: "w-24 h-24"
      },
    },
    defaultVariants: {
      size: "medium"
    },
  }
);

export function Avatar({ className = "", size = "medium", src, alt, ...props }) {
  const mergedClass = cn(
    avatarVariants({ size }),
    className
  );

  return (
    <div className={mergedClass} {...props}>
      <Image
        src={src || DefaultAvatar}
        alt={alt || "author-avatar"}
        className="absolute object-cover"
        fill
      />
    </div>
  )

}