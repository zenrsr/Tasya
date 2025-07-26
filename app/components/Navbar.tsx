import { Link } from "react-router";

const Navbar = () => {
    return (
        <nav className="navbar fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
            <div className="flex items-center justify-between w-full">
                <Link to="/" className="group flex items-center gap-3 hover:scale-105 transition-all duration-300">
                    <div className="w-8 h-8  rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:shadow-accent-purple/30 transition-all duration-300">
                        <img src="/images/tasya.png" alt="Tasya AI" className="w-full h-full object-contain" />
                    </div>
                    <p className="text-2xl font-bold text-gradient-dark-contrast bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                        TASYA AI
                    </p>
                </Link>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-2 text-silver-400 text-sm">
                        <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse"></div>
                        <span>AI-Powered Analysis</span>
                    </div>

                    <Link to="/upload" className="primary-button group relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-accent-purple to-accent-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            Upload Resume
                        </div>
                    </Link>
                </div>
            </div>
        </nav>
    )
}
export default Navbar
