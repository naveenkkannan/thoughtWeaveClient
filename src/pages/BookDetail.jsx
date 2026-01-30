import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { booksService, notesService } from "@/services/api"
import { BookOpen, Plus, Calendar, Tag } from "lucide-react"

export default function BookDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [book, setBook] = useState(null)
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBookAndNotes()
  }, [id])

  const fetchBookAndNotes = async () => {
    try {
      const [bookData, notesData] = await Promise.all([
        booksService.getById(id),
        notesService.getByBook(id),
      ])
      setBook(bookData.book)
      setNotes(notesData.notes)
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Loading book details...
      </div>
    )
  }

  if (!book) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">Book not found</h3>
        <Button onClick={() => navigate("/library")}>Back to Library</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Book Header */}
      <div className="flex flex-col md:flex-row gap-6 pb-6 border-b">
        <div className="w-48 h-72 flex-shrink-0 bg-muted rounded-lg overflow-hidden mx-auto md:mx-0">
          {book.cover_url ? (
            <img
              src={book.cover_url}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen className="h-24 w-24 text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="flex-1 space-y-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
            <p className="text-lg text-muted-foreground mb-4">{book.author}</p>
            <div className="flex gap-2 items-center">
              <span className="text-sm px-3 py-1 rounded-full bg-muted">
                {book.status || "reading"}
              </span>
              <span className="text-sm text-muted-foreground">
                {notes.length} {notes.length === 1 ? "note" : "notes"}
              </span>
            </div>
          </div>
          <Button onClick={() => navigate(`/books/${id}/notes/new`)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Note
          </Button>
        </div>
      </div>

      {/* Notes Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Your Notes</h2>
        {notes.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">
                No notes yet. Start capturing your insights!
              </p>
              <Button onClick={() => navigate(`/books/${id}/notes/new`)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Note
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {notes.map((note) => (
              <Card key={note.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <p className="text-base leading-relaxed mb-4">{note.content}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {note.emotion && (
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-foreground">
                          {note.emotion}
                        </span>
                      </div>
                    )}
                    {note.page_number && (
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        Page {note.page_number}
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(note.created_at).toLocaleDateString()}
                    </div>
                    {note.tags && note.tags.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Tag className="h-4 w-4" />
                        {note.tags.join(", ")}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
