import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-8">Welcome to Family Tree App</h1>
      <div className="flex flex-col space-y-4">
        <Link
          href="/add-member"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-center"
        >
          Add Family Member
        </Link>
        <Link
          href="/family-tree"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-center"
        >
          View Family Tree
        </Link>
        <Link
          href="/report"
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded text-center"
        >
          Generate Report
        </Link>
      </div>
    </div>
  )
}

