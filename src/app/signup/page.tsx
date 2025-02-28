import Link from "next/link"

export default function Signup() {
  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
      <form className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1">
            Name
          </label>
          <input type="text" id="name" name="name" required className="w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label htmlFor="email" className="block mb-1">
            Email
          </label>
          <input type="email" id="email" name="email" required className="w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label htmlFor="password" className="block mb-1">
            Password
          </label>
          <input type="password" id="password" name="password" required className="w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
          Sign Up
        </button>
      </form>
      <p className="mt-4 text-center">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-500 hover:underline">
          Login
        </Link>
      </p>
      <Link href="/" className="block mt-4 text-center bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600">
        Back to Home
      </Link>
    </div>
  )
}

