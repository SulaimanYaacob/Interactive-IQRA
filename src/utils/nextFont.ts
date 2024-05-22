import { Amiri, Fira_Sans } from "next/font/google";

export const quranFont = Amiri({
  weight: ["400", "700"],
  subsets: ["arabic"],
  display: "block",
});

export const logoFont = Fira_Sans({
  weight: "700",
  subsets: ["latin"],
  display: "swap",
});
