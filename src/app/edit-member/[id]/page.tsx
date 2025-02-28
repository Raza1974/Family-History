"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

// Define FamilyMember type
type FamilyMember = {
  id: string;
  name: string;
  birthDate: string;
  deathDate?: string;
  generationNo: string;
  parentId?: string;
  spouseId?: string;
  siblings?: string[];
  children?: string[];
  image?: string;
};

// Function to get data from local storage
const getFamilyData = (): FamilyMember[] => {
  if (typeof window !== "undefined") {
    const storedData = localStorage.getItem("familyData");
    return storedData ? JSON.parse(storedData) : [];
  }
  return [];
};

// Function to update local storage
const setFamilyData = (data: FamilyMember[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("familyData", JSON.stringify(data));
  }
};

export default function EditMember() {
  const router = useRouter();
  const params = useParams();
  const memberId = params?.id as string;

  const [member, setMember] = useState<FamilyMember | null>(null);

  useEffect(() => {
    const familyData = getFamilyData(); // Fixed the prefer-const issue
    const foundMember = familyData.find((m) => m.id === memberId);
    if (foundMember) {
      setMember(foundMember);
    }
  }, [memberId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (member) {
      const { name, value } = e.target;
      setMember({ ...member, [name]: value });
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (member) {
      const familyData = getFamilyData();
      const updatedData = familyData.map((m) => (m.id === member.id ? member : m));
      setFamilyData(updatedData);
      router.push("/family-tree");
    }
  };

  const handleDelete = () => {
    if (!member) return;

    const familyData = getFamilyData();
    const updatedData = familyData.filter((m) => m.id !== member.id);
    setFamilyData(updatedData);
    router.push("/family-tree");
  };

  if (!member) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Edit Family Member</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Name:</label>
          <input type="text" name="name" value={member.name} onChange={handleChange} className="w-full border rounded p-2" required />
        </div>
        <div>
          <label className="block font-medium">Birth Date:</label>
          <input type="date" name="birthDate" value={member.birthDate} onChange={handleChange} className="w-full border rounded p-2" required />
        </div>
        <div>
          <label className="block font-medium">Death Date:</label>
          <input type="date" name="deathDate" value={member.deathDate || ""} onChange={handleChange} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block font-medium">Generation Number:</label>
          <input type="number" name="generationNo" value={member.generationNo} onChange={handleChange} className="w-full border rounded p-2" required />
        </div>
        <div>
          <label className="block font-medium">Image:</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full border rounded p-2" />
          {member.image && <Image src={member.image} alt="Preview" width={100} height={100} className="mt-2" />}
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
          Save Changes
        </button>
        <button type="button" onClick={handleDelete} className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">
          Delete Member
        </button>
      </form>
      <Link href="/family-tree">
        <button className="block mt-4 w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600">Back to Family Tree</button>
      </Link>
    </div>
  );
}
