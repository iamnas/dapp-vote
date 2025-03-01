// import { Route, Routes } from "react-router"
// // import Landing from "./components/Landing"
// import Vote from "./components/Vote"
// import { useEffect, useState } from "react";
// import Header from "./components/Header";
// import Footer from "./components/Footer";
// import { useAccount, useReadContract } from "wagmi";
// import { voteContractData } from "./utils/contract";
// import { Address } from "viem";
// import Candidate from "./components/Candidate";
// import Leader from "./components/Leader";

// function App() {
//   const [darkMode, setDarkMode] = useState(true);
//   const [isAdmin, setIsAdmin] = useState(false);

//   const { isConnecting, isConnected, address } = useAccount()

//   const { data, isFetched } = useReadContract({
//     address: voteContractData.address as Address,
//     abi: voteContractData.abi,
//     functionName: "admin"
//   })

//   useEffect(() => {
//     // console.log(isConnecting, isConnected, address);
//     // console.log(data, "isFetching");

//     if (isConnected && isFetched && address) {
//       if (data === address) { setIsAdmin(true) }
//       else { setIsAdmin(false) }

//     }


//   }, [data, isFetched, isConnecting, isConnected, address, isAdmin])

//   const toggleTheme = () => {
//     setDarkMode(!darkMode)
//   }

//   return (
//     <>


//       <div className="flex flex-col justify-between min-h-screen">

//         <Header darkMode={darkMode} toggleTheme={toggleTheme} />
//         <div className="flex-grow">

//           <Routes>
//             {isAdmin && <Route path="/" element={<Candidate />} />}
//             {/* <Route path="/" element={<Landing />} /> */}
//             <Route path="/" element={<Vote />} />
//             <Route path="/result" element={<Leader />} />
//           </Routes>
//         </div>
//         <Footer darkMode={darkMode} />
//       </div>
//     </>

//   )
// }

// export default App


// import { Route, Routes } from "react-router";
// import { useEffect, useState } from "react";
// import { useAccount, useReadContract } from "wagmi";
// import { Address } from "viem";

// // Components
// import Header from "./components/Header";
// import Footer from "./components/Footer";
// import Vote from "./components/Vote";
// import Candidate from "./components/Candidate";
// import Leader from "./components/Leader";

// // Contract data
// import { voteContractData } from "./utils/contract";

// function App() {
//   const [darkMode, setDarkMode] = useState(true);
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);

//   const { isConnecting, isConnected, address } = useAccount();

//   const { data, isFetched } = useReadContract({
//     address: voteContractData.address as Address,
//     abi: voteContractData.abi,
//     functionName: "admin"
//   });

//   useEffect(() => {
//     if (isConnected && isFetched && address) {
//       setIsAdmin(data === address);
//       setIsLoading(false);
//     } else if (!isConnecting) {
//       setIsLoading(false);
//     }
//   }, [data, isFetched, isConnecting, isConnected, address]);

//   // Simple toggle function
//   const toggleTheme = () => {
//     setDarkMode(!darkMode);
//   };

//   return (
//     <div className={`flex flex-col justify-between min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
//       <Header darkMode={darkMode} toggleTheme={toggleTheme} />
      
//       <div className="flex-grow container mx-auto px-4 py-6">
//         {isLoading ? (
//           <div className="flex justify-center items-center h-full">
//             <p>Loading...</p>
//           </div>
//         ) : (
//           <Routes>
//             <Route path="/" element={isAdmin ? <Candidate /> : <Vote />} />
//             <Route path="/result" element={<Leader />} />
//           </Routes>
//         )}
//       </div>
      
//       <Footer darkMode={darkMode} />
//     </div>
//   );
// }

// export default App;



import { Route, Routes } from "react-router";
import { useEffect, useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import { Address } from "viem";

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import Vote from "./components/Vote";
import Candidate from "./components/Candidate";
import Leader from "./components/Leader";

// Contract data
import { voteContractData } from "./utils/contract";

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { isConnecting, isConnected, address } = useAccount();

  const { data, isFetched } = useReadContract({
    address: voteContractData.address as Address,
    abi: voteContractData.abi,
    functionName: "admin"
  });

  // Add effect to apply dark mode class to document element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    if (isConnected && isFetched && address) {
      setIsAdmin(data === address);
      setIsLoading(false);
    } else if (!isConnecting) {
      setIsLoading(false);
    }
  }, [data, isFetched, isConnecting, isConnected, address]);

  // Simple toggle function
  const toggleTheme = () => {
    setDarkMode(prevMode => !prevMode);
  };

  return (
    <div className={`flex flex-col justify-between min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Header darkMode={darkMode} toggleTheme={toggleTheme} />
      
      <div className="flex-grow container mx-auto px-4 py-4 sm:py-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <Routes>
            <Route path="/" element={isAdmin ? <Candidate darkMode={darkMode}/> : <Vote darkMode={darkMode}/>} />
            <Route path="/result" element={<Leader darkMode={darkMode}/>} />
          </Routes>
        )}
      </div>
      
      <Footer darkMode={darkMode} />
    </div>
  );
}

export default App;