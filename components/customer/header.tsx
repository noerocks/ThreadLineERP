"use client";

import { LogOut, Power, ShoppingCart } from "lucide-react";
import Signin from "../google-signin";
import { Button } from "../ui/button";
import { ModeToggle } from "../theme-toggle";
import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getInitialsFromName } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const CustomerHeader = () => {
  const { data: session } = useSession();
  const user = session?.user;
  return (
    <div className="flex items-center justify-between p-5">
      <p className="text-3xl">ThreadLine.</p>
      <div className="flex items-center gap-2">
        <ModeToggle />
        <Button variant="ghost">
          <ShoppingCart />
        </Button>
        {session && user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar>
                <AvatarImage src={user.image!} />
                <AvatarFallback>
                  {getInitialsFromName(user.name!)}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="end" sideOffset={5}>
              <DropdownMenuItem
                className="flex items-center"
                variant="destructive"
                onClick={() => {
                  signOut();
                }}
              >
                <Power />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Signin />
        )}
      </div>
    </div>
  );
};

export default CustomerHeader;
