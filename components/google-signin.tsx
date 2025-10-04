"use client";

import { signIn } from "next-auth/react";
import { Button } from "./ui/button";

const Signin = () => {
  return (
    <div>
      <Button onClick={() => signIn("google")}>Sign in with Google</Button>
    </div>
  );
};

export default Signin;
