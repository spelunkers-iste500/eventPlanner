import { NextComponentType, NextPageContext } from "next";
import Head from "next/head";

import { Form } from "../../components/author/Form";

const Page: NextComponentType<NextPageContext> = () => (
  <div>
    <div>
      <Head>
        <title>Create Author</title>
      </Head>
    </div>
    <Form />
  </div>
);

export default Page;
