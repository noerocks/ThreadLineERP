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

const ShopHeader = () => {
  const { data: session } = useSession();
  const user = session?.user;
  return (
    <header className="flex items-center justify-between p-5 border">
      <p className="text-4xl">ThreadLine.</p>
      <div className="flex items-center gap-5">
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
    </header>
  );
};

export default ShopHeader;
