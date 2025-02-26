import { useEffect, useState } from "react";
import { Address } from "viem";
import { useReadContract } from "wagmi";
import { Trophy, Award, Loader2 } from "lucide-react";
import { voteContractData } from "../utils/contract";

interface CandidateData {
  name: string;
  voteCount: number;
}

export default function Leader({ darkMode }: { darkMode: boolean }) {
  const [candidate, setCandidate] = useState<CandidateData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { data, isFetched, isError, refetch } = useReadContract({
    address: voteContractData.address as Address,
    abi: voteContractData.abi,
    functionName: "getLeader",
  });

  useEffect(() => {
    if (isFetched) {
      setIsLoading(false);
      
      if (data) {
        const leaderData = data as [string, number];
        setCandidate({
          name: leaderData[0],
          voteCount: leaderData[1]
        });
      }
    }
  }, [isFetched, data]);

  // Handle refresh of data
  const handleRefresh = () => {
    setIsLoading(true);
    refetch();
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-6">
      <div className={`rounded-xl overflow-hidden shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} transition-all duration-300`}>
        {/* Header */}
        <div className={`px-6 py-4 ${darkMode ? 'bg-gray-700' : 'bg-blue-50'} border-b ${darkMode ? 'border-gray-600' : 'border-blue-100'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Trophy className={`${darkMode ? 'text-yellow-300' : 'text-yellow-500'} h-6 w-6`} />
              <h2 className="text-2xl font-bold">Lead Candidate</h2>
            </div>
            <button 
              onClick={handleRefresh} 
              className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-blue-100'} transition-colors`}
              aria-label="Refresh leader data"
              title="Refresh data"
            >
              <svg 
                className={`h-4 w-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'} ${isLoading ? 'animate-spin' : ''}`} 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-6">
              <Loader2 className={`h-8 w-8 ${darkMode ? 'text-blue-400' : 'text-blue-600'} animate-spin`} />
              <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading leader data...</p>
            </div>
          ) : isError ? (
            <div className="text-center py-6">
              <div className={`rounded-lg ${darkMode ? 'bg-red-900/20 text-red-200' : 'bg-red-50 text-red-600'} p-4`}>
                <p>Unable to fetch leader data. Please try again.</p>
                <button 
                  onClick={handleRefresh}
                  className={`mt-2 px-4 py-2 rounded-md ${
                    darkMode ? 'bg-red-800 hover:bg-red-700 text-white' : 'bg-red-100 hover:bg-red-200 text-red-700'
                  } transition-colors`}
                >
                  Retry
                </button>
              </div>
            </div>
          ) : candidate && candidate.name ? (
            <div className="flex flex-col items-center">
              <div className="relative mb-6">
                <div className={`h-24 w-24 rounded-full flex items-center justify-center ${
                  darkMode ? 'bg-gray-700' : 'bg-blue-50'
                } border-4 ${darkMode ? 'border-yellow-500' : 'border-yellow-400'}`}>
                  <span className="text-3xl">{candidate.name.charAt(0).toUpperCase()}</span>
                </div>
                <Award className="absolute bottom-0 right-0 h-8 w-8 text-yellow-500" />
              </div>
              
              <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {candidate.name}
              </h3>
              
              <div className={`inline-flex items-center px-4 py-2 rounded-full ${
                darkMode ? 'bg-blue-900/20 text-blue-300' : 'bg-blue-100 text-blue-800'
              }`}>
                <span className="font-semibold">{candidate.voteCount}</span>
                <span className="ml-1">votes</span>
              </div>
              
              <div className="w-full mt-6 pt-6 border-t border-dashed border-gray-300 dark:border-gray-600">
                <p className={`text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Currently in the lead. Voting results may change as more votes are cast.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                No leading candidate data available yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}