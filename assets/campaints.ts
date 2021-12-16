import lmof from "./images/lmop.png";
export type Campaign = {
  id: string;
  title: string;
  image: any;
  sessions: Session[];
};

export type Session = { id: string; title: string; subTitle: string };

const Campain_1: Campaign = {
  id: "lmop",
  title: "Lost mines of Phandelver",
  image: "/images/lmop.jpg",
  sessions: [
    { id: "session_1", title: "Session 1", subTitle: "En subtitle 1" },
    { id: "session_2", title: "Session 2", subTitle: "En subtitle 2" },
  ],
};

const Campain_2: Campaign = {
  id: "rotfm",
  title: "Rime of the frostmaiden",
  image: "/images/rotfm.jpg",
  sessions: [{ id: "session_1", title: "session 1", subTitle: "En subtitle" }],
};

const content: Campaign[] = [Campain_1, Campain_2];

export default content;
