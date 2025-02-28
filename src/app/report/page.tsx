"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import type { FamilyMember } from "../types/FamilyMember"
import { getFamilyData } from "../utils/localStorage"
import { calculateAge, getAverageAge, getMostCommonOccupation } from "../utils/familyUtils"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

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

  const handleDownloadPDF = () => {
    const doc = new jsPDF()
    doc.text("Family Tree Report", 14, 15)

    const tableData = filteredData.map((member) => [
      member.name,
      member.birthDate,
      calculateAge(member.birthDate, member.deathDate).toString(),
      member.generationNo.toString(),
      member.gender,
      member.occupation,
      member.education,
      member.notes,
    ])

    autoTable(doc, {
      head: [["Name", "Birth Date", "Age", "Generation", "Gender", "Occupation", "Education", "Notes"]],
      body: tableData,
      startY: 20,
    })

    // Add statistics
    const startY = (doc as any).lastAutoTable.finalY + 10
    doc.text("Statistics", 14, startY)
    doc.text(`Total Members: ${filteredData.length}`, 14, startY + 10)
    doc.text(`Average Age: ${getAverageAge(filteredData)}`, 14, startY + 20)
    doc.text(`Gender Distribution:`, 14, startY + 30)
    doc.text(`  Male: ${filteredData.filter((member) => member.gender === "male").length}`, 14, startY + 40)
    doc.text(`  Female: ${filteredData.filter((member) => member.gender === "female").length}`, 14, startY + 50)
    doc.text(`  Other: ${filteredData.filter((member) => member.gender === "other").length}`, 14, startY + 60)
    doc.text(`Generations: ${new Set(filteredData.map((member) => member.generationNo)).size}`, 14, startY + 70)
    doc.text(`Most Common Occupation: ${getMostCommonOccupation(filteredData)}`, 14, startY + 80)

    doc.save("family_tree_report.pdf")
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Family Tree Report</h2>

      <div className="mb-4 space-x-2 print:hidden">
        <button onClick={handlePrint} className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
          Print Report
        </button>
        <button onClick={handleDownloadPDF} className="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600">
          Download PDF
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
      <Link
        href="/"
        className="block mt-4 text-center bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 print:hidden"
      >
        Back to Home
      </Link>
    </div>
  )
}

