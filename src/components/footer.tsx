import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white py-8 mt-auto w-full">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <div>
                        <h3 className="font-semibold mb-4">About</h3>
                        <p className="text-gray-400 text-sm">A simple blog built with Next.js</p>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">Links</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link href="/" className="hover:text-white">Home</Link></li>
                            <li><a href="/about" className="hover:text-white">About</a></li>
                            <li><a href="/contact" className="hover:text-white">Contact</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">Social</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-white">Twitter</a></li>
                            <li><a href="#" className="hover:text-white">LinkedIn</a></li>
                            <li><a href="#" className="hover:text-white">GitHub</a></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
                    <p>&copy; {new Date().getFullYear()} Proforce Intelligence Limited. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}