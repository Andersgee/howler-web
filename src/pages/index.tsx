import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "src/utils/api";
//import { hashidFromNumber } from "src/utils/hashids";
import { SEO } from "src/components/SEO";
import { LayoutHome } from "src/components/LayoutHome";

export default function Page() {
  //const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <SEO
        title="Howler"
        description="Looking for something to do in real life? A place to quickly find/plan stuff to do with friends, or with anyone really."
        url="https://howler.andyfx.net"
        image="/icons/favicon-512x512.png"
      />
      <LayoutHome />
    </>
  );
}

function AuthShowcase() {
  const { data: session } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: session?.user !== undefined }
  );

  return (
    <div className="">
      <p className="">
        {session && <span>Logged in as {session.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="bg-orange-500"
        onClick={session ? () => void signOut() : () => void signIn()}
      >
        {session ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
}
