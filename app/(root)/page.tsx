

import DisplayFiles from "@/components/shared/display-files";
import UploadButton from "@/components/shared/upload-button";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Image from "next/image";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="container mx-auto pt-12">
      <SignedIn>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Your Files</h1>
          <UploadButton />
        </div>

        {/* <Suspense fallback={<div className="text-4xl">Loading files...</div>}> */}
          <DisplayFiles />
        {/* </Suspense> */}


      </SignedIn>



      <SignedOut>
        <p>You must be signed in to see the files</p>

        <Image
          src="/assets/void.svg"
          width={200}
          height={200}
          alt="Image of a picture and directory icon"
        />
      </SignedOut>
    </main>
  );
}
