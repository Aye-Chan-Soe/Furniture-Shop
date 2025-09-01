import { useSuspenseQuery } from '@tanstack/react-query'
import { Link, useLoaderData } from 'react-router-dom'

import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
// import { posts } from '@/data/posts'
import RichTextRender from '@/components/blogs/RichTextRender'
import { onePostQuery, postQuery } from '@/api/query'
import { Post, Tag } from '@/types'

export default function BlogDetail() {
  // const {postId} = useParam()
  //const post = posts.find((post) => post.id === postId)
  const { postId } = useLoaderData()
  const { data: postData } = useSuspenseQuery(postQuery('?limit=6'))
  const { data: postDetail } = useSuspenseQuery(onePostQuery(postId))
  //console.log('postData', postData)
  //console.log('postDetail', postDetail)

  const imageUrl = import.meta.env.VITE_IMG_URL
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
          {postDetail ? (
            <>
              <h2 className="mb-3 text-3xl font-extrabold">{postDetail.post.title}</h2>
              <div className="text-sm">
                <span>
                  by <span className="font-[600]">{postDetail.post.author.fullName}</span> on
                  <span className="font-[600]"> {postDetail.post.updatedAt}</span>
                </span>
              </div>
              <h3 className="my-6 text-base font-[400]">{postDetail.post.content}</h3>
              <img
                src={imageUrl + postDetail.post.image}
                alt={postDetail.post.title}
                className="w-full rounded-xl"
                loading="lazy"
                decoding="async"
              />
              <RichTextRender content={postDetail.post.body} className="my-8" />
              <div className="mb-12 space-x-2">
                {postDetail.post.tags.map((tag: Tag) => (
                  <Button variant="secondary" key={tag.name}>
                    {tag.name}
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
            {postData.posts.map((post: Post) => (
              <Link key={post.id} to={`/blogs/${post.id}`} className="mb-6 flex items-start gap-2">
                <img
                  src={imageUrl + post.image}
                  alt="Blog_Post"
                  className="w-1/4 rounded"
                  decoding="async"
                  loading="lazy"
                />
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
