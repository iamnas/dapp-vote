import { NavLink } from "react-router";

export default function Landing() {
  return (
    <div className="flex items-center justify-center ">

        <NavLink className="text-6xl " to={'/vote'}>Vote</NavLink>
      
    </div>
  )
}
