import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export function Card({ setPosts, setIsLoading, contentText }) {
    const [content, setContent] = useState(contentText);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        // Call the onNewPost function with the new post data
        const newPost = { id: 1, content: content + ' new card: Lorem ipsum dolor sit amet, consectetur adipiscing elit.', mode: 'optimize', model: 'gpt-4', prompt: 'Prompt new card: Lorem ipsum dolor sit amet, consectetur adipiscing elit.' }

        setPosts((prevPosts) => [newPost, ...prevPosts]);
        setIsLoading(false);

        // Reset the form and loading state
        setContent('');
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <form onSubmit={handleSubmit}>
                <textarea
                    className="border-gray-300 rounded-lg w-full h-20 p-2 mb-4 text-black"
                    placeholder="Enter your post content"
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                />
                <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded" type="submit">
                </button>
            </form>
        </div>
    );
}


export default function HomePage() {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    return (
        <div className="masonry min-h-screen gap-6 mx-10 py-10">
            <Card setPosts={setPosts} setIsLoading={setIsLoading} />
            {posts.map((post) => (
                <Card key={uuidv4()} setPosts={setPosts} setIsLoading={setIsLoading} contentText={post.content} />
            ))}
            {isLoading && (
                <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-gray-200 opacity-75">
                    <p className="text-gray-600 font-bold">Submitting post...</p>
                </div>
            )}
        </div>
    );
}
