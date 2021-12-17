// ./pages/api/login
import { setAuthCookies } from "next-firebase-auth";
import initAuth from "../../firebase/firebase-config"; // the module you created above

initAuth();

const handler = async (req: any, res: any) => {
  try {
    await setAuthCookies(req, res);
  } catch (e) {
    // console.log(e);
    return res.status(200).json({ success: true });
  }
  return res.status(200).json({ success: true });
};

export default handler;
