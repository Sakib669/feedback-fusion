"use client";

import { SignInButton, useClerk } from "@clerk/nextjs";

interface Props {}

const Navbar = ({}: Props) => {
  const { loaded } = useClerk();
  return (
    <div>
      Navbar
      {loaded && <SignInButton />}
    </div>
  );
};

export default Navbar;
