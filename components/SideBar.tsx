import React from "react";
import styles from "./SideBar.module.css";

type SideBarComponentType = {
  placeMent: "left" | "right";
};
const SideBarComponent: React.FC<SideBarComponentType> = ({ placeMent }) => {
  return (
    <div
      className={
        placeMent === "left" ? styles.leftContainer : styles.rightContainer
      }
    ></div>
  );
};

export default SideBarComponent;
