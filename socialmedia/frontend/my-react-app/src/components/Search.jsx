import { useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { SearchIcon } from "lucide-react"

const Search = () => {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await axios.get(`/api/posts/search/?q=${query}`)
      setResults(response.data)
    } catch (error) {
      console.error("Error searching:", error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center text-white">Search DevConnect</h1>

      <form onSubmit={handleSearch} className="mb-8 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon className="text-purple-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search posts or users..."
          className="w-full pl-10 pr-3 py-3 bg-purple-900 bg-opacity-50 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </form>

      {loading && (
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
        </div>
      )}

      {!loading && results.length === 0 && <div className="text-center text-purple-300">No results found</div>}

      <div className="space-y-6">
        {results.map((result) => (
          <div
            key={result.id}
            className="bg-purple-800 bg-opacity-50 backdrop-blur-md p-4 rounded-xl hover:bg-purple-700 transition-colors"
          >
            <div className="flex items-center mb-2">
              <img
                src={result.author.profile_picture || "/default-avatar.png"}
                alt={result.author.username}
                className="w-10 h-10 rounded-full mr-4 object-cover"
              />
              <Link
                to={`/profile/${result.author.username}`}
                className="font-semibold text-white hover:text-purple-300 transition-colors"
              >
                {result.author.username}
              </Link>
            </div>
            <p className="text-purple-200">{result.content}</p>
            {result.image && (
              <img
                src={result.image || "/placeholder.svg"}
                alt="Post"
                className="w-full rounded-lg mt-4 max-h-64 object-cover"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Search

