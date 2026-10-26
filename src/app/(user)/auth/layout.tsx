import { AuthBrandLogo } from "@/components/auth/AuthBrandLogo";
import { LanguageSelector } from "@/components/public/LanguageSelector";
import { ThemeToggle } from "@/components/dashboard/ThemeToggle";
import { UserProvider } from "@/lib/context/UserContext";
import { getPublicSite } from "@/lib/public/home-payload";

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  const site = await getPublicSite();

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <div className="relative hidden min-h-screen w-full bg-[url('/bg-1.jpg')] bg-cover bg-center p-10 md:block">
        <div className="absolute inset-0 bg-background/20 dark:bg-background/50" />
        <div className="relative flex items-center gap-2">
          <AuthBrandLogo priority />
        </div>
      </div>
      <div className="relative flex w-full flex-col bg-background">
        <div className="flex items-center justify-between gap-2 px-4 pt-4 sm:px-6 sm:pt-6">
          <div className="md:hidden">
            <AuthBrandLogo />
          </div>
          <div className="ml-auto flex items-center gap-2">
            {site.googleTranslate ? (
              <LanguageSelector variant="app" />
            ) : null}
            <ThemeToggle />
          </div>
        </div>
        <div className="relative flex flex-1 items-center justify-center">
          <UserProvider>{children}</UserProvider>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
