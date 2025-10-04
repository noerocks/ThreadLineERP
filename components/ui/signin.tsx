"use client";

import { signIn } from "next-auth/react";

const Signin = () => {
  return (
    <div>
      <button onClick={() => signIn("google")}>Signin</button>
    </div>
  );
};

export default Signin;
