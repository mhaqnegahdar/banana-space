"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";

import Logo from "@/components/layout/logo";
import GoogleLogo from "@/components/layout/icons/google";
import { LoginFormData, loginSchema } from "../../schema";
import { useState } from "react";
import { RHFormContainer } from "@/modules/form/ui/components/rhf-form-container";
import { RHFInput } from "@/modules/form/ui/components/rhf-input";

const LoginForm = () => {
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | "pending" | null;
    message: string;
  }>({ type: null, message: "" });

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setSubmitStatus({ type: "pending", message: "" });

      const result = setTimeout(() => Math.floor(Math.random() * 2), 2000);

      if (!result) {
        throw new Error(
          // result.message ||
          "Invalid email or password",
        );
      }
    } catch (error) {
      console.error(error);

      setSubmitStatus({
        type: "error",
        message:
          error instanceof Error ? error.message : "Invalid email or password",
      });
    }
  };

  const isAnyLoading = form.formState && false;
  return (
    <div className="relative isolate flex flex-col items-center">
      <Logo size={"md"} />
      <p className="mt-4 mb-6 font-medium text-xl">Welcome Back!</p>

      <RHFormContainer
        form={form}
        onSubmit={onSubmit}
        submitText="Login"
        loadingText="Logging in..."
        status={submitStatus}
        showDebug={false}
        disabled={isAnyLoading}
      >
        <RHFInput
          name="email"
          control={form.control}
          type="email"
          label="Email"
          placeholder="john@example.com"
          disabled={isAnyLoading}
        />
        <RHFInput
          name="password"
          control={form.control}
          type="password"
          label="Password"
          disabled={isAnyLoading}
        />
      </RHFormContainer>

      <Button className="mt-4 w-full gap-3" variant={"secondary"} size={"lg"}>
        <GoogleLogo />
        Continue with Google
      </Button>

      <p className="mt-6 text-center text-sm">
        Need an account?
        <Link className="ml-1 text-muted-foreground underline" href="/signup">
          Register
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
