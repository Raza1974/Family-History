import type { FamilyMember } from "../types/FamilyMember"

export const calculateAge = (birthDate: string, deathDate?: string): number => {
  const birth = new Date(birthDate)
  const death = deathDate ? new Date(deathDate) : new Date()
  let age = death.getFullYear() - birth.getFullYear()
  const monthDiff = death.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && death.getDate() < birth.getDate())) {
    age--
  }
  return age
}

export const getAverageAge = (members: FamilyMember[]): string => {
  if (members.length === 0) return "0"
  const totalAge = members.reduce((sum, member) => sum + calculateAge(member.birthDate, member.deathDate), 0)
  return (totalAge / members.length).toFixed(1)
}

export const getMostCommonOccupation = (members: FamilyMember[]): string => {
  if (members.length === 0) return "N/A"
  const occupationCounts = members.reduce(
    (acc, member) => {
      acc[member.occupation] = (acc[member.occupation] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )
  const sortedOccupations = Object.entries(occupationCounts).sort((a, b) => b[1] - a[1])
  return sortedOccupations[0] ? sortedOccupations[0][0] : "N/A"
}

export const getOldestMember = (members: FamilyMember[]): FamilyMember | undefined => {
  if (members.length === 0) return undefined
  return members.reduce((oldest, member) => {
    if (!oldest) return member
    return new Date(member.birthDate) < new Date(oldest.birthDate) ? member : oldest
  }, members[0])
}