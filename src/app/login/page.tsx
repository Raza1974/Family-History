import Link from "next/link"

export default function Login() {
  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form className="space-y-4">
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
        <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
          Login
        </button>
      </form>
      <p className="mt-4 text-center">
        Don't have an account?{" "}
        <Link href="/signup" className="text-blue-500 hover:underline">
          Sign up
        </Link>
      </p>
      <Link href="/" className="block mt-4 text-center bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600">
        Back to Home
      </Link>
    </div>
  )
}

