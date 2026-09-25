import { Heart } from "lucide-react";
import { useAnniversaryData } from "../context/AnniversaryContext";

export function Footer() {
  const { data } = useAnniversaryData();
  return <footer><div className="container footer-inner"><p>Made with <Heart size={15} fill="currentColor" /> for our story</p><span>{data.nameOne} & {data.nameTwo} · {new Date().getFullYear()}</span></div></footer>;
}