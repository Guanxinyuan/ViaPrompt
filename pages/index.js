import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <div className='min-h-screen'>
      <Head>
        <title>Palaxy</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="AI-Powered prompt generation tool with rich inspirations. Saves money & time, and evolves your skills" />
      </Head>

      {/* Hero section */}
      <section className="hero-section">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-start items-start">
            <h2 className="text-7xl font-bold text-gray-900 leading-tight">Create amazing AI prompts 10X faster with AI.</h2>
            <p>
              Palaxy is the AI-powered prompt assistant that boosts your prompt engineering efficiency 10x by seamless prompt optimization, analysis, and management.
            </p>

          </div>
        </div>
      </section >

      {/* Selling point section */}
      < section className="selling-point-card-section flex flex-col items-center" >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <SellingPointCard title={"Optimize"} description={"Enhance your AI experience with prompt optimization, turning vague ideas into precise results effortlessly."} />
            <SellingPointCard title={"Analyze"} description={"Unlock the potential of successful prompts by breaking them down, learning their secrets, and applying them to your own projects."} />
            <SellingPointCard title={"Memo"} description={"Memo: Keep track of your brilliant prompts in one convenient place, allowing for easy access and continuous knowledge growth."} />
          </div>
        </div>
        <div className="mt-10 text-right">
          <Link href="/workspace" className="text-base font-medium text-white bg-yellow-500 hover:bg-yellow-600 py-3 px-6 rounded-lg">
            Get Started
          </Link>
        </div>
      </section >
      < footer className="bg-white" >
      </footer >
    </div >
  );
}


const SellingPointCard = ({ title, description }) => {
  const modeColors = {
    'optimize': 'text-yellow-500 dark:text-yellow-500',
    'analyze': 'text-purple-500 dark:text-purple-500',
    'memo': 'text-black dark:text-white'
  }
  return (
    <div className="selling-point-card">
      <div className="p-5">
        <span className={`title ${modeColors[title.toLowerCase()]}`}>
          {title}
        </span>
        <p>
          {description}
        </p>
      </div>
      <div className="px-5 py-3">
      </div>
    </div>
  )

}