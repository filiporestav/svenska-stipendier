import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        return (
          <Toast key={id} variant={variant} {...props}>
            <div className="flex items-start gap-2.5 flex-1 min-w-0 px-4 py-3.5">
              <span
                className={cn(
                  "mt-[4px] shrink-0 w-[6px] h-[6px] rounded-full",
                  variant === "destructive" ? "bg-red-500" : "bg-emerald-500",
                )}
              />
              <div className="min-w-0 flex-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && <ToastDescription>{description}</ToastDescription>}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
