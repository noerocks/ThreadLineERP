import { auth } from "@/auth";
import { columns } from "@/components/management/dashboard/order/columns";
import { DataTable } from "@/components/management/dashboard/order/data-table";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAllSalesByCustomerId } from "@/lib/DAL/sale";
import { ShoppingBag } from "lucide-react";

const OrdersPage = async () => {
  const session = await auth();
  const orders = await getAllSalesByCustomerId(session?.user?.id!);
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
        <TabsContent value="pending">
          <Card className="bg-background">
            <CardContent>
              <DataTable
                columns={columns}
                data={orders.filter((order) => order.status === "PENDING")}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="inTransit">
          <Card className="bg-background">
            <CardContent>
              <DataTable
                columns={columns}
                data={orders.filter((order) => order.status === "IN_TRANSIT")}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="received">
          <Card className="bg-background">
            <CardContent>
              <DataTable
                columns={columns}
                data={orders.filter((order) => order.status === "ARRIVED")}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrdersPage;
