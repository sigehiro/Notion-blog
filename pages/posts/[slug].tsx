import React from 'react'
import { getAllPosts, getSinglePost } from '../../lib/notionAPI';
import { title } from 'process';
import ReactMarkdown from 'react-markdown'
// 上記の動かなければ下のを試す
// import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {vscDarkPlus} from 'react-syntax-highlighter/dist/cjs/styles/prism'
import Link from 'next/link';



export const getStaticPaths = async () => {
    const allPosts = await getAllPosts();
    const paths = allPosts.map(({slug}) => ({ params: {slug} }));

    return {
        paths: paths,
        fallback: "blocking", // can also be true or 'blocking'

        // paths:[
        //     { params: { slug: "first -post"} },
        //     { params: { slug: "first -post"} },
        //     { params: { slug: "first -post"} },
        // ],
        // fallback: "blocking",
  };
};


export const getStaticProps = async ({ params }) => {
    const post = await getSinglePost(params.slug);

    return{
      props:{
        post,
      },
      revalidate: 10,
    };
  };


const Post = ({post}) => {
  return (
    <section className='container lg:px-2 px-5 h-screen lg:w-2/5 mx-auto mt-20'>
        <h2 className='w-full text-2xl font-medium'>{post.metadata.title}</h2>
        <div className='border-b-2 w-1/3 mt-1 border-sky-900'></div>
        <span className='text-gray-500'>Posted date at {post.metadata.date}</span>
        <br />
        {post.metadata.tags.map((tag: string,  index: number) => (
          <p className='text-white bg-sky-900 rounded-xl font-medium mt-2 px-2 inline-block mr-2' key={index}>
            <Link href={`/posts/tag/${tag}/page/1 `}>
              {tag}
            </Link>
          </p>
        ))}
        <div className='mt-10 font-medium'>
            <ReactMarkdown children={post.markdown}
                components={{
                    code({node, inline, className, children}) {
                    const match = /language-(\w+)/.exec(className || '')
                    return !inline && match ? (
                        <SyntaxHighlighter
                            {...props}
                            children={String(children).replace(/\n$/, '')}
                            style={vscDarkPlus}  /* dark以外にもvsDarkPlus,docco,あるかもしれないcode の背景を変えれる。*/
                            language={match[1]}
                            PreTag="div"
                            />
                    ) : (
                        <code>
                            {children}
                        </code>
                    )
                    }
                }}
            ></ReactMarkdown>

            <Link href="/">
                <span className='pb-20 block mt-3 text-sky-900 '> ← ホームに戻る</span>
            
            </Link>
        </div>

    </section>
  )
}




export default Post;
