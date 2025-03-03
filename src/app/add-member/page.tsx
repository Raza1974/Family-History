"use client"

import type React from "react"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import type { FamilyMember } from "../types/FamilyMember"
import { getFamilyData, setFamilyData } from "../utils/localStorage"

export default function AddMember() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [member, setMember] = useState<FamilyMember>({
    id: Date.now().toString(),
    name: "",
    birthDate: "",
    deathDate: "",
    generationNo: 1,
    image: "",
    parentId: "",
    spouseId: "",
    siblings: [],
    children: [],
    gender: "other",
    occupation: "",
    education: "",
    notes: "",
    reasonOfDeath: "",
    placeOfBurial: "",
  })

  const isInitialRender = useRef(true)

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false
      const parentId = searchParams.get("parentId")
      const spouseId = searchParams.get("spouseId")
      if (parentId || spouseId) {
        setMember((prev) => ({
          ...prev,
          parentId: parentId || prev.parentId,
          spouseId: spouseId || prev.spouseId,
        }))
      }
    }
  }, [searchParams])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const familyData = getFamilyData()

    // Update related family members
    const updatedFamilyData = familyData.map((familyMember) => {
      if (member.parentId && familyMember.id === member.parentId) {
        return { ...familyMember, children: [...familyMember.children, member.id] }
      }
      if (member.spouseId && familyMember.id === member.spouseId) {
        return { ...familyMember, spouseId: member.id }
      }
      if (member.siblings.includes(familyMember.id)) {
        return { ...familyMember, siblings: [...familyMember.siblings, member.id] }
      }
      return familyMember
    })

    // Add the new member
    updatedFamilyData.push(member)
    setFamilyData(updatedFamilyData)

    router.push("/family-tree")
  }

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target
      setMember((prev) => {
        if (name === "siblings" || name === "children") {
          return { ...prev, [name]: value.split(",").map((item) => item.trim()) }
        } else {
          return { ...prev, [name]: value }
        }
      })
    },
    [],
  )

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setMember((prev) => ({ ...prev, image: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }, [])

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add Family Member</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1">
            Name
          </label>
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
        <div>
          <label htmlFor="birthDate" className="block mb-1">
            Birth Date
          </label>
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
        <div>
          <label htmlFor="deathDate" className="block mb-1">
            Death Date (if applicable)
          </label>
          <input
            type="date"
            id="deathDate"
            name="deathDate"
            value={member.deathDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="generationNo" className="block mb-1">
            Generation Number
          </label>
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
        <div>
          <label htmlFor="image" className="block mb-1">
            Image
          </label>
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
        <div>
          <label htmlFor="parentId" className="block mb-1">
            Parent ID
          </label>
          <input
            type="text"
            id="parentId"
            name="parentId"
            value={member.parentId}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="spouseId" className="block mb-1">
            Spouse ID
          </label>
          <input
            type="text"
            id="spouseId"
            name="spouseId"
            value={member.spouseId}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="gender" className="block mb-1">
            Gender
          </label>
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
        <div>
          <label htmlFor="occupation" className="block mb-1">
            Occupation
          </label>
          <input
            type="text"
            id="occupation"
            name="occupation"
            value={member.occupation}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="education" className="block mb-1">
            Education
          </label>
          <input
            type="text"
            id="education"
            name="education"
            value={member.education}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="notes" className="block mb-1">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            value={member.notes}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border rounded"
          ></textarea>
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
          Add Member
        </button>
      </form>
      <Link href="/" className="block mt-4 text-center bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600">
        Back to Home
      </Link>
    </div>
  )
}

