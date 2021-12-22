import style from "./style.module.css";
import Link from "next/link";
import { IoMdArrowBack } from "react-icons/io";

type BackNavigationProp = { href: string };
const BackNavigation: React.FC<BackNavigationProp> = ({ href }) => {
  return (
    <Link href={href}>
      <a className={style.container}>
        <IoMdArrowBack />
        <span style={{ color: "var(--main-color)" }}>back</span>
      </a>
    </Link>
  );
};

export default BackNavigation;
