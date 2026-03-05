import { auth } from "@repo/auth/server";

export default async function SettingsPage() {
  const { userId } = await auth();

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-semibold mb-10">Settings</h1>

      <div className="space-y-10">
        {/* Account */}
        <div>
          <h2 className="text-lg font-medium">Account</h2>
          <p className="mt-2 text-sm text-white/60">
            Logged in as: {userId}
          </p>
        </div>

        {/* About */}
        <div>
          <h2 className="text-lg font-medium">About</h2>
          <p className="mt-2 text-sm text-white/60">IdeaVault v1.0</p>
          <p className="text-sm text-white/40">
            Built with Next.js, Prisma, Neon and Clerk.
          </p>
        </div>

        {/* Delete all ideas */}
        <div className="pt-4">
          <button className="text-sm text-red-400 px-3 py-1.5 rounded-md bg-transparent transition-colors hover:bg-red-500/10">
            Delete all ideas
          </button>
        </div>
      </div>
    </div>
  );
}