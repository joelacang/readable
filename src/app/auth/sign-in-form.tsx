import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import type z from "zod";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { authClient } from "~/lib/auth-client";
import { signInSchema } from "~/zod-schemas/auth";

const SignInForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (values: z.infer<typeof signInSchema>) => {
    await authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
        callbackURL: "/",
      },
      {
        onRequest: () => {
          toast.loading(`Singing in your account...`, { id: "sign-in-toast" });
          setIsLoading(true);
        },
        onSuccess: () => {
          toast.success(`Successfully signed in.`);
          router.push("/");
        },
        onError: () => {
          toast.error(`Error signing to you account.`);
        },
        onResponse: () => {
          toast.dismiss("sign-in-toast");
          setIsLoading(false);
        },
      },
    );
  };
  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        {/* Email field */}
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem className="relative">
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <MailIcon className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                <Input
                  type="email"
                  className="h-12 w-full pl-10"
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
                  {...field}
                />
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password field */}
        <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem className="relative">
              <FormLabel className="block text-sm font-medium text-gray-700">
                Password
              </FormLabel>
              <div className="relative">
                <LockIcon className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                <Input
                  type={showPassword ? "text" : "password"}
                  className="h-12 w-full pl-10"
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                  {...field}
                />
                <Button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-primary hover:text-primary absolute top-1/2 right-3 -translate-y-1/2 transform cursor-pointer rounded-full transition-colors"
                  variant="ghost"
                  size="icon"
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Remember me checkbox */}
        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="rememberMe"
              className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-indigo-600 focus:ring-2 focus:ring-indigo-500"
            />
            <span className="ml-2 text-sm text-gray-600">Remember me</span>
          </label>

          <a
            href="#"
            className="text-primary hover:text-primary text-sm transition-colors"
          >
            Forgot password?
          </a>
        </div>

        {/* Submit button */}
        <div className="mt-6">
          <Button
            type="submit"
            className="from-almond-500 to-almond-700 focus:ring-almond-500 h-12 w-full transform cursor-pointer rounded-lg bg-linear-to-r font-semibold text-white shadow-lg transition-all duration-200 hover:scale-[1.02] focus:ring-2 focus:ring-offset-2 focus:outline-none"
            disabled={!form.formState.isValid || isLoading}
          >
            Sign In
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SignInForm;
