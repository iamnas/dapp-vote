import { Route, Routes } from "react-router"
// import Landing from "./components/Landing"
import Vote from "./components/Vote"
import { useEffect, useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { useAccount, useReadContract } from "wagmi";
import { voteContractData } from "./utils/contract";
import { Address } from "viem";
import Candidate from "./components/Candidate";

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const { isConnecting, isConnected, address } = useAccount()

  const { data, isFetched } = useReadContract({
    address: voteContractData.address as Address,
    abi: voteContractData.abi,
    functionName: "admin"
  })

  useEffect(() => {
    // console.log(isConnecting, isConnected, address);
    // console.log(data, "isFetching");

    if (isConnected && isFetched && address) {
      if (data === address) { setIsAdmin(true) }
      else { setIsAdmin(false) }

    }


  }, [data, isFetched, isConnecting, isConnected, address, isAdmin])

  const toggleTheme = () => {
    setDarkMode(!darkMode)
  }

  return (
    <>


      <div className="flex flex-col justify-between min-h-screen">

        <Header darkMode={darkMode} toggleTheme={toggleTheme} />
        <div className="flex-grow">

          <Routes>
            {isAdmin && <Route path="/" element={<Candidate />} />}
            {/* <Route path="/" element={<Landing />} /> */}
            <Route path="/vote" element={<Vote />} />
          </Routes>
        </div>
        <Footer darkMode={darkMode} />
      </div>
    </>

  )
}

export default App
