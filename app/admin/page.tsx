import { getInquiries } from "@/lib/queries";
import { InquiryTable } from "@/components/admin/inquiry-table";

export default async function AdminPage() {
  const inquiries = await getInquiries();

  return (
    <div>
      <h1 className="font-serif text-2xl text-warm-800 mb-6">Anfragen</h1>
      <InquiryTable inquiries={inquiries} />
    </div>
  );
}
