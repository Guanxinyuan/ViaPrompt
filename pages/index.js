import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Palaxy</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="AI-Powered prompt generation tool with rich inspirations. Saves money & time, and evolves your skills" />
      </Head>

      {/* Hero section */}
      <section className="hero-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-7xl font-bold text-gray-900 leading-tight">Master AI Prompts In A Few Clicks</h2>
            <p>
              AI-Powered Mind & Rich Inspirations
            </p>
            <div className="mt-8">
              <Link href="/test" className="text-base font-medium text-white bg-indigo-500 hover:bg-indigo-600 py-3 px-6 rounded-lg">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section >

      {/* Selling point section */}
      < section className="selling-point-card-section" >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <SellingPointCard title={"Optimize"} description={"Endless browsing for inspiration, the proper parameters, or the precise depiction of your idea? We'll serve you the answer in a spark."} />
            <SellingPointCard title={"Analyze"} description={"Every attempt costs you a penny until you get the great one. We'll strike your eyeballs as soon as your 1st or 2nd try."} />
            <SellingPointCard title={"Document"} description={"Great works can be randomly created, but no one masters them by chance. We'll help you develop consistent creativity in AI art."} />
          </div>
        </div>
      </section >
      < footer className="bg-white" >
      </footer >
    </div >
  );
}


export function SellingPointCard({ title, description }) {
  return (
    <div className="selling-point-card">
      <div className="p-5">
        <h3>
          {title}
        </h3>
        <p>
          {description}
        </p>
      </div>
      <div className="px-5 py-3">
      </div>
    </div>
  )

}