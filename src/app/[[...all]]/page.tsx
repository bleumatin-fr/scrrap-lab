import dynamic from "next/dynamic";
import { unstable_noStore as noStore } from "next/cache";

const AdminApp = dynamic(() => import("../admin/Admin"), { ssr: false });

export default function Home() {
  return <AdminApp />;
}
