

import DisplayFiles from "@/components/shared/display-files";
import PageTitle from "@/components/shared/page-title";
import SearchBar from "@/components/shared/search-bar";
import UploadButton from "@/components/shared/upload-button";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Image from "next/image";
// import { Suspense } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Files',
}

export default function Files({
  searchParams,
}: {
  searchParams?: { query?: string /* [key: string]: string | string[] | undefined */ }
}) {
  const searchQuery = searchParams?.query ?? ""

  return (
    <section className="page-container">
      <SignedIn>
        <PageTitle
          title={"Your Files"}
          otherChildren={[<SearchBar key="search-bar-files" />, <UploadButton key="upload-button-files" />]}
        />

        {/* to use suspense the component must be async function */}
        {/* <Suspense fallback={<div className="text-4xl">Loading files...</div>}> */}
        <DisplayFiles searchQuery={searchQuery} />
        {/* </Suspense> */}
      </SignedIn>

      <SignedOut>
        <div className="flex flex-col gap-5 justify-center items-center">
          <p>You must be signed in to see the files</p>
          <Image
            src="/assets/void.svg"
            width={200}
            height={200}
            alt="Image of a picture and directory icon"
          />
        </div>
      </SignedOut>
    </section>
  );
}
