"use client";

import { Show, SignInButton, useClerk } from "@clerk/nextjs";
import { Map, MessageSquare, Sparkle } from "lucide-react";
import Link from "next/link";
import ToggleTheme from "./ToggleTheme";
import { Button } from "./ui/button";

interface Props {}

const Navbar = ({}: Props) => {
  const { loaded } = useClerk();
  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href={"/"}>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-linear-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <Sparkle className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold">Feedback Fusion</span>
            </div>
          </Link>
          <Link
            href={"/roadmap"}
            className="text-sm hover:text-primary flex items-center gap-1"
          >
            <Map className="h-4 w-4" />
            Roadmap
          </Link>
          <Link
            href={"/feedback"}
            className="text-sm hover:text-primary flex items-center gap-1"
          >
            <MessageSquare className="h-4 w-4" />
            Feedback
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <ToggleTheme />
          <Show when={"signed-out"}>
            <SignInButton>
              <Button asChild>
                <Link href={"/sign-in"}>Sign In</Link>
              </Button>
            </SignInButton>
          </Show>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
