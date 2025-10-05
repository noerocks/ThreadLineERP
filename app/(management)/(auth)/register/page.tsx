import AuthHeader from "@/components/management/auth-header";
import RegisterForm from "@/components/management/register-form";
import { ScrollArea } from "@/components/ui/scroll-area";

const RegisterPage = () => {
  return (
    <ScrollArea className="flex flex-col flex-1 p-5 h-screen relative">
      <AuthHeader className="sticky top-0" />
      <div className="flex-1 flex items-center justify-center">
        <RegisterForm className="w-2/4 mt-10" />
      </div>
    </ScrollArea>
  );
};

export default RegisterPage;
