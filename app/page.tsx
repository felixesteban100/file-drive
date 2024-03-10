"use client"

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { SignOutButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";

export default function Home() {
  const files = useQuery(api.files.getFiles)
  const createFile = useMutation(api.files.createFile)


  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <SignedOut>
        <Button asChild><SignInButton mode="modal" /></Button>
      </SignedOut>

      {files?.map((file) => (
        <div key={file._id}>
          <p>{file.name}</p>
        </div>
      ))}

      <SignedIn>
        <Button asChild><SignOutButton /></Button>

        <Button onClick={() => createFile({ name: 'Hello World!' })}>
          Click me!
        </Button>
      </SignedIn>
    </main>
  );
}
