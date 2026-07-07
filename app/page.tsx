import { Dashboard } from "@/components/dashboard";

export default function Home() {
  return (
    <main className="min-h-full bg-[var(--rcn-bg)]">
      <Dashboard storageMode="local" />
    </main>
  );
}
