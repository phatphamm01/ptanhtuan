import Home from "container/Home";
import type { NextPage } from "next";
import Head from "next/head";

const HomePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Phụ tùng Anh Tuấn</title>
      </Head>
      <Home />
    </>
  );
};

export default HomePage;
