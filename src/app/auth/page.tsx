"use client";
import React, { useState } from "react";
import SignUpForm from "./sign-up-form";
import { Button } from "~/components/ui/button";
import { DiscordIcon } from "~/icons/discord";
import { GoogleIcon } from "~/icons/google";
import Logo from "~/components/logo";
import { Card } from "~/components/ui/card";
import SignInForm from "./sign-in-form";
import { authClient } from "~/lib/auth-client";

export default function AuthComponent() {
  const [mode, setMode] = useState("signin"); // 'signin' or 'signup'

  const handleSocialLogin = async (provider: string) => {
    await authClient.signIn.social({
      provider,
      callbackURL: "/",
      errorCallbackURL: "/error",
    });
  };

  const toggleMode = () => {
    setMode((prev) => (prev === "signin" ? "signup" : "signin"));
  };

  return (
    <div className="from-almond-50 to-almond-200 flex min-h-screen items-center justify-center bg-linear-to-br px-4 py-8">
      <Card className="hover:shadow-3xl bg-background w-full max-w-md transform rounded-2xl p-8 shadow-2xl transition-all duration-300">
        {/* Logo */}
        <div className="mb-8 flex w-full flex-col items-center justify-center gap-2">
          <Logo orientation="horizontal" showLabel />
          <p className="text-muted-foreground text-sm">
            {mode === "signin"
              ? "Welcome back! Please sign in to continue."
              : "Create your account to get started."}
          </p>
        </div>

        {/* Form */}
        {mode === "signup" && <SignUpForm />}
        {mode === "signin" && <SignInForm />}

        {/* Social login divider */}
        <div className="my-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-card text-primary px-4">
                Or continue with
              </span>
            </div>
          </div>
        </div>

        {/* Social login buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleSocialLogin("google")}
            className="group flex cursor-pointer items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 hover:shadow-md"
          >
            <GoogleIcon />
            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
              Google
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleSocialLogin("discord")}
            className="group flex cursor-pointer items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 hover:shadow-md"
          >
            <DiscordIcon />
            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
              Discord
            </span>
          </button>
        </div>

        {/* Mode toggle */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {mode === "signin"
              ? "Don't have an account? "
              : "Already have an account? "}
            <Button
              type="button"
              onClick={toggleMode}
              className="text-primary hover:text-primary cursor-pointer font-medium underline-offset-4 transition-colors hover:underline"
              variant="link"
            >
              {mode === "signin" ? "Sign up" : "Sign in"}
            </Button>
          </p>
        </div>
      </Card>
    </div>
  );
}
