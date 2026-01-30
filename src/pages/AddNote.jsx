import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { booksService, notesService } from "@/services/api"

export default function AddNote() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [book, setBook] = useState(null)
  const [content, setContent] = useState("")
  const [emotion, setEmotion] = useState("")
  const [pageNumber, setPageNumber] = useState("")
  const [tags, setTags] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchBook()
  }, [id])

  const fetchBook = async () => {
    try {
      const data = await booksService.getById(id)
      setBook(data.book)
    } catch (error) {
      console.error("Failed to fetch book:", error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!content.trim()) return

    setLoading(true)

    try {
      const noteData = {
        content: content.trim(),
        emotion: emotion.trim() || null,
        page_number: pageNumber ? parseInt(pageNumber) : null,
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0),
      }

      await notesService.create(id, noteData)
      navigate(`/books/${id}`)
    } catch (error) {
      console.error("Failed to create note:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!book) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Loading...
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Add Note</CardTitle>
          <p className="text-sm text-muted-foreground">
            {book.title} by {book.author}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="content">Note / Quote / Lesson *</Label>
              <Textarea
                id="content"
                placeholder="Write what resonated with you..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emotion">How did you feel?</Label>
                <Input
                  id="emotion"
                  placeholder="e.g., Motivated, Inspired"
                  value={emotion}
                  onChange={(e) => setEmotion(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pageNumber">Page Number (optional)</Label>
                <Input
                  id="pageNumber"
                  type="number"
                  placeholder="e.g., 42"
                  value={pageNumber}
                  onChange={(e) => setPageNumber(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (optional)</Label>
              <Input
                id="tags"
                placeholder="e.g., productivity, habits, mindset (comma-separated)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Separate tags with commas
              </p>
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Note"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/books/${id}`)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
