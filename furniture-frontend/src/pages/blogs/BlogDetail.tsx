import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { posts } from '@/data/posts'
import { Link, useParams } from 'react-router-dom'
import RichTextRender from '@/components/blogs/RichTextRender'

export default function BlogDetail() {
  const { postId } = useParams()

  const post = posts.find((post) => post.id === postId)
  return (
    <div className="container mx-auto px-4 lg:px-0">
      <section className="flex flex-col lg:flex-row">
        <section className="w-full lg:w-3/4 lg:pr-16">
          <Button variant="outline" asChild className="mt-8 mb-6">
            <Link to="/blogs">
              <Icons.arrowLeft />
              All Posts
            </Link>
          </Button>
          {post ? (
            <>
              <h2 className="mb-3 text-3xl font-extrabold">{post.title}</h2>
              <div className="text-sm">
                <span>
                  by <span className="font-[600]">{post.author}</span> on
                  <span className="font-[600]"> {post.updated_at}</span>
                </span>
              </div>
              <h3 className="my-6 text-base font-[400]">{post.content}</h3>
              <img src={post.image} alt={post.title} className="w-full rounded-xl" />
              <RichTextRender content={post.body} className="my-8" />
              <div className="mb-12 space-x-2">
                {post.tags.map((tag) => (
                  <Button variant="secondary" key={tag}>
                    {tag}
                  </Button>
                ))}
              </div>
            </>
          ) : (
            <p className="text-muted-foreground mt-8 mb-16 text-center text-xl font-bold lg:mt-24">
              No post found.
            </p>
          )}
        </section>
        <section className="w-full lg:mt-24 lg:w-1/4">
          <div className="mb-3 flex items-center gap-2 text-base font-semibold">
            <Icons.layers />
            <h3>Other Blog Post</h3>
          </div>
          <div className="md:md-grid-cols-2 grid grid-cols-1 gap-4 lg:grid-cols-1">
            {posts.map((post) => (
              <Link key={post.id} to={`/blogs/${post.id}`} className="mb-6 flex items-start gap-2">
                <img src={post.image} alt="Blog_Post" className="w-1/4 rounded" />
                <div className="text-muted-foreground w-3/4 text-sm font-[500]">
                  <p className="line-clamp-2">{post.content}</p>
                  <i>...see more</i>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </section>
    </div>
  )
}
