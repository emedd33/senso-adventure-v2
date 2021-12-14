import React from "react";
import styles from "./style.module.css"
interface ContentContainerProps {
    children?: any
}
 
const ContentContainer: React.FC<ContentContainerProps> = ({children}) => {
    
    
    return ( <div className={styles.container}>{children}</div> );
}
 
export default ContentContainer;