"use client";

import { CustomerFormSchema } from "@/lib/zod-definitions";
import { User } from "@prisma/client";
import { useForm } from "react-hook-form";
import z from "zod";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Loader2, UserIcon } from "lucide-react";
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
import { Button } from "../ui/button";
import { useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUser } from "@/lib/actions/user";
import { toast } from "sonner";

const CustomerForm = ({ user }: { user: User }) => {
  const form = useForm<z.infer<typeof CustomerFormSchema>>({
    resolver: zodResolver(CustomerFormSchema),
    defaultValues: {
      name: user.name || "",
      address: user.address || "",
      contactNumber: user.contactNumber || "",
    },
  });
  const [pending, startTransition] = useTransition();
  const onSubmit = async (data: z.infer<typeof CustomerFormSchema>) => {
    startTransition(async () => {
      const result = await updateUser({ id: user.id, ...data });
      if (result.success) {
        toast.success(result.success.message);
        return;
      }
      if (result.failure) {
        toast.error(result.failure.error);
        return;
      }
    });
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserIcon />
          Profile Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="flex flex-col gap-5"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <Form {...form}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} autoComplete="off" />
                  </FormControl>
                  <FormDescription>Please enter your name</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input {...field} autoComplete="off" />
                  </FormControl>
                  <FormDescription>Please enter your address</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Number</FormLabel>
                  <FormControl>
                    <Input {...field} autoComplete="off" />
                  </FormControl>
                  <FormDescription>
                    Please enter your contact number
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Form>
          <Button disabled={pending}>
            {pending ? (
              <>
                <Loader2 className="animate-spin" />
                Saving Changes
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CustomerForm;
