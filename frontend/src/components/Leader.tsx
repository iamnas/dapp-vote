import { useEffect, useState } from "react";
import { Address } from "viem";
import { useReadContract } from "wagmi";
import { voteContractData } from "../utils/contract";

interface CandidateData {

    name: string,
    voteCount: number
}

export default function Leader() {
    const [candidate, setCandidate] = useState<CandidateData>()

    const { data, isFetched } = useReadContract({
        address: voteContractData.address as Address,
        abi: voteContractData.abi,
        functionName: "getLeader"

    })

    useEffect(() => {
        console.log(data, isFetched, "leader");

        if (isFetched && data) {
            const leaderData = data as [string, number];
            setCandidate({
                name: leaderData[0],
                voteCount: leaderData[1]
            })
        };

    }, [isFetched, data])


    return (
        <div>
            <div className="max-w-sm mx-auto flex flex-col items-center justify-center">
                <h1 className=" text-4xl ">Lead Candidate</h1>

                {
                    candidate &&
                    (<div className="flex flex-col items-center justify-center">
                        <div className="flex items-center justify-between w-full p-2.5 bg-gray-50 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600 gap-2">
                            <p className="text-gray-900 dark:text-white">NAME : {candidate?.name}</p>
                            <p className="text-gray-900 dark:text-white">Vote: {candidate?.voteCount}</p>
                        </div>
                    </div>)


                }
            </div>
        </div>
    )
}
