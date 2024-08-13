
import { Link } from 'react-router-dom';
import brokenImg from "../assets/borken-machine.gif";

export default function NoUser() {
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center gap-4">
        <img src={brokenImg} alt="borken machine icon" className='w-[80px] h-[80px]'/>
    <Link
      to="/"
      className="text-3xl font-semibold text-red-300 animate__animated animate__swing hover:bg-secondary transition-all duration-200 border-transparent px-5 py-3 rounded-lg hover:text-white"
    >
      Please sign in or create an account.
    </Link>
  </div>
);
  
}
