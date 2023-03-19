import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Palaxy</title>
        <link rel="icon" href="/favicon.ico" />
        <description>AI-Powered prompt generation tool with rich inspirations. Saves money, saves time, and evolve your skills</description>
      </Head>

      {/* Hero section */}
      <section className="pt-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-7xl font-bold text-gray-900 leading-tight">Master Midjourney In A Few Clicks</h2>
            <p className="mt-4 text-lg text-gray-500">
              AI-Powered Mind & Rich Inspirations
            </p>
            <div className="mt-8">
              <Link href="/generate" className="text-base font-medium text-white bg-indigo-500 hover:bg-indigo-600 py-3 px-6 rounded-lg">
                Try Prompt Generator
              </Link>
            </div>
          </div>
        </div>
      </section >

      {/* Prompt generation section */}
      < section className="py-24 bg-white" >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Card 1 */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900">
                  Save Time
                </h3>
                <p className="mt-2 text-gray-500">
                  Endless browsing for inspiration, the proper parameters, or the precise depiction of your idea? We'll serve you the answer in a spark.
                </p>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                {/* <Link href="/generate" className="text-base font-medium text-indigo-600 hover:text-indigo-500">
                  Generate Prompt
                </Link> */}
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900">
                  Save Money
                </h3>
                <p className="mt-2 text-gray-500">
                  Every attempt costs you a penny until you get the great one. We'll strike your eyeballs as soon as your 1st or 2nd try.
                </p>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                {/* <Link href="/completion" className="text-base font-medium text-indigo-600 hover:text-indigo-500">
                  Get Started
                </Link> */}
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900">
                  Master AI Arts
                </h3>
                <p className="mt-2 text-gray-500">
                  Great works can be randomly created, but no one masters them by chance. We'll help you develop consistent creativity in AI art.</p>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                {/* <Link href="/sentiment" className="text-base font-medium text-indigo-600 hover:text-indigo-500">
                  Analyze Sentiment
                </Link> */}
              </div>
            </div>
          </div>
        </div>
      </section >

      {/* Gallery section */}
      {/* < section className="py-24 bg-gray-50" >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">See Our Gallery</h2>
            <p className="mt-4 text-lg text-gray-500">
              Check out some of the amazing projects created using our services.
            </p>
            <div className="mt-6">
              <Link href="/gallery" className="text-base font-medium text-white bg-indigo-500 hover:bg-indigo-600 py-3 px-6 rounded-lg">
                View Gallery
              </Link>
            </div>
          </div>
        </div>
      </section > */}
      < footer className="bg-white" >
      </footer >
    </div >
  );
}