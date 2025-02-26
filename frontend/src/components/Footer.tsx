import { Github, Twitter, ExternalLink } from "lucide-react";

interface FooterProps {
    darkMode: boolean;
}

export default function Footer({ darkMode }: FooterProps) {
    const currentYear = new Date().getFullYear();
    
    return (
        <footer className={`mt-auto w-full ${darkMode ? 'bg-gray-800/90 border-t border-gray-700' : 'bg-white/90 border-t border-gray-200'} backdrop-blur-sm shadow-lg`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                {/* Main Footer Content */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    {/* Left Side - Creator Info */}
                    <div className="text-center md:text-left">
                        <p className="font-medium flex items-center justify-center md:justify-start gap-1">
                            Made with{" "}
                            <span className="inline-block animate-pulse text-red-500">❤️</span>
                            {" "}by{" "}
                            <a 
                                href="https://x.com/0xnas_eth" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'} transition-colors duration-200 font-semibold inline-flex items-center`}
                                aria-label="Visit 0xnas's Twitter profile"
                            >
                                0xnas
                                <Twitter size={14} className="ml-1" />
                            </a>
                        </p>
                    </div>
                    
                    {/* Right Side - Links */}
                    <div className="flex gap-6">
                        <a 
                            href="https://github.com/iamnas/dapp-vote" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={`flex items-center gap-1 ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors duration-200`}
                            aria-label="View source code on GitHub"
                        >
                            <Github size={16} />
                            <span className="text-sm">Source</span>
                        </a>
                        <a 
                            href="#documentation" 
                            className={`flex items-center gap-1 ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors duration-200`}
                            aria-label="View documentation"
                        >
                            <ExternalLink size={16} />
                            <span className="text-sm">Docs</span>
                        </a>
                    </div>
                </div>
                
                {/* Animated Dots */}
                <div className="mt-4 flex justify-center space-x-3">
                    {['bg-blue-400', 'bg-purple-400', 'bg-green-400', 'bg-yellow-400', 'bg-pink-400'].map((color, index) => (
                        <div 
                            key={index}
                            className={`h-1.5 w-1.5 rounded-full ${color} animate-pulse`} 
                            style={{ animationDelay: `${index * 0.15}s` }}
                        ></div>
                    ))}
                </div>
                
                {/* Copyright */}
                <div className="mt-4 text-center">
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        © {currentYear} VoteDApp. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}