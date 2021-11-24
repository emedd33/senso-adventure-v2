import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import HeaderComponent from "../components/Header";
import SideBarComponent from "../components/SideBar";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <HeaderComponent />
      <SideBarComponent />
      <div></div>
    </div>
  );
};

export default Home;
