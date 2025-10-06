"use client";

import { LoginFormSchema } from "@/lib/zod-definitions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import Link from "next/link";

const LoginForm = ({ className, ...props }: React.ComponentProps<"form">) => {
  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = (data: z.infer<typeof LoginFormSchema>) => {
    console.log(data);
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        {...props}
        className={cn("flex flex-col gap-5", className)}
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold">Welcome Back!</h2>
          <p className="text-sm text-balance text-muted-foreground">
            Provide your credentials to log in to your account
          </p>
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} autoComplete="off" />
              </FormControl>
              <FormDescription>Please enter your email</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input {...field} type="password" autoComplete="off" />
              </FormControl>
              <FormDescription>Please enter your password</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full">Sign in</Button>
        <p className="text-muted-foreground text-sm text-balance text-center">
          Don't have an account?{" "}
          <Link href={"/register"} className="underline">
            Sign up
          </Link>
        </p>
      </form>
    </Form>
  );
};

export default LoginForm;
