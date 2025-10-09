"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";

const AuthenticationLayout = ({ children }: { children: React.ReactNode }) => {
  const path = usePathname();
  return (
    <div className="flex min-h-svh">
      {children}
      <div className="bg-muted relative hidden lg:block flex-1">
        <Image
          src={
            path === "/register"
              ? "/man-wearing-jacket-near-wall-in-room.jpg"
              : "/man-in-black-jacket-sitting-on-black-chair.jpg"
          }
          alt="Image"
          fill
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.5] dark:grayscale"
        />
      </div>
    </div>
  );
};

export default AuthenticationLayout;
