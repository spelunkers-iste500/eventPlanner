import {
  GetStaticPaths,
  GetStaticProps,
  NextComponentType,
  NextPageContext,
} from "next";
import DefaultErrorPage from "next/error";
import Head from "next/head";
import { useRouter } from "next/router";
import { dehydrate, QueryClient, useQuery } from "react-query";

import { Show } from "../../../components/author/Show";
import { PagedCollection } from "../../../types/collection";
import { Author } from "../../../types/Author";
import { fetch, FetchResponse, getItemPaths } from "../../../utils/dataAccess";
import { useMercure } from "../../../utils/mercure";

const getAuthor = async (id: string | string[] | undefined) =>
  id ? await fetch<Author>(`/authors/${id}`) : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: { data: author, hubURL, text } = { hubURL: null, text: "" } } =
    useQuery<FetchResponse<Author> | undefined>(["author", id], () =>
      getAuthor(id)
    );
  const authorData = useMercure(author, hubURL);

  if (!authorData) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{`Show Author ${authorData["@id"]}`}</title>
        </Head>
      </div>
      <Show author={authorData} text={text} />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({
  params: { id } = {},
}) => {
  if (!id) throw new Error("id not in query param");
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["author", id], () => getAuthor(id));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Author>>("/authors");
  const paths = await getItemPaths(response, "authors", "/authors/[id]");

  return {
    paths,
    fallback: true,
  };
};

export default Page;
