import { Route, Routes } from "react-router"
import Landing from "./components/Landing"
import Vote from "./components/Vote"
import { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Web3Provider } from "./Web3Provider/Web3Provider";

function App() {
  const [darkMode, setDarkMode] = useState(true);

  const toggleTheme = () => {
    setDarkMode(!darkMode)
  }

  return (
    <>
      <Web3Provider>

        <div className="flex flex-col justify-between min-h-screen">

          <Header darkMode={darkMode} toggleTheme={toggleTheme} />
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/vote" element={<Vote />} />
            </Routes>
          </div>
          <Footer darkMode={darkMode} />
        </div>
      </Web3Provider>
    </>

  )
}

export default App
