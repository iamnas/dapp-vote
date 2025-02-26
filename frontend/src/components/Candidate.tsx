import { useEffect, useState } from "react";
import { useReadContract, useWriteContract } from "wagmi";
import { voteContractData } from "../utils/contract";
import { Address } from "viem";
import { AlertCircle, CheckCircle, PlusCircle, UserPlus, Loader2, Users } from "lucide-react";
import AllCandidate from "./AllCandidate";

interface StatusMessageProps {
  success: boolean;
  message: string;
}

const StatusMessage = ({ success, message }: StatusMessageProps) => (
  <div className={`mt-3 p-2.5 rounded-md text-sm flex items-center gap-2 ${
    success 
      ? "bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200" 
      : "bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200"
  }`}>
    {success ? (
      <CheckCircle className="h-4 w-4 flex-shrink-0" />
    ) : (
      <AlertCircle className="h-4 w-4 flex-shrink-0" />
    )}
    <span>{message}</span>
  </div>
);

export default function Candidate({ darkMode }: { darkMode: boolean }) {
  const [name, setName] = useState<string>("");
  const [voterAddress, setVoterAddress] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean | null>(null);
  const [registerSuccess, setRegisterSuccess] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const { writeContract, isPending: isWritePending, isSuccess: isWriteSuccess, isError: isWriteError, error } = useWriteContract();

  // Read voter registration status
  const { data: voter, isFetched: voterFetched, refetch: refetchVoter } = useReadContract({
    address: voteContractData.address as Address,
    abi: voteContractData.abi,
    functionName: "voters",
    args: [voterAddress || "0x0000000000000000000000000000000000000000"] // Default value when empty
  });

  // Handle add candidate
  const handleAddCandidate = async () => {
    if (!name.trim()) {
      setErrorMessage("Please enter a candidate name");
      return;
    }

    setIsSubmitting(true);
    setSubmitSuccess(null);
    setErrorMessage("");

    try {
      writeContract({
        address: voteContractData.address as Address,
        abi: voteContractData.abi,
        functionName: "addCandidate",
        args: [name]
      });
    } catch (error) {
      console.error("Error adding candidate:", error);
      setIsSubmitting(false);
      setSubmitSuccess(false);
      setErrorMessage("Transaction failed to initiate");
    }
  };

  // Handle add voter
  const handleAddVoter = async () => {
    if (!voterAddress || !voterAddress.startsWith("0x") || voterAddress.length !== 42) {
      setErrorMessage("Please enter a valid Ethereum address");
      return;
    }

    if (voterFetched && isRegistered) {
      setErrorMessage("Voter is already registered!");
      return;
    }

    setIsRegistering(true);
    setRegisterSuccess(null);
    setErrorMessage("");

    try {
      writeContract({
        address: voteContractData.address as Address,
        abi: voteContractData.abi,
        functionName: "registerVoter",
        args: [voterAddress]
      });
    } catch (error) {
      console.error("Error registering voter:", error);
      setIsRegistering(false);
      setRegisterSuccess(false);
      setErrorMessage("Transaction failed to initiate");
    }
  };

  // Update registration status when voter data changes
  useEffect(() => {
    if (voterFetched && voter) {
      const voterValue = voter as boolean[];
      setIsRegistered(voterValue[0]);
    } else {
      setIsRegistered(false);
    }
  }, [voter, voterFetched, voterAddress]);

  // Handle transaction states
  useEffect(() => {
    if (!isWritePending) {
      setIsSubmitting(false);
      setIsRegistering(false);
    }
    
    if (isWriteSuccess) {
      if (isSubmitting) {
        setSubmitSuccess(true);
        setName("");
        setTimeout(() => setSubmitSuccess(null), 5000);
      }
      if (isRegistering) {
        setRegisterSuccess(true);
        setVoterAddress("");
        refetchVoter();
        setTimeout(() => setRegisterSuccess(null), 5000);
      }
    }
    
    if (isWriteError) {
      if (isSubmitting) {
        setSubmitSuccess(false);
        setErrorMessage(error?.message || "Transaction failed");
      }
      if (isRegistering) {
        setRegisterSuccess(false);
        setErrorMessage(error?.message || "Transaction failed");
      }
    }
  }, [isWritePending, isWriteSuccess, isWriteError, isSubmitting, isRegistering, error, refetchVoter]);

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <div className={`flex items-center justify-center gap-3 mb-6 sm:mb-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        <Users className="h-6 w-6 sm:h-8 sm:w-8" />
        <h1 className="text-2xl sm:text-3xl font-bold text-center">Admin Dashboard</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Left Column: Add Candidate Form */}
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-md p-5 sm:p-6 border`}>
          <div className="flex items-center gap-2 mb-4 sm:mb-5">
            <PlusCircle className={`h-5 w-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Add Candidate</h2>
          </div>
          
          <div className="mb-4">
            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Candidate Name
            </label>
            <input 
              type="text" 
              id="name" 
              value={name}
              onChange={(e) => setName(e.target.value)} 
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-300'
              }`}
              placeholder="Enter candidate name" 
            />
          </div>
          
          <button 
            type="button" 
            onClick={handleAddCandidate}
            disabled={isSubmitting || !name.trim()} 
            className={`w-full py-2.5 px-4 rounded-lg font-medium flex items-center justify-center gap-2 text-sm sm:text-base transition-colors ${
              isSubmitting || !name.trim()
                ? `${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'} cursor-not-allowed` 
                : `${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <PlusCircle className="h-4 w-4" />
                <span>Add Candidate</span>
              </>
            )}
          </button>
          
          {submitSuccess !== null && (
            <StatusMessage 
              success={submitSuccess} 
              message={submitSuccess ? "Candidate added successfully!" : errorMessage || "Failed to add candidate. Please try again."} 
            />
          )}
        </div>

        {/* Middle Column: All Candidates */}
        <div className="lg:col-span-1">
          <AllCandidate darkMode={darkMode} />
        </div>

        {/* Right Column: Add Voter Form */}
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-md p-5 sm:p-6 border`}>
          <div className="flex items-center gap-2 mb-4 sm:mb-5">
            <UserPlus className={`h-5 w-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Register Voter</h2>
          </div>
          
          <div className="mb-4">
            <label htmlFor="voter-address" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Voter Address
            </label>
            <input 
              type="text" 
              id="voter-address"
              value={voterAddress}
              onChange={(e) => setVoterAddress(e.target.value)}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 transition-colors ${
                voterFetched && isRegistered 
                  ? `${darkMode ? 'border-red-500 focus:ring-red-500' : 'border-red-300 focus:ring-red-500'}` 
                  : voterAddress && voterAddress.startsWith("0x") && voterAddress.length === 42
                  ? `${darkMode ? 'border-green-500 focus:ring-green-500' : 'border-green-300 focus:ring-green-500'}`
                  : `${darkMode ? 'border-gray-600 focus:ring-blue-500' : 'border-gray-300 focus:ring-blue-500'}`
              } ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'}`}
              placeholder="0x123..." 
            />
            
            {voterAddress && voterAddress.startsWith("0x") && voterAddress.length === 42 && (
              <div className={`mt-2 text-sm flex items-center gap-1.5 ${
                voterFetched && isRegistered 
                  ? `${darkMode ? 'text-red-400' : 'text-red-600'}`
                  : `${darkMode ? 'text-green-400' : 'text-green-600'}`
              }`}>
                {voterFetched && isRegistered ? (
                  <>
                    <AlertCircle className="h-4 w-4" />
                    <span>Already registered as a voter</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    <span>Address available for registration</span>
                  </>
                )}
              </div>
            )}
          </div>
          
          <button 
            type="button" 
            onClick={handleAddVoter}
            disabled={isRegistering || !voterAddress || !voterAddress.startsWith("0x") || voterAddress.length !== 42 || (voterFetched && isRegistered)} 
            className={`w-full py-2.5 px-4 rounded-lg font-medium flex items-center justify-center gap-2 text-sm sm:text-base transition-colors ${
              isRegistering || !voterAddress || !voterAddress.startsWith("0x") || voterAddress.length !== 42 || (voterFetched && isRegistered)
                ? `${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'} cursor-not-allowed`
                : `${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`
            }`}
          >
            {isRegistering ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                <span>Register Voter</span>
              </>
            )}
          </button>
          
          {registerSuccess !== null && (
            <StatusMessage 
              success={registerSuccess} 
              message={registerSuccess ? "Voter registered successfully!" : errorMessage || "Failed to register voter. Please try again."} 
            />
          )}
        </div>
      </div>
    </div>
  );
}