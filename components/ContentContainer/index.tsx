import React, { CSSProperties } from "react";
import Loader from "react-loader-spinner";
import styles from "./style.module.css";
interface ContentContainerProps {
  children?: React.ReactNode;
  style?: CSSProperties;
  isLoading?: boolean;
}

const ContentContainer: React.FC<ContentContainerProps> = ({
  children,
  style,
  isLoading,
}) => {
  return (
    <div style={style} className={styles.container}>
      {isLoading ? (
        <Loader type="Oval" color="#fff" height={50} width={50} />
      ) : (
        children
      )}
    </div>
  );
};

export default ContentContainer;
