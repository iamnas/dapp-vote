import { useEffect, useState } from "react"
import { useAccount, useReadContract, useWriteContract } from "wagmi"
import { voteContractData } from "../utils/contract"
import { Address } from "viem"
import AllCandidate from "./AllCandidate";



export default function Candidate() {


    const [name, setName] = useState<string>('')
    const [voterAddress, setVoterAddress] = useState<string>('')
    const { isConnecting } = useAccount()
    const [isRegistered, setIsRegistered] = useState<boolean | null>(null);


    const { writeContract } = useWriteContract()

    const handleAddCandidate = async () => {

        writeContract({
            address: voteContractData.address as Address,
            abi: voteContractData.abi,
            functionName: "addCandidate",
            args: [name]
        })
    }


    const handleAddVoter = async () => {
        if (!voterAddress) {
            alert("Please enter a valid voter address.");
            return;
        }

        if (voterFetched && isRegistered) {
            alert("Voter is already registered!");
            return;
        }

        writeContract({
            address: voteContractData.address as Address,
            abi: voteContractData.abi,
            functionName: "registerVoter",
            args: [voterAddress]
        });
    };



    const { data: voter, isFetched: voterFetched } = useReadContract({
        address: voteContractData.address as Address,
        abi: voteContractData.abi,
        functionName: "voters",
        args: [voterAddress] // Pass voter address here
    });

    useEffect(() => {



        if (voterFetched && voter ) {
            const vaterValue = voter as boolean[];
            console.log("vaterValue[0]",vaterValue[0]);
            
            setIsRegistered(vaterValue[0]);
        }



    }, [isConnecting, voter, voterFetched, isRegistered,voterAddress])

    return (
        <div className="flex  items-center justify-between">

            <div className="max-w-sm mx-auto flex flex-col items-center justify-center">
                <h1 className=" text-4xl ">Add Candidate</h1>
                {/* <div className="mb-5"> */}
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Candidate Name</label>
                <input type="text" id="name" onChange={(e) => setName(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="candidate name" required />
                {/* </div> */}
                <button type="button" onClick={handleAddCandidate} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
            </div>

            <AllCandidate />


            <form className="max-w-sm mx-auto flex flex-col items-center justify-center">
                <h1 className=" text-4xl ">ADD VOTERS</h1>
                <div className="mb-5">
                    <label htmlFor="voter-address" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Voter Address
                    </label>
                    <input
                        type="text"
                        id="voter-address"
                        className={`bg-gray-50 border text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 ${voterFetched && isRegistered ? "border-red-500 text-red-900" : "border-green-500 text-green-900"
                            }`}
                        placeholder="0x123..."
                        value={voterAddress}
                        onChange={(e) => setVoterAddress(e.target.value)}
                    />
                    {voterFetched && isRegistered ? (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                            <span className="font-medium">Oops!</span> Voter already registered!
                        </p>
                    ) : (
                        <p className="mt-2 text-sm text-green-600 dark:text-green-500">
                            <span className="font-medium">Alright!</span> Address available for registration!
                        </p>
                    )}
                </div>

                <button
                    type="button"
                    onClick={handleAddVoter}
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                    Register Voter
                </button>
            </form>

        </div>

    )
}
