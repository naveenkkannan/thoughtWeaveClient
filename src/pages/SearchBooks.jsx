import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { booksService } from "@/services/api"
import { Search, BookOpen, Plus } from "lucide-react"

export default function SearchBooks() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const navigate = useNavigate()

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setSearched(true)

    try {
      const data = await booksService.searchGoogleBooks(query)
      setResults(data.books || [])
    } catch (error) {
      console.error("Search failed:", error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleAddBook = async (book) => {
    try {
      const newBook = await booksService.create({
        title: book.title,
        author: book.author,
        cover_url: book.coverUrl,
        google_books_id: book.id,
        status: "reading",
      })
      navigate(`/books/${newBook.book.id}`)
    } catch (error) {
      console.error("Failed to add book:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Add Book</h1>
        <p className="text-muted-foreground">
          Search for books and add them to your library
        </p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          placeholder="Search by title or author..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" disabled={loading}>
          <Search className="h-4 w-4 mr-2" />
          {loading ? "Searching..." : "Search"}
        </Button>
      </form>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">
          Searching Google Books...
        </div>
      ) : searched && results.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No books found</h3>
          <p className="text-muted-foreground">
            Try a different search term
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {results.map((book) => (
            <Card key={book.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="w-20 h-28 flex-shrink-0 bg-muted rounded-md overflow-hidden">
                    {book.coverUrl ? (
                      <img
                        src={book.coverUrl}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold mb-1 line-clamp-2">
                      {book.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {book.author}
                    </p>
                    {book.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {book.description}
                      </p>
                    )}
                    <Button
                      size="sm"
                      onClick={() => handleAddBook(book)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add to Library
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
