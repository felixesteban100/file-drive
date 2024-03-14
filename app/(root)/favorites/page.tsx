import DisplayFiles from "@/components/shared/display-files";
import PageTitle from "@/components/shared/page-title";
import SearchBar from "@/components/shared/search-bar";
import UploadButton from "@/components/shared/upload-button";

export default function Favorites({
  searchParams,
}: {
  searchParams?: { query?: string /* [key: string]: string | string[] | undefined */ }
}) {
  const searchQuery = searchParams?.query ?? ""

  return (
    <section className="page-container">
      <PageTitle
        title={"Favorites"}
        otherChildren={[<SearchBar />/* , <UploadButton /> */]}
      />

      {/* to use suspense the component must be async function */}
      {/* <Suspense fallback={<div className="text-4xl">Loading files...</div>}> */}
      <DisplayFiles searchQuery={searchQuery} favoritesOnly={true} />
      {/* </Suspense> */}
    </section>
  )
}