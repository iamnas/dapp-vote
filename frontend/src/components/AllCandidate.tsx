import { useEffect, useState } from "react";
import { Address } from "viem";
import { useReadContract } from "wagmi";
import { Users, Award, Loader2, RefreshCw, AlertTriangle } from "lucide-react";
import { voteContractData } from "../utils/contract";

interface CandidateData {
  id: number;
  name: string;
  voteCount: number;
}

export default function AllCandidate({ darkMode }: { darkMode: boolean }) {
  const [candidates, setCandidates] = useState<CandidateData[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"id" | "voteCount">("id");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data, isFetched, isError, refetch } = useReadContract({
    address: voteContractData.address as Address,
    abi: voteContractData.abi,
    functionName: "getAllCandidate"
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 1000); // Ensure animation plays for at least 1 second
  };

  useEffect(() => {
    if (isFetched) {
      const fetchedCandidates = data as CandidateData[];
      setCandidates(fetchedCandidates);
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [isFetched, data]);

  // Sort candidates based on current sort criteria
  const sortedCandidates = [...candidates].sort((a, b) => {
    if (sortBy === "voteCount") {
      return Number(b.voteCount) - Number(a.voteCount);
    }
    return Number(a.id) - Number(b.id);
  });

  return (
    <div className={`w-full rounded-xl shadow-md border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} overflow-hidden`}>
      {/* Header */}
      <div className={`px-5 py-4 ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className={`h-5 w-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>All Candidates</h2>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "id" | "voteCount")}
              className={`text-xs rounded-md px-2 py-1 ${
                darkMode 
                  ? 'bg-gray-700 text-gray-200 border-gray-600' 
                  : 'bg-white text-gray-700 border-gray-300'
              } border focus:outline-none focus:ring-1 focus:ring-blue-500`}
              disabled={loading || candidates.length === 0}
            >
              <option value="id">Sort by ID</option>
              <option value="voteCount">Sort by Votes</option>
            </select>
            <button
              onClick={handleRefresh}
              disabled={loading && !isRefreshing}
              className={`p-1.5 rounded-full ${
                darkMode
                  ? 'hover:bg-gray-600 text-gray-300' 
                  : 'hover:bg-gray-200 text-gray-600'
              } transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500`}
              title="Refresh candidates"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-1 sm:p-2">
        {loading && !isRefreshing ? (
          <div className="flex flex-col justify-center items-center p-8">
            <Loader2 className={`animate-spin h-8 w-8 mb-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading candidates...</p>
          </div>
        ) : isError ? (
          <div className={`flex flex-col items-center justify-center p-6 ${darkMode ? 'text-red-300' : 'text-red-600'}`}>
            <AlertTriangle className="h-8 w-8 mb-2" />
            <p className="text-sm mb-3">Failed to load candidates</p>
            <button
              onClick={handleRefresh}
              className={`px-3 py-1.5 rounded-md text-sm flex items-center gap-1.5 ${
                darkMode
                  ? 'bg-red-900/30 hover:bg-red-900/50 text-red-200 border border-red-800'
                  : 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200'
              }`}
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Try Again</span>
            </button>
          </div>
        ) : sortedCandidates.length === 0 ? (
          <div className={`p-6 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <Users className="h-10 w-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm mb-1">No candidates yet</p>
            <p className="text-xs">Add your first candidate to get started</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {sortedCandidates.map((candidate, index) => {
              // Calculate percentage for vote indicator
              const maxVotes = Math.max(...candidates.map(c => Number(c.voteCount)));
              const votePercentage = maxVotes > 0 ? (Number(candidate.voteCount) / maxVotes) * 100 : 0;
              
              // Determine if this is the leading candidate
              const isLeader = sortBy === "voteCount" && index === 0 && candidate.voteCount > 0;
              
              return (
                <li 
                  key={candidate.id}
                  className={`relative p-3 sm:p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors ${
                    isLeader ? `${darkMode ? 'bg-blue-900/10' : 'bg-blue-50/50'}` : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full ${
                        isLeader
                          ? 'bg-yellow-500 text-white'
                          : `${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-700'}`
                      }`}>
                        {isLeader ? (
                          <Award className="h-4 w-4" />
                        ) : (
                          <span className="text-xs font-medium">{candidate.id}</span>
                        )}
                      </div>
                      <div>
                        <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {candidate.name}
                        </span>
                        {isLeader && (
                          <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                            darkMode ? 'bg-yellow-900/60 text-yellow-200' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            Leading
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="hidden sm:block w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${isLeader ? 'bg-yellow-500' : 'bg-blue-500'}`} 
                          style={{ width: `${votePercentage}%` }}
                        ></div>
                      </div>
                      
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        candidate.voteCount > 0
                          ? `${darkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-800'}`
                          : `${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`
                      }`}>
                        {candidate.voteCount} {candidate.voteCount === 1 ? 'vote' : 'votes'}
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}