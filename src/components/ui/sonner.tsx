import React from "react";
import { useTheme } from "next-themes";
import {
  Toaster as Sonner,
  toast as sonnerToast,
  ToastOptions,
} from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = (props: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export const useToaster = () => ({
  success: (message: string, options?: ToastOptions) =>
    sonnerToast.success(message, options),
  error: (message: string, options?: ToastOptions) =>
    sonnerToast.error(message, options),
  info: (message: string, options?: ToastOptions) =>
    sonnerToast.info(message, options),
  warning: (message: string, options?: ToastOptions) =>
    sonnerToast.warning(message, options),
});

export { Toaster };
