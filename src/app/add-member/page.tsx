"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FamilyMember } from "../types/FamilyMember";

const AddMemberPage = () => {
  const router = useRouter();

  const [member, setMember] = useState<FamilyMember>({
    id: Date.now().toString(),
    name: "",
    birthDate: "",
    deathDate: "",
    generationNo: 0,
    image: "",
    parentId: "",
    spouseId: "",
    siblings: [],
    children: [],
    gender: "other",
    occupation: "",
    education: "",
    notes: "",
    reasonOfDeath: null, // Ensuring required field is included
    placeOfBurial: "",   // Ensuring required field is included
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMember((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted Member:", member);
    router.push("/members"); // Navigate to members page after submission
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">Add Family Member</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="name" placeholder="Name" value={member.name} onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="date" name="birthDate" value={member.birthDate} onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="date" name="deathDate" value={member.deathDate || ""} onChange={handleChange} className="w-full p-2 border rounded" />
        <input type="text" name="placeOfBurial" placeholder="Place of Burial" value={member.placeOfBurial} onChange={handleChange} className="w-full p-2 border rounded" />
        <select name="gender" value={member.gender} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <textarea name="notes" placeholder="Notes" value={member.notes} onChange={handleChange} className="w-full p-2 border rounded"></textarea>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Add Member</button>
      </form>
    </div>
  );
};

export default AddMemberPage;
