import PageTitle from "@/components/shared/page-title";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <section className="page-container">
      <PageTitle
        title={"Home page"}
      />
      <Link href="/files">
        <Button>Go to files</Button>
      </Link>
    </section>
  );
}
