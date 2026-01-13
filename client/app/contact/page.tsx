import RedesignedContactPage from "@/components/contact-page-new";
import { constructMetadata } from "@/lib/metadata-utils";

export async function generateMetadata() {
  return await constructMetadata("contact");
}

export default function ContactPage() {
  return <RedesignedContactPage />;
}
