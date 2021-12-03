import React from "react"
import Footer from "../Footer";
import Navbar from "../Navbar";
import styles from "./style.module.css";
type BackgroundComponentProp = {
    content: any
};
const BackgroundLayout: React.FC<BackgroundComponentProp> = ({content}) => {
    return (
      <>
        <div className={styles.container}>
            < Navbar/>
            {content}  
            <p style={{height: '40rem'}}>asdmlaksdmlam sdlkansdla sldk asldka sdn asdm a</p> 
            <p>asdmlaksdmlam sdlkansdla sldk asldka sdn asdm a</p> 
            <p>asdmlaksdmlam sdlkansdla sldk asldka sdn asdm a</p> 
            <p>asdmlaksdmlam sdlkansdla sldk asldka sdn asdm a</p> 
            <div className={styles.rightSideDrop}></div>
            <div className={styles.leftSideDrop}></div>
        </div>
        <Footer/>
      </>
    )
  }

  export default BackgroundLayout