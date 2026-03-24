import { getInquiry } from "@/lib/queries";
import { InquiryDetail } from "@/components/admin/inquiry-detail";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function InquiryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const inquiry = await getInquiry(id);
  if (!inquiry) notFound();

  return (
    <div>
      <Link href="/admin" className="text-sm text-green-600 hover:underline mb-4 block">← Zurück</Link>
      <InquiryDetail inquiry={inquiry} />
    </div>
  );
}
