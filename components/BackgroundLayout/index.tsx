import React from "react"
import Footer from "../Footer";
import Navbar from "../Navbar";
import styles from "./style.module.css";
type BackgroundComponentProp = {
    children: any,
    backgroundImageUrl?: string,
};
const BackgroundLayout: React.FC<BackgroundComponentProp> = ({children, backgroundImageUrl}) => {
    return (
      <>
        <div className={styles.container} style={{backgroundImage: `url(${backgroundImageUrl? backgroundImageUrl: '/background-home.jpg'})`, }}>
            < Navbar/>
            <div className={styles.contentContainer}>
                {children}  
            </div>
        </div>
        <Footer/>
      </>
    )
  }

  export default BackgroundLayout