import { useEffect, useState } from "react";
import { Address } from "viem";
import { useReadContract, useWriteContract } from "wagmi";
import { voteContractData } from "../utils/contract";

interface CandidateData {
    id: number;
    name: string,
    voteCount: number
}
export default function Vote() {

    const [candidates, setCandidates] = useState<CandidateData[]>([])

    const { data, isFetched } = useReadContract({
        address: voteContractData.address as Address,
        abi: voteContractData.abi,
        functionName: "getAllCandidate"
    })


    useEffect(() => {
        if (isFetched) {

            setCandidates(data as CandidateData[])
        };

    }, [isFetched, data])

        const { writeContract } = useWriteContract()


    const handleVote = (id:number) =>{
        writeContract({
            address: voteContractData.address as Address,
            abi: voteContractData.abi,
            functionName: "vote",
            args: [id]
        })
    }
    return (
        <div className="flex items-center justify-center ">
            <div>
                <div className="max-w-sm mx-auto flex flex-col items-center justify-center">
                    <h1 className=" text-4xl ">ALL Candidate</h1>

                    {
                        candidates && candidates.map((candidate, index) => {
                            return (
                                <div key={index} className="flex flex-col items-center justify-center">
                                    <div className="flex items-center justify-between w-full p-2.5 bg-gray-50 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600 gap-2">
                                        <p className="text-gray-900 dark:text-white">NAME : {candidate.name}</p>
                                        <p className="text-gray-900 dark:text-white">Vote: {candidate.voteCount}</p>
                                        <button type="button" onClick={() => handleVote(candidate.id)} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">VOTE</button>
                                    </div>
                                </div>
                            )
                        })

                    }
                </div>
            </div>


        </div>
    )
}
