import { numberFromHashid } from "src/utils/hashids";
import { stringFromParam } from "src/utils/param";
import type { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";

type Props = {
  id: number;
  hashid: string;
};

export default function Page(props: Props) {
  const router = useRouter();

  if (router.isFallback) {
    //possibly skeleton here
    return <div></div>;
  }

  return (
    <div>
      <p>event page. hashid page</p>
      <p>id: {props.id}</p>
      <p>hashid: {props.hashid}</p>
    </div>
  );
}

//////////////////////////
// props

export const getStaticPaths: GetStaticPaths = () => {
  //return { paths: generatePagePaths(), fallback: false };
  return { paths: [], fallback: true };
};

export const getStaticProps: GetStaticProps = ({ params }) => {
  try {
    const hashid = stringFromParam(params?.hashid);
    if (!hashid) return { notFound: true };

    const id = numberFromHashid(hashid);
    if (!id) return { notFound: true };

    //const target = await getTarget(id);
    //if (!target) return { notFound: true };

    const props: Props = { id, hashid };
    return {
      props,
      revalidate: 30, //at most once every x seconds
    };
  } catch (error) {
    throw new Error("something went wrong");
    //return { notFound: true };
  }
};
