import Link from "next/link";
import { FaServer, FaUser } from "react-icons/fa6";
import { SiGoogledocs } from "react-icons/si";
import { IoNewspaperSharp } from "react-icons/io5";

export default function LandingFooter() {
  return (
    <div className="text-main-gray-03 dark:text-main-gray-02 sticky -bottom-1 z-50 w-full bg-main-right pt-1 md:hidden">
      <div className="flex w-full items-center justify-center bg-card px-4 py-4 text-center text-sm">
        <div className="grid w-full grid-cols-4 gap-2">
          <Link
            className="flex flex-col items-center justify-center rounded-full bg-transparent px-4 py-1"
            href={"/about"}
          >
            <FaUser className="text-2xl" />
            About
          </Link>
          <Link
            className="flex flex-col items-center justify-center rounded-full bg-transparent px-4 py-1"
            href={"/services"}
          >
            <FaServer className="text-2xl" />
            Services
          </Link>
          <Link
            className="flex flex-col items-center justify-center rounded-full bg-transparent px-4 py-1"
            href={"/docs"}
          >
            <SiGoogledocs className="text-2xl" />
            Documents
          </Link>
          <Link
            className="flex flex-col items-center justify-center rounded-full bg-transparent px-4 py-1"
            href={"/news"}
          >
            <IoNewspaperSharp className="text-2xl" />
            News
          </Link>
        </div>
      </div>
    </div>
  );
}
