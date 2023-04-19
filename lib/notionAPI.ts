import { Client } from"@notionhq/client";
import { NotionToMarkdown  } from "notion-to-md";
import { NUMBER_OF_POSTS_PER_PAGE } from "@/components/constants/constants";
import { Console } from "console";

const notion = new Client({
    auth: process.env.NOTION_TOKEN,
  });

const n2m = new NotionToMarkdown({ notionClient: notion});

export const getAllPosts = async () =>  {
    const posts = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
    // ブログの公開・非公開
      page_size: 100,
      filter: {
        property: "Published",
        checkbox: {
          equals: true,
        },
      },
    // 日付の新しい順に並べる
      sorts: [
        {
          property: "Date",
          direction: "descending",
        },
      ],
    });

    const allPosts = posts.results;

    return allPosts.map((post) => {
        return getPageMetaData(post);
    });
};


const getPageMetaData = (post) => {
    const getTags = (tags) => {
        const allTags = tags.map((tag) => {
            return tag.name;
        });
        return allTags;
    };

    return{
        id:post.id,
        tags: getTags(post.properties.Tags.multi_select),
        title: post.properties.Name.title[0].plain_text,
        description: post.properties.Description.rich_text[0].plain_text,
        date: post.properties.Date.date.start,
        slug: post.properties.Slug.rich_text[0].plain_text
    }
};


export const getSinglePost =async (slug) => {
    const response = await notion.databases.query({
        database_id: process.env.NOTION_DATABASE_ID,
        filter: {
            property: "Slug",
            formula: {
                string: {
                    equals: slug,
                },
            },
        },
    });

    const page  = response.results[0];
    const metadata = getPageMetaData(page);
    // console.log(metadata);

    const mdblocks = await n2m.pageToMarkdown(page.id);
    const mdString = n2m.toMarkdownString(mdblocks);
    console.log(mdString)
  

    return{
        metadata,
        markdown: mdString,
    };
};


//  Topページ用記事の取得（４つ）
export const getPostForTopPage = async (pageSize : number) => {
    const allPosts = await getAllPosts();
    const fourPosts = allPosts.slice(0, pageSize);
    return fourPosts;
};


// ページ番号に応じた記事取得
export const getPostByPage =async (page:number) => {
    const allPosts = await getAllPosts();

    const startIndex  = (page - 1) * NUMBER_OF_POSTS_PER_PAGE; /* 1page中に表示したいページ数  */
    const endIndex = startIndex + NUMBER_OF_POSTS_PER_PAGE;

    return allPosts.slice(startIndex, endIndex);
    
}


// 動的にURLにページ数を連動させる。すべての記事に対するページ数
export const getNumberOfPages = async () => {
    const allPosts = await getAllPosts();
    // console.log(Math.floor(allPosts.length / NUMBER_OF_POSTS_PER_PAGE));

    return (
        Math.floor(allPosts.length / NUMBER_OF_POSTS_PER_PAGE) +
        (allPosts.length % NUMBER_OF_POSTS_PER_PAGE > 0 ? 1: 0 )
     );
};

// #タグの種類によって、画面を表示させる
export const getPostsByTagAndPage = async (tagName: string, page: number) => {
    const allPosts = await getAllPosts();
    const posts = allPosts.filter((post) =>
      post.tags.find((tag: string) => tag === tagName)
    );
    const startIndex  = (page - 1) * NUMBER_OF_POSTS_PER_PAGE; /* 1page中に表示したいページ数  */
    const endIndex = startIndex + NUMBER_OF_POSTS_PER_PAGE;

    return posts.slice(startIndex, endIndex);

};


//今見ているタグのページ数
export const getNumberOfPagesByTag = async (tagName: string) => {
    const allPosts = await getAllPosts();
    const posts = allPosts.filter((post) =>
      post.tags.find((tag: string) => tag === tagName)
    );

    return (
      Math.floor(posts.length / NUMBER_OF_POSTS_PER_PAGE) +
      (posts.length % NUMBER_OF_POSTS_PER_PAGE > 0 ? 1 : 0)
    );
};

//すべてのタグを取得する
export const getAllTags = async () => {
    const allPosts = await getAllPosts();
  
    const allTagsDuplicationLists = allPosts.flatMap((post) => post.tags);
    const set = new Set(allTagsDuplicationLists);
    const allTagsList = Array.from(set);
    // console.log(allTagsList);
  
    return allTagsList;
  };