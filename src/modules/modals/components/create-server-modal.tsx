"use client";

import { useModalStore } from "@/store/modal-store";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RHFormContainer } from "@/modules/form/ui/components/rhf-form-container";
import { RHFInput } from "@/modules/form/ui/components/rhf-input";
import {
  createServerSchema,
  type CreateServerFormData,
} from "@/modules/modals/lib/schema";

interface CreateServerModalProps {
  // When true the dialog has no close button and can't be dismissed.
  // Used as the initial "create your first server" flow.
  forceOpen?: boolean;
}

export function CreateServerModal({
  forceOpen = false,
}: CreateServerModalProps) {
  const { isOpen, type, close, isSubmitting, setSubmitting } = useModalStore();
  const router = useRouter();

  // This modal handles both the forced initial flow and the normal open/close flow.
  const open = forceOpen || (isOpen && type === "createServer");

  const form = useForm<CreateServerFormData>({
    resolver: zodResolver(createServerSchema),
    defaultValues: { name: "", imageUrl: "" },
  });

  const isLoading = form.formState.isSubmitting || isSubmitting;

  async function onSubmit(data: CreateServerFormData) {
    try {
      setSubmitting(true);
      const response = await fetch("/api/servers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to create server");

      const newServer = await response.json();
      form.reset();
      if (!forceOpen) close();
      router.push(`/servers/${newServer.id}`);
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog
      open={open}
      // forceOpen = no escape, no outside click, no X button
      onOpenChange={
        forceOpen
          ? undefined
          : (o) => {
              if (!o) close();
            }
      }
    >
      <DialogContent
        className="sm:max-w-sm"
        // Removes the default shadcn close (X) button when forced
        {...(forceOpen && { hideCloseButton: true })}
      >
        <DialogHeader>
          <DialogTitle>Customize your server</DialogTitle>
          <DialogDescription>
            Give your server a personality with a name and an image. You can
            always change it later.
          </DialogDescription>
        </DialogHeader>

        <RHFormContainer
          form={form}
          onSubmit={onSubmit}
          showDebug={false}
          disabled={isLoading}
        >
          <RHFInput
            name="imageUrl"
            control={form.control}
            label="Server Image"
            disabled={isLoading}
            type="image"
            folder="/profile/server"
          />
          <RHFInput
            name="name"
            control={form.control}
            type="text"
            label="Server name"
            disabled={isLoading}
          />
        </RHFormContainer>

        <DialogFooter>
          <Button
            size="lg"
            disabled={isLoading}
            onClick={form.handleSubmit(onSubmit)}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
