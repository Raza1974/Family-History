"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import type { FamilyMember } from "../types/FamilyMember"
import { initialFamilyData } from "../data/initialFamilyData"

export default function FamilyTree() {
  const [familyData, setFamilyData] = useState<FamilyMember[]>([])
  const router = useRouter()

  useEffect(() => {
    const storedData = localStorage.getItem("familyData")
    if (storedData) {
      const parsedData = JSON.parse(storedData)
      // Merge initial data with stored data, giving priority to stored data
      const mergedData = [...initialFamilyData, ...parsedData].reduce((acc: FamilyMember[], current: FamilyMember) => {
        const x = acc.find((item) => item.id === current.id)
        if (!x) {
          return acc.concat([current])
        } else {
          return acc
        }
      }, [])
      setFamilyData(mergedData)
    } else {
      setFamilyData(initialFamilyData)
    }
  }, []) // Empty dependency array

  const updateLocalStorage = (data: FamilyMember[]) => {
    localStorage.setItem("familyData", JSON.stringify(data))
  }

  useEffect(() => {
    updateLocalStorage(familyData)
  }, [familyData])

  const renderFamilyMember = (member: FamilyMember) => (
    <div key={member.id} className="family-member border p-2 m-1 rounded-lg shadow-md text-sm">
      <Image
        src={member.image || "/placeholder.svg"}
        alt={member.name}
        width={50}
        height={50}
        className="mx-auto mb-1 rounded-full"
      />
      <h3 className="font-bold">{member.name}</h3>
      <p className="text-xs">ID: {member.id}</p>
      <p className="text-xs">Born: {member.birthDate}</p>
      {member.deathDate && <p className="text-xs">Died: {member.deathDate}</p>}
      <p className="text-xs">Gen: {member.generationNo}</p>
      <p className="text-xs">Gender: {member.gender}</p>
      <p className="text-xs">Occupation: {member.occupation}</p>
      <p className="text-xs">Parent: {member.parentId || "N/A"}</p>
      {member.spouseId && <p className="text-xs">Spouse: {getFamilyMemberName(member.spouseId)}</p>}
      {member.siblings.length > 0 && <p className="text-xs">Siblings: {member.siblings.length}</p>}
      {member.children.length > 0 && <p className="text-xs">Children: {member.children.length}</p>}
      <div className="mt-1 space-y-1">
        <Link
          href={`/edit-member/${member.id}`}
          className="block text-center bg-blue-500 text-white py-1 px-2 rounded text-xs hover:bg-blue-600"
        >
          Edit
        </Link>
        <button
          onClick={() => handleDelete(member.id)}
          className="w-full bg-red-500 text-white py-1 px-2 rounded text-xs hover:bg-red-600"
        >
          Delete
        </button>
        <button
          onClick={() => handleAddChild(member.id)}
          className="w-full bg-green-500 text-white py-1 px-2 rounded text-xs hover:bg-green-600"
        >
          Add Child
        </button>
        <button
          onClick={() => handleAddSibling(member.id)}
          className="w-full bg-yellow-500 text-white py-1 px-2 rounded text-xs hover:bg-yellow-600"
        >
          Add Sibling
        </button>
        <button
          onClick={() => handleAddSpouse(member.id)}
          className="w-full bg-purple-500 text-white py-1 px-2 rounded text-xs hover:bg-purple-600"
        >
          Add Spouse
        </button>
      </div>
    </div>
  )

  const getFamilyMemberName = (id: string) => {
    const member = familyData.find((m) => m.id === id)
    return member ? member.name : "Unknown"
  }

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this family member?")) {
      const updatedData = familyData.filter((member) => member.id !== id)
      setFamilyData(updatedData)
      updateLocalStorage(updatedData)
    }
  }

  const handleAddChild = (parentId: string) => {
    router.push(`/add-member?parentId=${parentId}`)
  }

  const handleAddSibling = (siblingId: string) => {
    const sibling = familyData.find((member) => member.id === siblingId)
    if (sibling && sibling.parentId) {
      router.push(`/add-member?parentId=${sibling.parentId}`)
    } else {
      alert("Cannot add sibling: parent not found")
    }
  }

  const handleAddSpouse = (memberId: string) => {
    router.push(`/add-member?spouseId=${memberId}`)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="family-tree p-4">
      <h2 className="text-2xl font-bold mb-4">Family Tree</h2>
      <button onClick={handlePrint} className="mb-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
        Print Family Tree
      </button>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
        {familyData.map(renderFamilyMember)}
      </div>
      <Link
        href="/"
        className="block mt-4 text-center bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 cursor-pointer"
      >
        Back to Home
      </Link>
    </div>
  )
}

