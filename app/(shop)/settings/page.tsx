import { auth } from "@/auth";
import CustomerForm from "@/components/shop/customer-form";
import { User } from "@prisma/client";

const SettingsPage = async () => {
  const session = await auth();
  return (
    <div className="flex flex-col gap-5 mx-120 my-10">
      <CustomerForm user={session?.user! as User} />
    </div>
  );
};

export default SettingsPage;
