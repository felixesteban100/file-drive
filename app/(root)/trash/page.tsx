// import ClearTrash from "@/components/shared/clear-trash-button";
import DisplayFiles from "@/components/shared/display-files";
import PageTitle from "@/components/shared/page-title";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Trash',
}

export default function Trash() {
  return (
    <section className="page-container">
      <PageTitle
        title={"Recycle bin"}
        // otherChildren={[<ClearTrash/>]}
      />

      <DisplayFiles searchQuery={""} deletedOnly={true} />
    </section>
  )
}

