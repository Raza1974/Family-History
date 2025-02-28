"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { FamilyMember } from "../types/FamilyMember";
import { getFamilyData, setFamilyData } from "../utils/localStorage";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "jspdf-autotable";

export default function FamilyTree() {
  const [familyData, setFamilyDataState] = useState<FamilyMember[]>([]);
  const router = useRouter();

  useEffect(() => {
    setFamilyDataState(getFamilyData());
  }, []);

  const getFamilyMemberName = (id: string) => {
    const member = familyData.find((m) => m.id === id);
    return member ? member.name : "Unknown";
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this family member?")) {
      const updatedData = familyData.filter((member) => member.id !== id);
      setFamilyData(updatedData);
      setFamilyDataState(updatedData);
    }
  };

  const handleAddChild = (parentId: string) => {
    router.push(`/add-member?parentId=${parentId}`);
  };

  const handleAddSibling = (siblingId: string) => {
    const sibling = familyData.find((member) => member.id === siblingId);
    if (sibling && sibling.parentId) {
      router.push(`/add-member?parentId=${sibling.parentId}`);
    } else {
      alert("Cannot add sibling: parent not found");
    }
  };

  const handleAddSpouse = (memberId: string) => {
    router.push(`/add-member?spouseId=${memberId}`);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Family Tree", 14, 15);

    const tableData = familyData.map((member) => [
      member.name,
      member.birthDate || "N/A",
      member.gender,
      member.occupation || "N/A",
      member.education || "N/A",
      member.parentId || "N/A",
      member.spouseId || "N/A",
      member.children.length.toString(),
      member.siblings.length.toString(),
      member.deathDate || "N/A",
      member.notes || "N/A",
    ]);

    autoTable(doc, {
      head: [
        [
          "Name",
          "Birth Date",
          "Gender",
          "Occupation",
          "Education",
          "Parent ID",
          "Spouse ID",
          "Children",
          "Siblings",
          "Date of Death",
          "Notes",
        ],
      ],
      body: tableData,
      startY: 20,
    });

    doc.save("family_tree.pdf");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="family-tree p-2 sm:p-4">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center">Family Tree</h2>
      <div className="mb-4 space-x-2 flex justify-center print:hidden">
        <button
          onClick={handlePrint}
          className="bg-green-500 text-white py-1 px-3 rounded text-sm hover:bg-green-600"
        >
          Print
        </button>
        <button
          onClick={handleDownloadPDF}
          className="bg-purple-500 text-white py-1 px-3 rounded text-sm hover:bg-purple-600"
        >
          Download PDF
        </button>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2 print:grid-cols-4">
        {familyData.map((member) => (
          <div
            key={member.id}
            className={`family-member border p-1 sm:p-2 rounded-lg shadow-md text-xs sm:text-sm ${
              member.gender === "male" ? "bg-blue-100" : "bg-pink-100"
            }`}
          >
            <Image
              src={member.image || "/placeholder.svg"}
              alt={member.name}
              width={50}
              height={50}
              className="mx-auto mb-1 rounded-full"
            />
            <h3 className="font-bold text-center truncate">{member.name}</h3>
            <p>ID: {member.id}</p>
            <p>Born: {member.birthDate || "N/A"}</p>
            {member.deathDate && <p>Died: {member.deathDate}</p>}
            <p>Gen: {member.generationNo}</p>
            <p>Gender: {member.gender}</p>
            <p>Occupation: {member.occupation || "N/A"}</p>
            <p>Parent: {member.parentId || "N/A"}</p>
            {member.spouseId && <p>Spouse: {getFamilyMemberName(member.spouseId)}</p>}
            {member.siblings.length > 0 && <p>Siblings: {member.siblings.length}</p>}
            {member.children.length > 0 && <p>Children: {member.children.length}</p>}

            <div className="mt-1 space-y-1 print:hidden">
              <Link
                href={`/edit-member/${member.id}`}
                className="block text-center bg-blue-500 text-white py-1 rounded text-xs hover:bg-blue-600"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(member.id)}
                className="w-full bg-red-500 text-white py-1 rounded text-xs hover:bg-red-600"
              >
                Delete
              </button>
              <button
                onClick={() => handleAddChild(member.id)}
                className="w-full bg-green-500 text-white py-1 rounded text-xs hover:bg-green-600"
              >
                Add Child
              </button>
              <button
                onClick={() => handleAddSibling(member.id)}
                className="w-full bg-yellow-500 text-white py-1 rounded text-xs hover:bg-yellow-600"
              >
                Add Sibling
              </button>
              <button
                onClick={() => handleAddSpouse(member.id)}
                className="w-full bg-purple-500 text-white py-1 rounded text-xs hover:bg-purple-600"
              >
                Add Spouse
              </button>
            </div>
          </div>
        ))}
      </div>

      <Link
        href="/"
        className="block mt-4 text-center bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 cursor-pointer print:hidden"
      >
        Back to Home
      </Link>
    </div>
  );
}
