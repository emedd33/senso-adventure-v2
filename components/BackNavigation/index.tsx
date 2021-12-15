import style from "./style.module.css";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import Link from "next/link";
type BackNavigationProp = { href: string };
const BackNavigation: React.FC<BackNavigationProp> = ({ href }) => {
  return (
    <Link href={href}>
      <a className={style.container}>
        <KeyboardBackspaceIcon />
        back
      </a>
    </Link>
  );
};

export default BackNavigation;
