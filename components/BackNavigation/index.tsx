import style from "./style.module.css";
import Link from "next/link";
import { IoMdArrowBack } from "react-icons/io";

type BackNavigationProp = { href: string; style: any };
const BackNavigation: React.FC<BackNavigationProp> = ({ href, style }) => {
  return (
    <div style={style} className={style.container}>
      <Link href={href}>
        <a style={{ display: "flex", alignItems: "center" }}>
          <IoMdArrowBack color="#face8b" />
          <span style={{ color: "var(--main-color)" }}>back</span>
        </a>
      </Link>
    </div>
  );
};

export default BackNavigation;
