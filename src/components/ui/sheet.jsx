import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * "Sheet" = Drawer / gaveta que desliza a partir de uma borda da tela.
 * Construído sobre o Dialog acessível do Radix (foco preso, ESC fecha, etc.).
 * A animação de deslizar é feita pelo Framer Motion dentro do CartDrawer.
 */
const Sheet = DialogPrimitive.Root;
const SheetTrigger = DialogPrimitive.Trigger;
const SheetClose = DialogPrimitive.Close;
const SheetPortal = DialogPrimitive.Portal;

const SheetOverlay = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-carvao/40 backdrop-blur-sm transition-opacity",
      className
    )}
    {...props}
  />
));
SheetOverlay.displayName = "SheetOverlay";

/**
 * `asChild` é passado adiante para que o CartDrawer possa renderizar
 * um <motion.div> como conteúdo e controlar a animação.
 */
const SheetContent = React.forwardRef(
  ({ className, children, side = "right", showClose = true, ...props }, ref) => (
    <SheetPortal>
      <SheetOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed z-50 flex flex-col bg-background shadow-glass focus:outline-none",
          side === "right" && "inset-y-0 right-0 h-full w-full max-w-md",
          side === "bottom" && "inset-x-0 bottom-0 max-h-[85vh] rounded-t-2xl",
          className
        )}
        {...props}
      >
        {children}
        {showClose && (
          <DialogPrimitive.Close className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground transition hover:bg-muted">
            <X className="h-5 w-5" />
            <span className="sr-only">Fechar</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </SheetPortal>
  )
);
SheetContent.displayName = "SheetContent";

const SheetHeader = ({ className, ...props }) => (
  <div className={cn("border-b border-border px-5 py-4", className)} {...props} />
);
const SheetFooter = ({ className, ...props }) => (
  <div
    className={cn(
      "mt-auto border-t border-border px-5 py-4 space-y-2 bg-background",
      className
    )}
    {...props}
  />
);
const SheetTitle = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("font-display text-lg tracking-tight", className)}
    {...props}
  />
));
SheetTitle.displayName = "SheetTitle";

const SheetDescription = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
SheetDescription.displayName = "SheetDescription";

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
