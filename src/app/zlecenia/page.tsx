import { auth } from "@clerk/nextjs/server";
import { WasteJobList } from ".././components/waste-job-list";


export default async function Home() {
  await auth.protect();

  return <div>
    <WasteJobList />
  </div>;
}
