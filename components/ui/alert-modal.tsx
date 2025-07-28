"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  type?: "alert" | "confirm";
}

export function AlertModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "OK",
  cancelText = "Cancel",
  type = "alert",
}: AlertModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {type === "confirm" && (
            <AlertDialogCancel onClick={onClose}>
              {cancelText}
            </AlertDialogCancel>
          )}
          <AlertDialogAction
            onClick={() => {
              if (onConfirm) {
                onConfirm();
              }
              onClose();
            }}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Hook for easier usage
export function useAlertModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<{
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    type?: "alert" | "confirm";
    onConfirm?: () => void;
  }>({
    title: "",
    description: "",
  });

  const showAlert = (
    title: string,
    description: string,
    confirmText?: string
  ) => {
    setConfig({
      title,
      description,
      confirmText,
      type: "alert",
    });
    setIsOpen(true);
  };

  const showConfirm = (
    title: string,
    description: string,
    onConfirm: () => void,
    confirmText?: string,
    cancelText?: string
  ) => {
    setConfig({
      title,
      description,
      confirmText,
      cancelText,
      type: "confirm",
      onConfirm,
    });
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const AlertModalComponent = () => (
    <AlertModal
      isOpen={isOpen}
      onClose={closeModal}
      onConfirm={config.onConfirm}
      title={config.title}
      description={config.description}
      confirmText={config.confirmText}
      cancelText={config.cancelText}
      type={config.type}
    />
  );

  return {
    showAlert,
    showConfirm,
    AlertModalComponent,
  };
}
