// import ClearTrash from "@/components/shared/clear-trash-button";
import DisplayFiles from "@/components/shared/display-files";
import PageTitle from "@/components/shared/page-title";

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

