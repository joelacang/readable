import { Button } from "~/components/ui/button";
import { signUpSchema } from "~/zod-schemas/auth";
import {
  AtSignIcon,
  EyeIcon,
  EyeOffIcon,
  Loader2Icon,
  LockIcon,
  MailIcon,
  UserIcon,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { toast } from "react-hot-toast";
import { authClient } from "~/lib/auth-client";
import { useRouter } from "next/navigation";
const SignUpForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      name: "",
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
    await authClient.signUp.email(
      {
        email: values.email,
        name: values.name,
        username: values.username,
        password: values.password,
        callbackURL: "/",
      },
      {
        onRequest: () => {
          setIsLoading(true);
          toast.loading("Creating your account...", { id: "sign-up-toast" });
        },
        onSuccess: () => {
          toast.success(
            "Account created successfully! Please check your email.",
          );
          form.reset();
          router.push("/");
        },
        onError: (error) => {
          toast.error(`Error creating account: ${error.error.message}`);
        },
        onResponse: () => {
          setIsLoading(false);
          toast.dismiss("sign-up-toast");
        },
      },
    );

    setIsLoading(false);
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem className="relative">
              <FormLabel className="block text-sm font-medium text-gray-700">
                Full Name
              </FormLabel>
              <div className="relative">
                <UserIcon className="text-primary absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform" />
                <Input
                  type="text"
                  className="h-12 pl-10"
                  placeholder="Enter your Full name"
                  required
                  {...field}
                />
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="username"
          control={form.control}
          render={({ field }) => (
            <FormItem className="relative">
              <FormLabel className="block text-sm font-medium text-gray-700">
                Username
              </FormLabel>
              <div className="relative">
                <AtSignIcon className="text-primary absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform" />
                <Input
                  type="text"
                  className="h-12 pl-10"
                  placeholder="Enter your username"
                  required
                  {...field}
                />
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem className="relative">
              <FormLabel className="block text-sm font-medium text-gray-700">
                E-mail
              </FormLabel>
              <div className="relative">
                <MailIcon className="text-primary absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform" />
                <Input
                  type="text"
                  className="h-12 pl-10"
                  placeholder="Enter your e-mail address"
                  required
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
            <FormItem>
              <FormLabel>Password</FormLabel>
              <div className="relative">
                <LockIcon className="text-primary absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform" />
                <Input
                  type={showPassword ? "text" : "password"}
                  className="text h-12 pl-10"
                  placeholder="Enter your password"
                  required
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

        {/* Submit button */}
        <div className="mt-6">
          <Button
            type="submit"
            className="from-almond-500 to-almond-700 focus:ring-almond-500 h-12 w-full transform cursor-pointer rounded-lg bg-linear-to-r font-semibold text-white shadow-lg transition-all duration-200 hover:scale-[1.02] focus:ring-2 focus:ring-offset-2 focus:outline-none"
            disabled={!form.formState.isValid || isLoading}
          >
            {isLoading && <Loader2Icon className="mr-2 animate-spin" />}
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SignUpForm;
