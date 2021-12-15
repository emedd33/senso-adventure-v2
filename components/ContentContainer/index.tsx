import React, { CSSProperties } from "react";
import styles from "./style.module.css"
interface ContentContainerProps {
    children?: React.ReactNode,
    style?:CSSProperties
}
 
const ContentContainer: React.FC<ContentContainerProps> = ({children, style}) => {
    return ( <div style={style} className={styles.container}>{children}</div> );
}
 
export default ContentContainer;