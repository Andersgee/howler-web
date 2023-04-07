import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "src/utils/api";
import { hashidFromNumber } from "src/utils/hashids";
import { SEO } from "src/components/SEO";
import Link from "next/link";

export default function Page() {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <SEO
        title="Howler"
        description="Looking for something to do in real life? A place to quickly find/plan stuff to do with friends, or with anyone really."
        url="https://howler.andyfx.net"
        image="/icons/favicon-512x512.png"
      />
      <main className="">
        <p>main</p>
        <p>hello.data?.greeting: {hello.data?.greeting}</p>
        <Link className="block" href={hashidFromNumber(2)}>
          hashidFromNumber(2)
        </Link>
        <Link className="block" href={hashidFromNumber(3)}>
          hashidFromNumber(3)
        </Link>
        <Link className="block" href={hashidFromNumber(4)}>
          hashidFromNumber(4)
        </Link>
        <p>hej</p>
        <AuthShowcase />
      </main>
    </>
  );
}

function AuthShowcase() {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <div className="">
      <p className="">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="bg-orange-500"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
}
