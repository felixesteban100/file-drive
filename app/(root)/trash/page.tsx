import PageTitle from "@/components/shared/page-title";

export default function Trash() {
  return (
    <section className="page-container">
      <PageTitle
        title={"Your trash Files"}
        // otherChildren={[<SearchBar />, <UploadButton />]}
      />
    </section>
  )
}