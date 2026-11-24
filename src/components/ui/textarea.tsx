import * as React from "react";
import { cn } from "@/lib/styles/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-[72px] w-full resize-y rounded-md border border-line-strong bg-surface-elevated px-3 py-2 text-body-md text-fg outline-hidden transition-colors duration-fast ease-out placeholder:text-fg-tertiary focus:border-2 focus:border-focus-ring focus:px-[calc(var(--spacing-md)-1px)] focus:py-[calc(var(--spacing-sm)-1px)] disabled:cursor-not-allowed disabled:border-line disabled:bg-canvas disabled:text-fg-disabled disabled:placeholder:text-fg-disabled aria-invalid:not-focus:border-danger motion-reduce:transition-none",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
