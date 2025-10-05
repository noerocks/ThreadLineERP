import RegisterForm from "@/components/management/register-form";
import { ScrollArea } from "@/components/ui/scroll-area";

const RegisterPage = () => {
  return (
    <div className="flex min-h-svh">
      <ScrollArea className="flex-1 flex flex-col p-5 gap-10 h-screen">
        <p>ThreadLine.</p>
        <RegisterForm className="w-2/4 mx-auto flex-1" />
      </ScrollArea>
      <div className="flex-1 bg-fuchsia-50"></div>
    </div>
  );
};

export default RegisterPage;
