import React from "react";

type Props = {
    title : string;
    description : string;
    date : string;
    tag : string;
    slug : string;
};

const SinglePost = (props:Props) => {
    const {title, description, date, tag, slug} = props;
    return (
        <div>
            <h1>{title}</h1>
            <p>{description}</p>
            <span>{date}</span>
            <span>{tag}</span>
            <span>{slug}</span>
        </div>
    );
};

export default SinglePost;