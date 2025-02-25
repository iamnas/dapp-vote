import { Route, Routes } from "react-router"
import Landing from "./components/Landing"
import Vote from "./components/Vote"

function App() {

  return (
    <>

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/vote" element={<Vote />} />
      </Routes>
    </>
  )
}

export default App
