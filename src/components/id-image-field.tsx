"use client";

import { cn } from "@/lib/utils";
import { PlusIcon, XIcon } from "@phosphor-icons/react/dist/ssr";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  useState,
  useRef,
  useEffect,
  forwardRef,
  type ComponentProps,
} from "react";

type IdImageFieldProps = Omit<ComponentProps<"div">, "value" | "onChange"> & {
  value?: File | string;
  onChange?: (file: File | undefined) => void;
  onRemove?: () => void;
  /** Maximum file size in megabytes (default = 5 MB) */
  maxFileSizeMB?: number;
};

const IdImageField = forwardRef<HTMLInputElement, IdImageFieldProps>(
  (
    { value, onChange, onRemove, className, maxFileSizeMB = 5, ...props },
    ref,
  ) => {
    const fileRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<string | null>(null);

    // Cleanup File URL
    useEffect(() => {
      if (value && typeof value !== "string") {
        const objectUrl = URL.createObjectURL(value);
        return () => URL.revokeObjectURL(objectUrl);
      }
    }, [value]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const maxBytes = maxFileSizeMB * 1024 * 1024;
      if (file.size > maxBytes) {
        setError(`The selected file exceeds the ${maxFileSizeMB} MB limit.`);
        e.target.value = ""; // reset
        return;
      }

      onChange?.(file);
      e.target.value = ""; // allow re-selecting same file
    };

    const parseUrl = (value: string | File) =>
      typeof value === "string"
        ? `/api/files?key=${value}`
        : URL.createObjectURL(value);

    const imageUrl = value ? parseUrl(value) : undefined;

    const assignMultipleRefs = (el: HTMLInputElement) => {
      fileRef.current = el;
      if (ref && "current" in ref) ref.current = el;
    };

    return (
      <>
        {/* Main upload field */}
        <div
          className={cn(
            "text-muted-foreground relative flex aspect-video cursor-pointer items-center justify-center rounded-lg",
            !value && "hover:bg-muted border border-dashed",
            className,
          )}
          role="button"
          onClick={() => fileRef.current?.click()}
          {...props}
        >
          {value && (
            <button
              type="button"
              className="bg-destructive absolute -top-[10px] -left-[10px] z-10 flex size-[25px] items-center justify-center rounded-full text-white"
              onClick={(e) => {
                e.stopPropagation();
                onRemove?.();
              }}
            >
              <XIcon />
            </button>
          )}

          {value && imageUrl && (
            // eslint-disable-next-line
            <img
              src={imageUrl}
              className="absolute top-0 left-0 h-full w-full rounded-lg object-cover"
              alt="ID Photo Preview"
            />
          )}

          <PlusIcon
            className={cn(
              "h-6 w-6 transition-opacity",
              value &&
                "opacity-0 group-hover:opacity-100 group-focus:opacity-100",
            )}
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            ref={assignMultipleRefs}
          />
        </div>

        {/* Error Dialog */}
        <Dialog open={!!error} onOpenChange={() => setError(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>File Too Large</DialogTitle>
              <DialogDescription>{error}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={() => setError(null)}>OK</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  },
);

IdImageField.displayName = "IdImageField";
export default IdImageField;
