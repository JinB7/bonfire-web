import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/styles/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 cursor-pointer items-center justify-center gap-1 rounded-md border bg-clip-padding text-label-md whitespace-nowrap transition-colors duration-fast ease-out select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring disabled:cursor-not-allowed motion-reduce:transition-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-icon-sm",
  {
    variants: {
      variant: {
        primary:
          "border-primary bg-primary text-on-primary active:border-primary-pressed active:bg-primary-pressed disabled:border-line-strong disabled:bg-canvas disabled:text-fg-disabled",
        secondary:
          "border-line-strong text-fg hover:bg-surface-selected active:bg-surface-selected disabled:border-line disabled:bg-transparent disabled:text-fg-disabled",
        ghost:
          "border-transparent text-fg-secondary hover:bg-surface-selected active:bg-surface-selected disabled:bg-transparent disabled:text-fg-disabled",
        danger:
          "border-danger bg-danger text-on-danger disabled:border-line-strong disabled:bg-canvas disabled:text-fg-disabled",
      },
      size: {
        md: "h-control-lg md:h-control-md",
        sm: "relative h-control-sm px-3 after:absolute after:top-1/2 after:left-1/2 after:size-[max(100%,var(--control-lg))] after:-translate-x-1/2 after:-translate-y-1/2 md:after:hidden",
        icon: "size-control-lg md:size-control-md [&_svg:not([class*='size-'])]:size-icon-md",
      },
    },
    compoundVariants: [
      {
        variant: ["primary", "secondary", "danger"],
        size: "md",
        className: "px-4",
      },
      {
        variant: "ghost",
        size: "md",
        className: "px-3",
      },
      {
        variant: "ghost",
        size: "icon",
        className: "text-fg-tertiary hover:text-fg aria-pressed:text-fg",
      },
    ],
    defaultVariants: {
      variant: "secondary",
      size: "md",
    },
  },
);

function Button({
  className,
  variant = "secondary",
  size = "md",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
