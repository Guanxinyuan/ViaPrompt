import { useEffect, useRef, useState } from "react";
import { loadInitialData } from "@/utils/backend";
import dynamic from "next/dynamic";
const BlurImage = dynamic(() => import("@/components/BlurImage"));

export default function Home(props) {
  const [images, setImages] = useState(props.images.data);
  const [columns, setColumns] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef(null);

  const NUM_COLUMNS = 6;

  const loadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    const response = await fetch(`/api/data?page=${page + 1}`);
    const data = await response.json();

    if (data.data.length === 0) {
      setHasMore(false);
    } else {
      // Add new images to the column with fewest images
      const newImages = data.data.reduce((acc, img) => {
        const colIndex = columns.findIndex((col) => col.length < NUM_COLUMNS);
        if (colIndex === -1) {
          acc.push([img]);
        } else {
          const newColumn = [...columns[colIndex], img];
          const newColumns = [...columns.slice(0, colIndex), newColumn, ...columns.slice(colIndex + 1)];
          setColumns(newColumns);
        }
        return acc;
      }, []);
      setImages([...images, ...newImages.flat()]);
      setPage(page + 1);
    }
    setLoading(false);
  };


  useEffect(() => {
    // Split images into columns
    const initialColumns = Array(NUM_COLUMNS).fill([]);
    const newColumns = images.reduce((acc, img, i) => {
      const colIndex = i % NUM_COLUMNS;
      acc[colIndex] = [...acc[colIndex], img];
      return acc;
    }, initialColumns);
    setColumns(newColumns);

    const options = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        loadMore();
      }
    }, options);

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, [loader.current]);


  return (
    <div className="w-screen">
      <div className="m-auto mx-10 py-4 columns-6 space-y-6 gap-6">
        {columns.map((column, i) => (
          <div key={i} className="flex flex-col gap-6">
            {column.map((image) => (
              <BlurImage key={image.content_id} image={image} />
            ))}
          </div>
        ))}
        {loading && <p>Loading...</p>}
        {!loading && hasMore && (
          <div ref={loader}>
            <p>Loading...</p>
          </div>
        )}
      </div>
    </div>
  );
}



export async function getStaticProps() {
  // const response = await fetch(`${process.env.API_URL}/api/data?page=1`);
  // const data = await response.json();
  const data = await loadInitialData()

  return {
    props: {
      images: data
    }
  };
}