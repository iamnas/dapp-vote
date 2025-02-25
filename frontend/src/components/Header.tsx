import { ConnectKitButton } from "connectkit";
import { Github, Moon, Sun, CheckSquare } from "lucide-react";
// import { useAccount } from "wagmi";

interface HeaderProps {
    darkMode: boolean;
    toggleTheme: () => void;
}

export default function Header({ darkMode, toggleTheme }: HeaderProps) {
   
    return (
        <header className={`sticky top-0 z-50 w-full ${darkMode ? 'bg-gray-800/90' : 'bg-white/90'} backdrop-blur-sm shadow-lg`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex justify-between items-center">

                    {/* Left: App Logo & Name */}
                    <div className="flex items-center gap-3">
                        <CheckSquare className={`h-6 w-6 sm:h-8 sm:w-8 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold">VoteDApp</h1>
                            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Decentralized Voting Platform</p>
                        </div>
                    </div>

                    {/* Right: Theme Toggle, GitHub & Wallet Connect */}
                    <div className="flex items-center gap-4">
                        
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-100'} transition-colors duration-200`}
                        >
                            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        {/* GitHub Link */}
                        <a
                            href="https://github.com/iamnas/dapp-vote"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-100'} transition-colors duration-200`}
                        >
                            <Github size={20} />
                        </a>

                        {/* Wallet Connect Button */}
                        <ConnectKitButton />
                        
                    </div>
                </div>
            </div>
        </header>
    );
}
