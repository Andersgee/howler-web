import { numberFromHashid } from "src/utils/hashids";
import { stringFromParam } from "src/utils/param";
import type { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import { getEvent, type Event } from "src/utils/staticprops";
import { format, formatDistanceToNow } from "date-fns";

//const result =
//=> '02/11/2014'

type Props = {
  id: number;
  hashid: string;
  event: Event;
};

export default function Page({ id, hashid, event }: Props) {
  const router = useRouter();

  if (router.isFallback) {
    //possibly skeleton here
    return <div></div>;
  }

  return (
    <main className="container">
      <div className="mx-4 flex h-screen flex-col">
        <div className="flex flex-col items-center border-b-2">
          <div className="mt-10 flex flex-wrap gap-x-2 gap-y-2">
            <div className="flex items-baseline gap-2 bg-orange-500 p-2">
              <p>what?</p>
              <h2 className="capitalize-first">{event.what}</h2>
            </div>
            <div className="flex items-baseline gap-2 bg-purple-500 p-2">
              <p>where?</p>
              <h2 className="">anywhere</h2>
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
              <h2 className="">creatorname and event.who string</h2>
            </div>
          </div>
          <div className="mb-12 mt-4">
            <p>info: {event.info || "no additional info"}</p>
          </div>
        </div>
        <div className="flex-1 pt-3 text-center">maybe message chat here?</div>
      </div>
    </main>
  );
}
/*
<div className="mt-4 grid grid-cols-2 place-content-center place-items-center gap-2">
            <div>what?</div>
            <h2 className="capitalize-first block place-self-start">
              {event.title}
            </h2>
            <div>what?</div>
            <h2 className="capitalize-first block">{event.title}</h2>
            <div>when?</div>
            <h2 className="capitalize-first block">{`${format(
              event.date,
              "yyyy-MM-dd HH:mm"
            )} (in ${formatDistanceToNow(event.date)})`}</h2>
          </div>
          */
/*
<h2 className="flex gap-1">
              <span className="text-neutral-500">when?</span>{" "}
              <span className="">{`${format(
                event.date,
                "yyyy-MM-dd HH:mm"
              )} (in ${formatDistanceToNow(event.date)})`}</span>
            </h2>
            <h2>When? </h2>
            <h2>Where? {event.placeId ? event.placeId : "anywhere"}</h2>
            <h2>Who? {event.placeId ? event.placeId : "anyone"}</h2>
            <p>description: {event.description || "no description"}</p>
            */

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
