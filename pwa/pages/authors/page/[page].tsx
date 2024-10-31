import { GetStaticPaths, GetStaticProps } from "next";
import { dehydrate, QueryClient } from "react-query";

import {
  PageList,
  getAuthors,
  getAuthorsPath,
} from "../../../components/author/PageList";
import { PagedCollection } from "../../../types/collection";
import { Author } from "../../../types/Author";
import { fetch, getCollectionPaths } from "../../../utils/dataAccess";

export const getStaticProps: GetStaticProps = async ({
  params: { page } = {},
}) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(getAuthorsPath(page), getAuthors(page));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Author>>("/authors");
  const paths = await getCollectionPaths(
    response,
    "authors",
    "/authors/page/[page]"
  );

  return {
    paths,
    fallback: true,
  };
};

export default PageList;
