import { CheckIcon } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";

function Checkbox({
  checked = false,
  className,
  ...props
}: Omit<React.ComponentProps<"input">, "type"> & { checked?: boolean }) {
  return (
    <label className="inline-flex items-center">
      <input
        checked={checked}
        className="peer sr-only"
        type="checkbox"
        {...props}
      />
      <span
        className={cn(
          "flex size-4 items-center justify-center border border-input bg-background text-foreground transition-colors peer-focus-visible:ring-1 peer-focus-visible:ring-ring/50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 peer-checked:border-foreground peer-checked:bg-foreground peer-checked:text-background rounded-none",
          className,
        )}
      >
        {checked ? <CheckIcon className="size-3" weight="bold" /> : null}
      </span>
    </label>
  );
}

export { Checkbox };
