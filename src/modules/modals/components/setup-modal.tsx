"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RHFormContainer } from "@/modules/form/ui/components/rhf-form-container";
import { RHFInput } from "@/modules/form/ui/components/rhf-input";
import { useForm } from "react-hook-form";
import { CreateServerFormData, createServerSchema } from "../lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function InitialModal() {
  const router = useRouter();

  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | "pending" | null;
    message: string;
  }>({ type: null, message: "" });

  const form = useForm<CreateServerFormData>({
    resolver: zodResolver(createServerSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });

  const isAnyLoading = form.formState.isSubmitting;

  const onSubmit = async (data: CreateServerFormData) => {
    try {
      setSubmitStatus({ type: "pending", message: "" });

      const response = await fetch("/api/servers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      console.log("=============>", response);

      if (!response.ok) throw new Error("Failed to create server");

      const newServer = await response.json();

      // Navigate to the new server page
      router.push(`/servers/${newServer.id}`);
    } catch (error) {
      console.error(error);

      setSubmitStatus({
        type: "error",
        message:
          error instanceof Error ? error.message : "Couldn't create the server",
      });
    }
  };

  return (
    <Dialog open>
      <DialogContent className="sm:max-w-sm">
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
          status={submitStatus}
          showDebug={false}
          disabled={isAnyLoading}
        >
          <RHFInput
            name="imageUrl"
            control={form.control}
            label="Server Image"
            disabled={isAnyLoading}
            type="image"
            folder="/profile/server"
          />

          <RHFInput
            name="name"
            control={form.control}
            type="text"
            label="Server name"
            disabled={isAnyLoading}
          />
        </RHFormContainer>
        <DialogFooter>
          <Button
            type="submit"
            size={"lg"}
            disabled={isAnyLoading}
            onClick={form.handleSubmit(onSubmit)}
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Create
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
