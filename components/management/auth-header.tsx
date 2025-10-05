import { cn } from "@/lib/utils";
import { ModeToggle } from "../theme-toggle";

const AuthHeader = ({ className, ...props }: React.ComponentProps<"div">) => {
  return (
    <div
      {...props}
      className={cn("flex items-center justify-between", className)}
    >
      <p className="font-semibold text-lg">ThreadLine.</p>
      <ModeToggle />
    </div>
  );
};

export default AuthHeader;
