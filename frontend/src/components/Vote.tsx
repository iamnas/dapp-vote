import { useEffect, useState } from "react";
import { Address } from "viem";
import { useReadContract, useWriteContract } from "wagmi";
import { voteContractData } from "../utils/contract";

interface CandidateData {
    id: number;
    name: string,
    voteCount: number
}

export default function Vote({ darkMode }: { darkMode: boolean }) {
    const [candidates, setCandidates] = useState<CandidateData[]>([]);
    const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);
    const [isVoting, setIsVoting] = useState(false);
    const [votedId, setVotedId] = useState<number | null>(null);
    // const [darkMode, setDarkMode] = useState(false);

    const { data, isFetched, refetch } = useReadContract({
        address: voteContractData.address as Address,
        abi: voteContractData.abi,
        functionName: "getAllCandidate"
    });

    useEffect(() => {
        if (isFetched) {
            setCandidates(data as CandidateData[]);
        }
    }, [isFetched, data]);


    const { writeContract, isSuccess } = useWriteContract();

    useEffect(() => {
        if (isSuccess) {
            setIsVoting(false);
            setVotedId(selectedCandidate);
            setSelectedCandidate(null);
            // Refresh candidate data after successful vote
            setTimeout(() => refetch(), 2000);
        }
    }, [isSuccess, refetch, selectedCandidate]);

    const handleVote = (id: number) => {
        setSelectedCandidate(id);
        setIsVoting(true);
        writeContract({
            address: voteContractData.address as Address,
            abi: voteContractData.abi,
            functionName: "vote",
            args: [id]
        });
    };

    // Calculate total votes for percentage display
    const totalVotes = candidates.reduce((sum, candidate) => sum + Number(candidate.voteCount), 0);

    return (
        <div className={`transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
            <div className="container mx-auto px-4 py-6">
                <div className="text-center mb-8">
                    <h1 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-2 ${darkMode ? 'text-blue-400' : 'text-blue-800'}`}>Blockchain Voting System</h1>
                    <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Cast your vote securely and transparently</p>
                </div>

                {/* Stats summary */}
                <div className={`rounded-xl shadow-lg p-4 mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                        <div className="p-2">
                            <p className={`text-sm uppercase ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Candidates</p>
                            <p className={`text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>{candidates.length}</p>
                        </div>
                        <div className="p-2">
                            <p className={`text-sm uppercase ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Votes</p>
                            <p className={`text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>{totalVotes}</p>
                        </div>
                        <div className="p-2 hidden md:block">
                            <p className={`text-sm uppercase ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Leading Candidate</p>
                            <p className={`text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>
                                {candidates.length > 0 ?
                                    candidates.reduce((prev, current) =>
                                        prev.voteCount > current.voteCount ? prev : current
                                    ).name.split(' ')[0] : "None"}
                            </p>
                        </div>
                        <div className="p-2 hidden md:block">
                            <p className={`text-sm uppercase ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Status</p>
                            <p className={`text-2xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>Active</p>
                        </div>
                    </div>
                </div>

                <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Candidates</h2>

                {/* Candidates grid - Made more compact with smaller padding and tighter spacing */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {candidates && candidates.map((candidate) => {
                        const votePercentage = totalVotes > 0 ? (Number(candidate.voteCount) / totalVotes * 100).toFixed(1) : "0";
                        const isCurrentVoting = selectedCandidate === candidate.id && isVoting;
                        const hasVoted = votedId === candidate.id;

                        return (
                            <div
                                key={candidate.id}
                                className={`rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:shadow-xl hover:-translate-y-1 
                                ${hasVoted ? `ring-2 ${darkMode ? 'ring-green-400' : 'ring-green-500'}` : ""}
                                ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
                            >
                                <div className="p-3">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className={`text-md font-semibold truncate ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                            {candidate.name}
                                        </h3>
                                        <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'}`}>
                                            ID: {candidate.id}
                                        </span>
                                    </div>

                                    <div className="mb-3">
                                        <div className="flex justify-between mb-1 text-sm">
                                            <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                                                Votes: {candidate.voteCount}
                                            </span>
                                            <span className={darkMode ? 'text-blue-400 font-medium' : 'text-blue-600 font-medium'}>
                                                {votePercentage}%
                                            </span>
                                        </div>
                                        <div className={`w-full rounded-full h-1.5 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                            <div className={`h-1.5 rounded-full ${darkMode ? 'bg-blue-500' : 'bg-blue-600'}`} style={{ width: `${votePercentage}%` }}></div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleVote(candidate.id)}
                                        disabled={isVoting}
                                        className={`w-full py-2 px-3 rounded-lg font-medium text-xs transition-all
                                            ${isCurrentVoting
                                                ? darkMode
                                                    ? "bg-blue-900 text-blue-300 cursor-not-allowed"
                                                    : "bg-blue-100 text-blue-800 cursor-not-allowed"
                                                : darkMode
                                                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                                                    : "bg-blue-600 hover:bg-blue-700 text-white"
                                            }`}
                                    >
                                        {isCurrentVoting ? (
                                            <span className="flex items-center justify-center">
                                                <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-blue-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Processing
                                            </span>
                                        ) : hasVoted ? (
                                            <span className="flex items-center justify-center">
                                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                </svg>
                                                Voted
                                            </span>
                                        ) : (
                                            "Cast Vote"
                                        )}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {candidates.length === 0 && (
                    <div className="text-center py-10">
                        <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Loading candidates...</p>
                    </div>
                )}


            </div>
        </div>
    );
}