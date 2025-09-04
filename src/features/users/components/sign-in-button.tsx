"use client";
import { LockIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";

const SignInButton = () => {
  const router = useRouter();
  return (
    <Button onClick={() => router.push("/auth")} className="cursor-pointer">
      <LockIcon />
      Sign In
    </Button>
  );
};

export default SignInButton;
