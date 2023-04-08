import "src/styles/globals.css";
import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { api } from "src/utils/api";
import { DialogProvider } from "src/context/DialogContext";
import { SignInDialog } from "src/components/Signin";
import PlausibleProvider from "next-plausible";

const App: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <PlausibleProvider domain="howler.andyfx.net">
      <SessionProvider session={session}>
        <DialogProvider>
          <SignInDialog />
          <Component {...pageProps} />
        </DialogProvider>
      </SessionProvider>
    </PlausibleProvider>
  );
};

export default api.withTRPC(App);
