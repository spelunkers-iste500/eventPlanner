import { GetStaticPaths, GetStaticProps } from "next";
import { dehydrate, QueryClient } from "react-query";

import {
  PageList,
  getBooks,
  getBooksPath,
} from "../../../components/book/PageList";
import { PagedCollection } from "../../../types/collection";
import { Book } from "../../../types/Book";
import { fetch, getCollectionPaths } from "../../../utils/dataAccess";

export const getStaticProps: GetStaticProps = async ({
  params: { page } = {},
}) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(getBooksPath(page), getBooks(page));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Book>>("/books");
  const paths = await getCollectionPaths(
    response,
    "books",
    "/books/page/[page]"
  );

  return {
    paths,
    fallback: true,
  };
};

export default PageList;
