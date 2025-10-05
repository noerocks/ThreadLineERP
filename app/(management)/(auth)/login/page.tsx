import AuthHeader from "@/components/management/auth-header";
import LoginForm from "@/components/management/login-form";

const LoginPage = () => {
  return (
    <div className="flex flex-col flex-1 p-5">
      <AuthHeader />
      <div className="flex-1 flex justify-center items-center">
        <LoginForm className="w-2/4" />
      </div>
    </div>
  );
};

export default LoginPage;
