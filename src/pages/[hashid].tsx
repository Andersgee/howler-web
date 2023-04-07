import { numberFromHashid } from "src/utils/hashids";
import { stringFromParam } from "src/utils/param";
import type { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import { getEvent, type Event } from "src/utils/staticprops";

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
    <div>
      <p>event page. hashid page</p>
      <p>id: {id}</p>
      <p>hashid: {hashid}</p>
      <p>event: </p>
      <pre>{JSON.stringify(event, null, 2)}</pre>
    </div>
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
