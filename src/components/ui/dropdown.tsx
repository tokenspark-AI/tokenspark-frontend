import * as React from "react"
import { cn } from "@/lib/utils"

interface DropdownProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  align?: 'start' | 'end';
}

const Dropdown = ({ open, onClose, children, align = 'start' }: DropdownProps) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50"
      onClick={onClose}
    >
      <div
        className={cn(
          "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-card",
          align === 'end' ? 'right-0' : 'left-0',
          'top-full mt-1'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

const DropdownContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("py-1", className)}
    {...props}
  />
))
DropdownContent.displayName = "DropdownContent"

interface DropdownItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  destructive?: boolean;
}

const DropdownItem = React.forwardRef<HTMLButtonElement, DropdownItemProps>(
  ({ className, destructive, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
        destructive && "text-destructive focus:text-destructive",
        className
      )}
      {...props}
    />
  )
)
DropdownItem.displayName = "DropdownItem"

const DropdownSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-border", className)}
    {...props}
  />
))
DropdownSeparator.displayName = "DropdownSeparator"

export {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
}
