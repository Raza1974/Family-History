"use client";

import type { FC } from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { FamilyMember } from "../../types/FamilyMember";
import { getFamilyData, setFamilyData } from "../../utils/localStorage";

interface EditMemberProps {
  params: { id: string };
}

const EditMember: FC<EditMemberProps> = ({ params }) => {
  const router = useRouter();
  const [member, setMember] = useState<FamilyMember | null>(null);

  useEffect(() => {
    const familyData = getFamilyData();
    const foundMember = familyData.find((m) => m.id === params.id);
    if (foundMember) {
      setMember(foundMember);
    }
  }, [params.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (member) {
      const familyData = getFamilyData();
      const updatedData = familyData.map((m) =>
        m.id === member.id ? member : m
      );
      setFamilyData(updatedData);
      router.push("/family-tree");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    if (member) {
      const { name, value } = e.target;
      if (name === "siblings" || name === "children") {
        setMember({ ...member, [name]: value.split(",").map((item) => item.trim()) });
      } else {
        setMember({ ...member, [name]: value });
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && member) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMember({ ...member, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  if (!member) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Edit Family Member</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block mb-1">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={member.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        
        {/* Birth Date */}
        <div>
          <label htmlFor="birthDate" className="block mb-1">Birth Date</label>
          <input
            type="date"
            id="birthDate"
            name="birthDate"
            value={member.birthDate}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {/* Death Date */}
        <div>
          <label htmlFor="deathDate" className="block mb-1">Death Date (if applicable)</label>
          <input
            type="date"
            id="deathDate"
            name="deathDate"
            value={member.deathDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {/* Generation Number */}
        <div>
          <label htmlFor="generationNo" className="block mb-1">Generation Number</label>
          <input
            type="number"
            id="generationNo"
            name="generationNo"
            value={member.generationNo}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label htmlFor="image" className="block mb-1">Image</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full px-3 py-2 border rounded"
          />
          {member.image && (
            <Image src={member.image || "/placeholder.svg"} alt="Preview" width={100} height={100} className="mt-2" />
          )}
        </div>

        {/* Parent ID */}
        <div>
          <label htmlFor="parentId" className="block mb-1">Parent ID</label>
          <input
            type="text"
            id="parentId"
            name="parentId"
            value={member.parentId}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {/* Gender Selection */}
        <div>
          <label htmlFor="gender" className="block mb-1">Gender</label>
          <select
            id="gender"
            name="gender"
            value={member.gender}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block mb-1">Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={member.notes}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border rounded"
          ></textarea>
        </div>

        {/* Submit Button */}
        <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
          Update Member
        </button>
      </form>
      
      <Link href="/" className="block mt-4 text-center bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600">
        Back to Home
      </Link>
    </div>
  );
};

export default EditMember;
