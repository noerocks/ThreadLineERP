"use client";

import { LogOut, Power, ShoppingCart } from "lucide-react";
import Signin from "../google-signin";
import { Button } from "../ui/button";
import { ModeToggle } from "../theme-toggle";
import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn, getInitialsFromName, screamingSnakeToTitle } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Category } from "@prisma/client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ShopHeader = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const pathName = usePathname();
  const categories = ["SHOP_ALL", ...Object.values(Category)];
  return (
    <header className="flex items-center justify-between px-20 py-5 border-b">
      <p className="text-4xl">ThreadLine.</p>
      <div className="flex items-center gap-10">
        {categories.map((cat) => (
          <Link
            href={cat === "SHOP_ALL" ? "/" : `/category/${cat}`}
            key={cat}
            className={cn("text-muted-foreground hover:text-foreground", {
              "text-foreground underline underline-offset-8":
                pathName.split("/")[2] === cat,
            })}
          >
            {screamingSnakeToTitle(cat)}
          </Link>
        ))}
      </div>
      <div className="flex items-center gap-5">
        <ModeToggle />
        <Button variant="ghost">
          <ShoppingCart />
        </Button>
        {session && user ? (
          <>
            <p className="text-muted-foreground">{user.email}</p>
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
          </>
        ) : (
          <Signin />
        )}
      </div>
    </header>
  );
};

export default ShopHeader;
