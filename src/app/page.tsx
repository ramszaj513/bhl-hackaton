import { auth } from "@clerk/nextjs/server";
import { WasteJobForm } from "./components/waste-job-form";
import { WasteJobList } from "./components/waste-job-list";


export default async function Home() {
  await auth.protect();

  return <div>
    <WasteJobForm />
    <WasteJobList />
  </div>;
}
