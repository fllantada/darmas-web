import packageJson from "../../../package.json";

const commitId = process.env.COMMIT_ID?.substring(0, 7);

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <div className="h-screen">
        <div className="flex h-full overflow-auto">
          <div className="grow content-center m-6">
            {children}
            <div className="text-center text-xs mt-2 text-slate-400">
              Release {packageJson.version} ({commitId || "dev"})
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
