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
import { authClient } from "@/modules/auth/lib/auth-client";
import GithubLogo from "@/components/layout/icons/github";

const LoginForm = () => {
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | "pending" | null;
    message: string;
  }>({ type: null, message: "" });

  // Track social login loading states
  const [socialLoading, setSocialLoading] = useState<{
    github: boolean;
    google: boolean;
  }>({ github: false, google: false });

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const isAnyLoading =
    form.formState.isSubmitting || socialLoading.github || socialLoading.google;

  const onSubmit = async (data: LoginFormData) => {
    try {
      setSubmitStatus({ type: "pending", message: "" });

      const result = await authClient.signIn.email({
        email: data.email,
        password: data.password,
        callbackURL: "/",
      });

      if (result.error) {
        throw new Error(result.error.message || "Invalid email or password");
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

  const handleSocialLogin = async (provider: "github" | "google") => {
    try {
      setSocialLoading((prev) => ({ ...prev, [provider]: true }));
      setSubmitStatus({
        type: "pending",
        message: `Signing in with ${provider}...`,
      });

      const result = await authClient.signIn.social({
        provider: provider,
        callbackURL: "/", // Redirect URL after successful login
      });

      if (result.error) {
        throw new Error(
          result.error.message || `Failed to log in with ${provider}`,
        );
      }
    } catch (error) {
      console.error(`${provider} login error:`, error);

      setSubmitStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : `Failed to sign in with ${provider}. Please try again.`,
      });
    } finally {
      setSocialLoading((prev) => ({ ...prev, [provider]: false }));
    }
  };

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

      <Button
        className="mt-4 w-full gap-3"
        variant={"secondary"}
        size={"lg"}
        onClick={() => handleSocialLogin("google")}
      >
        <GoogleLogo />
        Continue with Google
      </Button>
      <Button
        className="mt-4 w-full gap-3"
        variant={"secondary"}
        size={"lg"}
        onClick={() => handleSocialLogin("github")}
      >
        <GithubLogo />
        Continue with Github
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
