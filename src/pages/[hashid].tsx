import { numberFromHashid } from "src/utils/hashids";
import { stringFromParam } from "src/utils/param";
import type { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import { getEvent, type Event } from "src/utils/staticprops";
import { format, formatDistanceToNow } from "date-fns";
import { IconHowler } from "src/icons/Howler";
import { useSession } from "next-auth/react";

type Props = {
  id: number;
  hashid: string;
  event: Event;
};

export default function Page({ id, hashid, event }: Props) {
  const { data: session } = useSession();
  const router = useRouter();

  if (router.isFallback) {
    //possibly skeleton here
    return <div></div>;
  }

  return (
    <main className="container">
      <div className="mx-4 flex h-screen flex-col">
        <div className="flex flex-col items-center">
          <div className="mt-10 flex flex-wrap gap-x-2 gap-y-2">
            <div className="flex items-baseline gap-2 bg-orange-500 p-2">
              <p>what?</p>
              <h2 className="capitalize-first">{event.what}</h2>
            </div>
            <div className="flex items-baseline gap-2 bg-purple-500 p-2">
              <p>where?</p>
              <h2 className="">{event.where}</h2>
            </div>

            <div className="flex items-baseline gap-2 bg-yellow-500 p-2">
              <p>when?</p>
              <h2 className="">{`${format(
                event.when,
                "yyyy-MM-dd HH:mm"
              )} (in ${formatDistanceToNow(event.when)})`}</h2>
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
          {session?.user.id === event.creatorId ? (
            <div>you created this event</div>
          ) : (
            <button className="flex w-56 items-center justify-center rounded-full border-2 border-black bg-blue-50 px-2 py-2 transition-colors hover:bg-blue-200">
              <span className="mr-2 text-2xl text-black">Im going!</span>
              <IconHowler />
            </button>
          )}
        </div>
        <div className="mt-6 flex-1 border-t-2 pt-6 text-center">
          maybe message chat here?
        </div>
      </div>
    </main>
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
