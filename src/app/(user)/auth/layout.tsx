import { AuthBrandLogo } from "@/components/auth/AuthBrandLogo";
import { ThemeToggle } from "@/components/dashboard/ThemeToggle";
import { UserProvider } from "@/lib/context/UserContext";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <div className="relative hidden min-h-screen w-full bg-[url('/bg-1.jpg')] bg-cover bg-center p-10 md:block">
        <div className="absolute inset-0 bg-background/20 dark:bg-background/50" />
        <div className="relative flex items-center gap-2">
          <AuthBrandLogo priority />
        </div>
      </div>
      <div className="relative flex w-full flex-col bg-background">
        <div className="flex items-center justify-between px-4 pt-4 sm:px-6 sm:pt-6 md:hidden">
          <AuthBrandLogo />
          <ThemeToggle />
        </div>
        <div className="relative flex flex-1 items-center justify-center">
          <div className="absolute right-4 top-4 z-10 hidden sm:right-6 sm:top-6 md:block">
            <ThemeToggle />
          </div>
          <UserProvider>{children}</UserProvider>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
