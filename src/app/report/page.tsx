"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import type { FamilyMember } from "../types/FamilyMember"
import { getFamilyData } from "../utils/localStorage"
import { calculateAge, getAverageAge, getMostCommonOccupation } from "../utils/familyUtils"

export default function Report() {
  const [familyData, setFamilyData] = useState<FamilyMember[]>([])
  const [filteredData, setFilteredData] = useState<FamilyMember[]>([])
  const [filters, setFilters] = useState({
    generation: "",
    gender: "",
    ageRange: "",
  })

  useEffect(() => {
    const data = getFamilyData()
    setFamilyData(data)
    setFilteredData(data)
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

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredData))
    const downloadAnchorNode = document.createElement("a")
    downloadAnchorNode.setAttribute("href", dataStr)
    downloadAnchorNode.setAttribute("download", "family_tree_report.json")
    document.body.appendChild(downloadAnchorNode)
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
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
      <div className="mb-4 space-x-2">
        <button onClick={handlePrint} className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
          Print Report
        </button>
        <button onClick={handleDownload} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
          Download Report
        </button>
      </div>
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
        <p>Average Age: {getAverageAge(filteredData)}</p>
        <p>
          Gender Distribution: Male: {filteredData.filter((member) => member.gender === "male").length} | Female:{" "}
          {filteredData.filter((member) => member.gender === "female").length} | Other:{" "}
          {filteredData.filter((member) => member.gender === "other").length}
        </p>
        <p>Generations: {new Set(filteredData.map((member) => member.generationNo)).size}</p>
        <p>Most Common Occupation: {getMostCommonOccupation(filteredData)}</p>
      </div>
      <Link href="/" className="block mt-4 text-center bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600">
        Back to Home
      </Link>
    </div>
  )
}

