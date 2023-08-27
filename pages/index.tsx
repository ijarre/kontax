import type { NextPage } from "next";
import { ContactContainer } from "../components/ContactContainer";
import { MainLayout } from "../layouts/MainLayout";

const Home: NextPage = () => {
  return (
    <MainLayout>
      <ContactContainer />
    </MainLayout>
  );
};

export default Home;
