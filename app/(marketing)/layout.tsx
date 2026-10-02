import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { getCurrentAdmin } from "@/lib/auth";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getCurrentAdmin();
  return (
    <>
      <Navbar showAdmin={!!admin} />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
