import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SheetFooter } from "@/components/ui/sheet";
import { createPurchaseOrder } from "@/lib/actions/purchase-order";
import { ProductsDTO } from "@/lib/DTO/products";
import { SuppliersDTO } from "@/lib/DTO/suppliers";
import { CreatePurchaseOrderSchehma } from "@/lib/zod-definitions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Loader, X } from "lucide-react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

type CreatePurchaseOrderFormProps = {
  cart: { product: ProductsDTO; quantity: string }[];
  suppliers: SuppliersDTO[];
  resetCart: (value: []) => void;
};

const CreatePurchaseOrderForm = ({
  cart,
  suppliers,
  resetCart,
}: CreatePurchaseOrderFormProps) => {
  const form = useForm<z.infer<typeof CreatePurchaseOrderSchehma>>({
    resolver: zodResolver(CreatePurchaseOrderSchehma),
    defaultValues: {
      supplier: "",
      address: "",
    },
  });
  const total = cart.reduce(
    (sum, item) => (sum += item.product.cost * Number(item.quantity)),
    0
  );
  const [pending, startTransition] = useTransition();
  const handleSubmit = async (
    data: z.infer<typeof CreatePurchaseOrderSchehma>
  ) => {
    startTransition(async () => {
      const result = await createPurchaseOrder(
        data.supplier,
        data.address,
        cart
      );
      resetCart([]);
      if (result.failure) {
        toast.error(result.failure.error);
        return;
      }
      if (result.success) {
        toast.success(result.success.message);
        return;
      }
    });
  };
  return (
    <Form {...form}>
      <form
        className="px-4 flex flex-col gap-5"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField
          control={form.control}
          name="supplier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Supplier</FormLabel>
              <FormControl>
                <Select
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Please select a supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((supplier) => (
                      <SelectItem key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                Chooose from our partner suppliers
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Delivery Address</FormLabel>
              <FormControl>
                <Input {...field} autoComplete="off" />
              </FormControl>
              <FormMessage />
              <FormDescription>
                Specify the address for delivery
              </FormDescription>
            </FormItem>
          )}
        />
        <FormLabel>Items</FormLabel>
        <Card className="flex-1 min-h-0 bg-background">
          <CardContent className="flex flex-col gap-5">
            <div className="flex justify-between items-center py-2 sticky top-0">
              <p>Product</p>
              <p>Total</p>
            </div>
            {cart &&
              cart.map((item, i) => (
                <div className="flex items-center gap-5" key={i}>
                  <div className="flex-1 flex flex-col gap-2">
                    <p className="text-sm">{item.product.name}</p>
                    <div className="flex gap-2 items-center text-muted-foreground text-xs">
                      <p>
                        {new Intl.NumberFormat("en-PH", {
                          style: "currency",
                          currency: "PHP",
                        }).format(item.product.cost)}
                      </p>
                      <X size={10} />
                      <p>{item.quantity}</p>
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <p>{`Size: ${item.product.size}`}</p>
                      <p>{`Color: ${item.product.color}`}</p>
                    </div>
                  </div>
                  <p className="text-sm">
                    {new Intl.NumberFormat("en-PH", {
                      style: "currency",
                      currency: "PHP",
                    }).format(item.product.cost * Number(item.quantity))}
                  </p>
                </div>
              ))}
          </CardContent>
        </Card>
        <div className="flex flex-col gap-3 border-t">
          <div className="flex justify-between items-center py-5">
            <p>Total</p>
            <p className="font-semibold">
              {new Intl.NumberFormat("en-PH", {
                style: "currency",
                currency: "PHP",
              }).format(total)}
            </p>
          </div>
          <Button type="submit">
            {pending ? (
              <>
                <Loader className="animate-spin" />
                Generating Purchase Order...
              </>
            ) : (
              <>
                <Check />
                Generate Purchase Order
              </>
            )}
          </Button>
          <Button type="reset" variant="outline" onClick={() => resetCart([])}>
            Reset Cart
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreatePurchaseOrderForm;
