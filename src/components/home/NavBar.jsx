import { signOut } from 'firebase/auth';
import React, { useContext } from 'react'
import { FaUser } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { auth } from '../../firebase';

function NavBar() {

  const {currentUser} = useContext(AuthContext)

  return (
    <nav className='flex justify-between items-center bg-slate-200 p-3'>
        <div className='  h-8 w-8 rounded-full border-gray-700 border relative before:absolute before:top-[25%] before:left-0 before:h-[7px] before:w-[7px] before:translate-y-[-100%] before:z-30 before:rounded-full before:bg-green-400'>
            <img src={currentUser.photoURL} className="h-full w-full object-cover rounded-full" alt="" />
        </div>
        <div>
            <Link to='' className=' text-sm' onClick={e => signOut(auth)}>Se deconnecter</Link>
        </div>
    </nav>
  )
}

export default NavBar