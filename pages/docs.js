import Head from 'next/head';
import Link from 'next/link';

export default function UserGuide() {
    return (
        <div className="bg-zinc-100 min-h-screen">
            <Head>
                <title>User Guide - My Product</title>
            </Head>
            <nav className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <Link href="/" className="text-xl font-bold text-zinc-800">
                                    My Product
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-zinc-800 mb-8">User Guide</h1>
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-zinc-800 mb-4">Component 1</h2>
                    <p className="text-zinc-700 mb-2">
                        Component 1 is the main feature of My Product. It allows you to do X, Y, and Z.
                    </p>
                    <p className="text-zinc-700 mb-4">
                        To use Component 1, first you need to do A, then B, and finally C. You can access it by clicking on the "Component 1" button in the sidebar.
                    </p>
                    <img src="/component1.png" alt="Component 1" className="rounded-lg shadow-lg mb-8" />
                </section>
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-zinc-800 mb-4">Component 2</h2>
                    <p className="text-zinc-700 mb-2">
                        Component 2 is another feature of My Product. It allows you to do P, Q, and R.
                    </p>
                    <p className="text-zinc-700 mb-4">
                        To use Component 2, first you need to do D, then E, and finally F. You can access it by clicking on the "Component 2" button in the sidebar.
                    </p>
                    <img src="/component2.png" alt="Component 2" className="rounded-lg shadow-lg mb-8" />
                </section>
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-zinc-800 mb-4">Component 3</h2>
                    <p className="text-zinc-700 mb-2">
                        Component 3 is yet another feature of My Product. It allows you to do G, H, and I.
                    </p>
                    <p className="text-zinc-700 mb-4">
                        To use Component 3, first you need to do J, then K, and finally L.
                    </p>
                    <img src="/component3.png" alt="Component 3" className="rounded-lg shadow-lg mb-8" />
                </section>
            </main>
        </div>
    );
};