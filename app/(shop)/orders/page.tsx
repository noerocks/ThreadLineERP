import { auth } from "@/auth";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingBag } from "lucide-react";

const OrdersPage = async () => {
  const session = await auth();
  return (
    <div className="flex flex-col gap-5 mx-50 my-10">
      <p className="text-xl flex items-center gap-2">
        <ShoppingBag />
        Your Orders
      </p>
      <Tabs defaultValue="pending">
        <TabsList className="bg-background border">
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="inTransit">In Transit</TabsTrigger>
          <TabsTrigger value="received">Received</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default OrdersPage;
