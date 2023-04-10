import { numberFromHashid } from "src/utils/hashids";
import { stringFromParam } from "src/utils/param";
import type { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import { getEvent, type Event } from "src/utils/staticprops";
import { format, formatDistance } from "date-fns";
import { IconHowler } from "src/icons/Howler";
import { useSession } from "next-auth/react";
import { api } from "src/utils/api";
import { useDialogDispatch } from "src/context/DialogContext";
import Link from "next/link";
import { SEO } from "src/components/SEO";

type Props = {
  id: number;
  hashid: string;
  event: Event;
};

export default function Page({ id, hashid, event }: Props) {
  const { data: session } = useSession();
  const router = useRouter();
  const dialogDispatch = useDialogDispatch();

  const utils = api.useContext();

  const { data: userEventPivot } = api.event.userEventPivot.useQuery(
    {
      eventId: id,
    },
    {
      enabled: session?.user !== undefined,
    }
  );
  const { mutateAsync: joinEvent } = api.event.join.useMutation({
    onSuccess: async () => {
      await utils.event.userEventPivot.invalidate({ eventId: id });
    },
  });
  const { mutateAsync: leaveEvent } = api.event.leave.useMutation({
    onSuccess: async () => {
      await utils.event.userEventPivot.invalidate({ eventId: id });
    },
  });

  const handleJoinClick = async () => {
    if (session?.user !== undefined) {
      await joinEvent({ eventId: id });
    } else {
      dialogDispatch({ type: "show", name: "signin" });
    }
  };

  const handleLeaveClick = async () => {
    if (session?.user !== undefined) {
      await leaveEvent({ eventId: id });
    } else {
      dialogDispatch({ type: "show", name: "signin" });
    }
  };

  if (router.isFallback) {
    //possibly skeleton here
    return <div></div>;
  }

  return (
    <>
      <SEO
        title={`${event.what || "anything"} | Howler`}
        description={`what: ${event.what || "anything"} | where: ${
          event.where || "anywhere"
        } | when: ${format(event.when, "yyyy-MM-dd HH:mm")} | who: ${
          event.creator.name || ""
        } and ${event.who}`}
        url="https://howler.andyfx.net"
        image="/icons/favicon-512x512.png"
      />
      <main className="container">
        <div>
          <Link href="/">Home</Link>
        </div>
        <div className="mx-4 flex h-screen flex-col">
          <div className="flex flex-col items-center">
            <div className="mt-10 flex flex-wrap gap-x-2 gap-y-2">
              <div className="flex items-baseline gap-2 bg-orange-500 p-2">
                <p>what?</p>
                <h2 className="capitalize-first">{event.what || "anything"}</h2>
              </div>
              <div className="flex items-baseline gap-2 bg-purple-500 p-2">
                <p>where?</p>
                <h2 className="">{event.where || "anywhere"}</h2>
              </div>

              <div className="flex items-baseline gap-2 bg-yellow-500 p-2">
                <p>when?</p>
                <div>{event.when.getTime() > Date.now() ? "aaa" : "hej"}</div>
                <h2 className="">
                  {`${format(event.when, "yyyy-MM-dd HH:mm")} (${formatDistance(
                    event.when,
                    Date.now(),
                    {
                      addSuffix: true,
                    }
                  )})`}
                </h2>
              </div>
              <div className="flex items-baseline gap-2 bg-green-500 p-2">
                <p>who?</p>
                <h2 className="">
                  {event.creator.name} and {event.who}
                </h2>
              </div>
            </div>
            <div className="mb-12 mt-4">
              <p>info: {event.info || "no additional info"}</p>
            </div>
            {userEventPivot ? (
              <button
                onClick={() => void handleLeaveClick()}
                className="flex w-56 items-center justify-center rounded-full border-2 border-black bg-green-200 px-2 py-2 transition-colors hover:bg-red-400"
              >
                <span className="mr-2 text-2xl text-black">Im going!</span>
                <IconHowler />
              </button>
            ) : (
              <button
                onClick={() => void handleJoinClick()}
                className="flex w-56 items-center justify-center rounded-full border-2 border-black bg-blue-50 px-2 py-2 transition-colors hover:bg-blue-200"
              >
                <span className="mr-2 text-2xl text-black">Lets go!</span>
                <IconHowler />
              </button>
            )}
          </div>
          <div className="mt-6 flex-1 border-t-2 pt-6 text-center">
            maybe message chat here?
          </div>
        </div>
      </main>
    </>
  );
}

//////////////////////////
// props

export const getStaticPaths: GetStaticPaths = () => {
  //return { paths: generatePagePaths(), fallback: false };
  return { paths: [], fallback: true };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const hashid = stringFromParam(params?.hashid);
    if (!hashid) return { notFound: true };

    const id = numberFromHashid(hashid);
    if (!id) return { notFound: true };

    const event = await getEvent(id);
    //const target = await getTarget(id);
    if (!event) return { notFound: true };

    const props: Props = { id, hashid, event };
    return {
      props,
      revalidate: 30, //at most once every x seconds
    };
  } catch (error) {
    throw new Error("something went wrong");
    //return { notFound: true };
  }
};
