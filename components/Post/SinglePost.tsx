import Link from "next/link";
import React from "react";

type Props = {
    title : string;
    description : string;
    date : string;
    // tag : string;
    tags : string[];
    slug : string;
    isPaginationPage: boolean;
};

const SinglePost = (props:Props) => {
    const {title, description, date, tags, slug, isPaginationPage} = props;
    return (
        <>
         {/* <Link href={`/posts/${slug}`}> */}
            {isPaginationPage ? (
                <section className="bg-sky-700 mb-8 mx-auto rounded-md p-5 shadow-2xl hover: shadow-none hover:translate-y-1 transition-all duration-300">
                    <div className="lg:flex items-center">
                        <h2 className="text-gray-100 text-2xl font-medium mb-2">
                            <Link href={`/posts/${slug}`}>{title}</Link>
                        </h2>
                        <div className="text-gray-400 mr-2">{date}</div>
                        {tags.map((tag:string, index: number) => (
                        <span className="text-white bg-gray-500 rounded-xl px-2 pd-1 font-medium mr-2" key={index}>{tag}</span>
                        ))}
                    </div>
                    <p className="text-gray-100">{description}</p>
                </section>
                // </Link>
            ):(
                <section className="lg:w-1/2 bg-sky-700 mb-8 mx-auto rounded-md p-5 shadow-2xl hover: shadow-none hover:translate-y-1 transition-all duration-300">
                    <div className="flex items-center gap-3">
                        <h2 className="text-gray-100 text-2xl font-medium mb-2">
                            <Link href={`/posts/${slug}`}>{title}</Link>
                        </h2>
                        <div className="text-gray-100">{date}</div>
                        {tags.map((tag:string, index: number) => (
                        <span className="text-white bg-gray-500 rounded-xl px-2 pd-1 font-medium" key={index}>{tag}</span>
                        ))}
                    </div>
                    <p className="text-gray-100">{description}</p>
                </section>
            // </Link>
        )}
        {/* </Link> */}
        </>
    );
};

export default SinglePost;