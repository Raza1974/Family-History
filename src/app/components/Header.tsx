import Link from "next/link"

export default function Header() {
  return (
    <header className="bg-blue-600 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Family Tree App</h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="/family-tree" className="hover:underline">
                View Family Tree
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:underline">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:underline">
                Login
              </Link>
            </li>
            <li>
              <Link href="/signup" className="hover:underline">
                Sign Up
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

