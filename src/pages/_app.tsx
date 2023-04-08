import "src/styles/globals.css";
import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { api } from "src/utils/api";
import { DialogProvider } from "src/context/DialogContext";
import { SignInDialog } from "src/components/Signin";

const App: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <DialogProvider>
        <SignInDialog />
        <Component {...pageProps} />
      </DialogProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(App);
