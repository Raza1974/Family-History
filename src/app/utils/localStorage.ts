import type { FamilyMember } from "../types/FamilyMember"

export const getFamilyData = (): FamilyMember[] => {
  if (typeof window === "undefined") return []
  const storedData = localStorage.getItem("familyData")
  return storedData ? JSON.parse(storedData) : []
}

export const setFamilyData = (data: FamilyMember[]): void => {
  if (typeof window === "undefined") return
  localStorage.setItem("familyData", JSON.stringify(data))
}

export const getMemberById = (id: string): FamilyMember | undefined => {
  const familyData = getFamilyData()
  return familyData.find((member) => member.id === id)
}