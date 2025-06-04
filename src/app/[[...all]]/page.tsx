import dynamic from "next/dynamic";

const AdminApp = dynamic(() => import("../admin/Admin"), { ssr: false });

export default function Home() {
  return <AdminApp />;
}
