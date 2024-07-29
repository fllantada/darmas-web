import LeftBar from "@/components/SideBar";
import TopBar from "@/components/TopBar/TopBar";

import packageJson from "../../../package.json";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-y-hidden">
      <LeftBar
        className="min-h-screen fixed left-0 relative"
        version={packageJson.version}
        commitId={process.env.COMMIT_ID?.slice(0, 7) || "dev"}
      />

      <div className="flex-1 flex flex-col">
        <main className="flex-1 overflow-y-auto bg-[#F1F4F4]">
          <TopBar className="w-full sticky top-0 z-20" />
          <div className="p-8 max-w-[1600px] min-w-[1345px] mx-auto overflow-x-scroll">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
