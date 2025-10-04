"use client";

import { signIn, signOut, useSession } from "next-auth/react";

const Signin = () => {
  const { data: session } = useSession();
  console.log(session);
  return (
    <div>
      <button onClick={() => signIn("google")}>Signin</button>
      <button onClick={() => signOut()}>Signin</button>
    </div>
  );
};

export default Signin;
