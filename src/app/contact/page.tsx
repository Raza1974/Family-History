import Link from "next/link"

export default function Contact() {
  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
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
          <label htmlFor="message" className="block mb-1">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            required
            className="w-full px-3 py-2 border rounded"
          ></textarea>
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
          Send Message
        </button>
      </form>
      <Link href="/" className="block mt-4 text-center bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600">
        Back to Home
      </Link>
    </div>
  )
}

