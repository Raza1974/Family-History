// src/app/edit-member/[id]/page.tsx
import { redirect } from "next/navigation";
import type { FamilyMember } from "@/app/types/FamilyMember";
import { getFamilyData } from "@/app/utils/localStorage";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function EditMemberPage({ params }: PageProps) {
  const { id } = params;
  
  // Assume getFamilyData returns an array of FamilyMember
  const data: FamilyMember[] = getFamilyData();
  const member = data.find((m) => m.id === id);

  if (!member) {
    // Redirect if no member found
    redirect("/");
  }

  return (
    <div>
      <h1>Edit Member: {member.name}</h1>
      {/* Place your edit form or member details here */}
    </div>
  );
}
