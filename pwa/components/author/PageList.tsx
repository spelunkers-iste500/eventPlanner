import { NextComponentType, NextPageContext } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { useQuery } from "react-query";

import Pagination from "../common/Pagination";
import { List } from "./List";
import { PagedCollection } from "../../types/collection";
import { Author } from "../../types/Author";
import { fetch, FetchResponse, parsePage } from "../../utils/dataAccess";
import { useMercure } from "../../utils/mercure";

export const getAuthorsPath = (page?: string | string[] | undefined) =>
  `/authors${typeof page === "string" ? `?page=${page}` : ""}`;
export const getAuthors = (page?: string | string[] | undefined) => async () =>
  await fetch<PagedCollection<Author>>(getAuthorsPath(page));
const getPagePath = (path: string) =>
  `/authors/page/${parsePage("authors", path)}`;

export const PageList: NextComponentType<NextPageContext> = () => {
  const {
    query: { page },
  } = useRouter();
  const { data: { data: authors, hubURL } = { hubURL: null } } = useQuery<
    FetchResponse<PagedCollection<Author>> | undefined
  >(getAuthorsPath(page), getAuthors(page));
  const collection = useMercure(authors, hubURL);

  if (!collection || !collection["hydra:member"]) return null;

  return (
    <div>
      <div>
        <Head>
          <title>Author List</title>
        </Head>
      </div>
      <List authors={collection["hydra:member"]} />
      <Pagination collection={collection} getPagePath={getPagePath} />
    </div>
  );
};
