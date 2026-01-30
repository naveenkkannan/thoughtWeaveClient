import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { booksService } from "@/services/api"
import { BookOpen, Plus } from "lucide-react"

export default function Library() {
  const [books, setBooks] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = async () => {
    try {
      const data = await booksService.getAll()
      setBooks(data.books)
    } catch (error) {
      console.error("Failed to fetch books:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">My Library</h1>
        <Button onClick={() => navigate("/search")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Book
        </Button>
      </div>

      <Input
        placeholder="Search your books..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="max-w-md"
      />

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">
          Loading your library...
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No books found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery
              ? "Try a different search term"
              : "Start by adding your first book"}
          </p>
          {!searchQuery && (
            <Button onClick={() => navigate("/search")}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Book
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredBooks.map((book) => (
            <Card
              key={book.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(`/books/${book.id}`)}
            >
              <CardContent className="p-4">
                <div className="aspect-[2/3] bg-muted rounded-md mb-3 flex items-center justify-center">
                  {book.cover_url ? (
                    <img
                      src={book.cover_url}
                      alt={book.title}
                      className="w-full h-full object-cover rounded-md"
                    />
                  ) : (
                    <BookOpen className="h-16 w-16 text-muted-foreground" />
                  )}
                </div>
                <h3 className="font-semibold line-clamp-2 mb-1">{book.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                  {book.author}
                </p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">
                    {book.note_count || 0} notes
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-muted">
                    {book.status || "reading"}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
