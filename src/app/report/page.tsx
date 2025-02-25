"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import type { FamilyMember } from "../types/FamilyMember"
import { initialFamilyData } from "../data/initialFamilyData"

export default function Report() {
  const [familyData, setFamilyData] = useState<FamilyMember[]>([])
  const [filteredData, setFilteredData] = useState<FamilyMember[]>([])
  const [filters, setFilters] = useState({
    generation: "",
    gender: "",
    ageRange: "",
  })

  useEffect(() => {
    const storedData = localStorage.getItem("familyData")
    if (storedData) {
      const parsedData = JSON.parse(storedData)
      setFamilyData(parsedData)
      setFilteredData(parsedData)
    } else {
      setFamilyData(initialFamilyData)
      setFilteredData(initialFamilyData)
      localStorage.setItem("familyData", JSON.stringify(initialFamilyData))
    }
  }, [])

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }))
  }

  useEffect(() => {
    let result = familyData

    if (filters.generation) {
      result = result.filter((member) => member.generationNo === Number.parseInt(filters.generation))
    }

    if (filters.gender) {
      result = result.filter((member) => member.gender === filters.gender)
    }

    if (filters.ageRange) {
      const currentYear = new Date().getFullYear()
      const [minAge, maxAge] = filters.ageRange.split("-").map(Number)
      result = result.filter((member) => {
        const age = currentYear - new Date(member.birthDate).getFullYear()
        return age >= minAge && age <= maxAge
      })
    }

    setFilteredData(result)
  }, [familyData, filters])

  const calculateAge = (birthDate: string, deathDate?: string) => {
    const birth = new Date(birthDate)
    const death = deathDate ? new Date(deathDate) : new Date()
    const age = death.getFullYear() - birth.getFullYear()
    const monthDiff = death.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && death.getDate() < birth.getDate())) {
      return age - 1
    }
    return age
  }

  const handlePrint = () => {
    window.print()
  }

  const getAverageAge = () => {
    if (filteredData.length === 0) return 0
    const totalAge = filteredData.reduce((sum, member) => sum + calculateAge(member.birthDate, member.deathDate), 0)
    return (totalAge / filteredData.length).toFixed(1)
  }

  const getMostCommonOccupation = () => {
    if (filteredData.length === 0) return "N/A"
    const occupationCounts = filteredData.reduce(
      (acc, member) => {
        acc[member.occupation] = (acc[member.occupation] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )
    const sortedOccupations = Object.entries(occupationCounts).sort((a, b) => b[1] - a[1])
    return sortedOccupations[0] ? sortedOccupations[0][0] : "N/A"
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Family Tree Report</h2>
      <div className="mb-4 flex space-x-4">
        <div>
          <label htmlFor="generation" className="block mb-1">
            Generation
          </label>
          <select
            id="generation"
            name="generation"
            value={filters.generation}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">All</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
        </div>
        <div>
          <label htmlFor="gender" className="block mb-1">
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            value={filters.gender}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">All</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label htmlFor="ageRange" className="block mb-1">
            Age Range
          </label>
          <select
            id="ageRange"
            name="ageRange"
            value={filters.ageRange}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">All</option>
            <option value="0-18">0-18</option>
            <option value="19-30">19-30</option>
            <option value="31-50">31-50</option>
            <option value="51-70">51-70</option>
            <option value="71-100">71+</option>
          </select>
        </div>
      </div>
      <button onClick={handlePrint} className="mb-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
        Print Report
      </button>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">Name</th>
            <th className="border border-gray-300 p-2">Birth Date</th>
            <th className="border border-gray-300 p-2">Age</th>
            <th className="border border-gray-300 p-2">Generation</th>
            <th className="border border-gray-300 p-2">Gender</th>
            <th className="border border-gray-300 p-2">Occupation</th>
            <th className="border border-gray-300 p-2">Education</th>
            <th className="border border-gray-300 p-2">Notes</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((member) => (
            <tr key={member.id}>
              <td className="border border-gray-300 p-2">{member.name}</td>
              <td className="border border-gray-300 p-2">{member.birthDate}</td>
              <td className="border border-gray-300 p-2">{calculateAge(member.birthDate, member.deathDate)}</td>
              <td className="border border-gray-300 p-2">{member.generationNo}</td>
              <td className="border border-gray-300 p-2">{member.gender}</td>
              <td className="border border-gray-300 p-2">{member.occupation}</td>
              <td className="border border-gray-300 p-2">{member.education}</td>
              <td className="border border-gray-300 p-2">{member.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4">
        <h3 className="text-xl font-bold mb-2">Statistics</h3>
        <p>Total Members: {filteredData.length}</p>
        <p>Average Age: {getAverageAge()}</p>
        <p>
          Gender Distribution: Male: {filteredData.filter((member) => member.gender === "male").length} | Female:{" "}
          {filteredData.filter((member) => member.gender === "female").length} | Other:{" "}
          {filteredData.filter((member) => member.gender === "other").length}
        </p>
        <p>Generations: {new Set(filteredData.map((member) => member.generationNo)).size}</p>
        <p>Most Common Occupation: {getMostCommonOccupation()}</p>
      </div>
      <Link href="/" className="block mt-4 text-center bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600">
        Back to Home
      </Link>
    </div>
  )
}

