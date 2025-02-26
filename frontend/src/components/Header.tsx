import { ConnectKitButton } from "connectkit";
import { Github, Moon, Sun, CheckSquare } from "lucide-react";

interface HeaderProps {
    darkMode: boolean;
    toggleTheme: () => void;
}

export default function Header({ darkMode, toggleTheme }: HeaderProps) {
    return (
        <header className={`sticky top-0 z-50 w-full ${darkMode ? 'bg-gray-800/90' : 'bg-white/90'} backdrop-blur-sm shadow-lg border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4">
                <div className="flex justify-between items-center">

                    {/* Left: App Logo & Name with improved spacing and responsive typography */}
                    <div className="flex items-center gap-2 md:gap-3">
                        <CheckSquare className={`h-6 w-6 sm:h-7 sm:w-7 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                        <div>
                            <h1 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-500">Vote</span>
                                <span>DApp</span>
                            </h1>
                            <p className={`text-xs md:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Decentralized Voting Platform</p>
                        </div>
                    </div>

                    {/* Right: Theme Toggle, GitHub & Wallet Connect */}
                    <div className="flex items-center gap-2 md:gap-4">
                        
                        {/* Theme Toggle with accessibility improvements */}
                        <button
                            onClick={toggleTheme}
                            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                            className={`p-2 rounded-lg ${
                                darkMode 
                                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                            } transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500`}
                        >
                            {darkMode ? <Sun size={18} className="md:w-5 md:h-5" /> : <Moon size={18} className="md:w-5 md:h-5" />}
                        </button>

                        {/* GitHub Link with accessibility improvements */}
                        <a
                            href="https://github.com/iamnas/dapp-vote"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="View source code on GitHub"
                            title="View source code on GitHub"
                            className={`p-2 rounded-lg ${
                                darkMode 
                                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                            } transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500`}
                        >
                            <Github size={18} className="md:w-5 md:h-5" />
                        </a>

                        {/* Wallet Connect Button */}
                        <div className="flex items-center">
                            <ConnectKitButton />
                        </div>
                        
                    </div>
                </div>
            </div>
        </header>
    );
}