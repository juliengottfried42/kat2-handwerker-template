"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Inquiry } from "@/lib/queries";

const statusColors: Record<string, string> = {
  neu: "bg-blue-100 text-blue-800",
  beantwortet: "bg-yellow-100 text-yellow-800",
  erledigt: "bg-green-100 text-green-800",
};

export function InquiryTable({ inquiries: initial }: { inquiries: Inquiry[] }) {
  const [filter, setFilter] = useState("alle");
  const filtered = filter === "alle" ? initial : initial.filter((i) => i.status === filter);

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        <Select value={filter} onValueChange={(v) => { if (v !== null) setFilter(v); }}>
          <SelectTrigger className="w-48 bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="alle">Alle</SelectItem>
            <SelectItem value="neu">Neu</SelectItem>
            <SelectItem value="beantwortet">Beantwortet</SelectItem>
            <SelectItem value="erledigt">Erledigt</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-warm-600">{filtered.length} Anfragen</span>
      </div>
      <div className="bg-white rounded-xl border border-warm-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-warm-50 text-warm-600">
            <tr>
              <th className="text-left px-4 py-3">Datum</th>
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Leistung</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-warm-500">Keine Anfragen</td>
              </tr>
            ) : (
              filtered.map((inq) => (
                <tr key={inq.id} className="border-t border-warm-100 hover:bg-warm-50">
                  <td className="px-4 py-3">{new Date(inq.created_at).toLocaleDateString("de-CH")}</td>
                  <td className="px-4 py-3 font-medium">{inq.name}</td>
                  <td className="px-4 py-3">{Object.values(inq.answers)[0] ?? "—"}</td>
                  <td className="px-4 py-3">
                    <Badge className={statusColors[inq.status]}>{inq.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/anfragen/${inq.id}`} className="text-green-600 hover:underline">Details →</Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
