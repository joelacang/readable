import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { useConfirmationAlert } from "../hooks/use-confirm-dialog";
import { cn } from "~/lib/utils";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "~/components/ui/input-otp";
import React, { useCallback, useEffect, useState } from "react";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import toast from "react-hot-toast";
import { Loader2Icon } from "lucide-react";
import FormActionButton from "~/components/form-action-button";

const ConfirmAlert = () => {
  const {
    confirmDetails,
    confirmCode,
    open,
    isPending,
    isError,
    isCompleted,
    error,
    onClose,
    onValidate: validate,
    onError: setError,
    onConfirm: confirm,
  } = useConfirmationAlert();
  const [code, setCode] = useState<string | null>(null);

  useEffect(() => {
    // Clear code whenever alert state changes
    setCode(null);
  }, [open]);

  if (!confirmDetails) return null;

  const Icon = confirmDetails.icon;

  const handleConfirmation = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (confirmDetails.enableConfirmation) {
      const isValidCode = validate(code);

      if (!isValidCode) {
        setError("Invalid Confirmation Code.");
        return;
      }
    }

    const ok = confirm();

    if (!ok) return;
  };

  const handleClose = () => {
    onClose();
    setCode(null);
  };

  return (
    <AlertDialog open={open} onOpenChange={handleClose}>
      <AlertDialogContent>
        <AlertDialogHeader className="flex flex-row items-start justify-start">
          <div className="py-2 pr-2">
            <Icon
              className={cn(
                "!size-10",
                confirmDetails.mode === "destructive"
                  ? "text-destructive"
                  : "text-primary",
              )}
            />
          </div>

          <div className="flex flex-col items-start justify-start">
            <AlertDialogTitle className="text-left">
              {confirmDetails.title}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-left">
              {confirmDetails.message}
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>

        <div className="w-full overflow-hidden">
          {confirmDetails.children?.()}
        </div>

        {confirmDetails.enableConfirmation && (
          <div>
            <p className="text-muted-foreground py-2 text-sm">
              Please enter the confirmation code to continue.
            </p>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-sm">
                  CODE:&nbsp;
                </span>
                <span className="text-2xl font-semibold tracking-wider">
                  {confirmCode}
                </span>
              </div>
              <div className="flex flex-col items-center justify-center gap-3 py-4">
                <InputOTP
                  maxLength={6}
                  value={code ?? ""}
                  onChange={(value) => {
                    setCode(value);
                    if (value === confirmCode) {
                      setError(null);
                    }
                  }}
                  pattern={REGEXP_ONLY_DIGITS}
                  disabled={isPending}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
                {isError && <p className="text-destructive text-sm">{error}</p>}
              </div>
            </div>
          </div>
        )}
        <AlertDialogFooter className="pt-4">
          <AlertDialogCancel onClick={handleClose}>Cancel</AlertDialogCancel>
          <FormActionButton
            mode="delete"
            isPending={isPending}
            disabled={
              isPending ||
              (confirmDetails.enableConfirmation && (code === "" || !code))
            }
            onClick={handleConfirmation}
          />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmAlert;
