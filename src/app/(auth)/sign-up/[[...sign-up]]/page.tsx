"use client";
import { SignUp } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { dark } from "@clerk/ui/themes";

export default function Page() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="flex min-h-screen justify-center">
      <SignUp
        appearance={{
          theme: theme === "dark" ? dark : undefined,
        }}
      />
    </div>
  );
}
