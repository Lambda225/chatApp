import React, { useContext, useEffect, useState } from 'react'
import NavBar from './NavBar'
import { IoSearchOutline } from "react-icons/io5";
import CartChat from './CartChat';
import { FaUser } from "react-icons/fa";
import { collection, doc, getDoc, getDocs, onSnapshot, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import {db} from "../../firebase"
import { AuthContext } from '../../context/AuthContext';

function ContactBox() {

  const [name,setName] = useState("")
  const [user,setUser] = useState()
  const {currentUser} = useContext(AuthContext)
  const [chats,setChats] = useState({})

  const hundleSubmit = async(e) =>{
    e.preventDefault()

    const citiesRef = collection(db, "users");

    // Create a query against the collection.
    const q = query(citiesRef, where("displayName", "==", name));
    try{

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        setUser(doc.data())
      });

    }catch (error){
      console.log(error);
    }

  }

  const hundleClik = async (e) =>{
    const combinedId = currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid

    try{
      const res = await getDoc(doc(db,"chats",combinedId))

      if(!res.exists()){
        //create chat in chat collection
        await setDoc(doc(db,"chats",combinedId),{ message:[] })

        // create user chat
        await updateDoc(doc(db,"userChats",currentUser.uid),{
          [combinedId + ".userInfo"]: {
            uid:user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL
          },
          [combinedId + ".date"]: serverTimestamp()
        })

        await updateDoc(doc(db,"userChats",user.uid),{
          [combinedId + ".userInfo"]: {
            uid:currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL
          },
          [combinedId + ".date"]: serverTimestamp()
        })
      }
    }catch (error) {
      console.log(error);
    }
    setUser(null)
    setName('')

  }

  useEffect(()=>{

    // Get every user chats at currente user 
    const getChats = ()=>{
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data());
      });
      return () =>{
        unsub()
      }
    }

    currentUser.uid && getChats()

  },[currentUser.uid])


  return (
    <div className=' overflow-hidden h-full flex flex-col'>
        <NavBar />
        <div className='p-3 bg-slate-200 overflow-hidden h-full flex flex-col'>
            <form onSubmit={hundleSubmit} className='flex mb-4 items-center gap-x-4 rounded-full bg-slate-50 px-3'>
                <IoSearchOutline className=' text-slate-500 text-lg'/>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className='focus:outline-none bg-transparent p-2 w-full' placeholder='Rechercher' />
            </form>

            {user ? 
                <div className=' shadow-lg p-6 cursor-pointer mb-5 hover:bg-white bg-slate-100 mt-3' onClick={hundleClik}>
                <div className='flex justify-between'>
                    <div className='flex gap-x-4'>
                        <div>
                            <div className=' p-3 rounded-full border-gray-700 border relative before:absolute before:top-[30%] before:left-0 before:h-2 before:w-2 before:translate-y-[-100%] before:z-30 before:rounded-full before:bg-green-400'>
                                <FaUser className='text-lg' />
                            </div>
                        </div>
                        <div>
                            <h3 className=' font-semibold '>{user.displayName}</h3>
                            <span className=' text-xs'>En ligne</span>
                        </div>
                    </div>
                    <p className=' text-xs'>3h</p>
                </div>
                <p className=' text-sm mt-3'>Lorem ipsum dolor sit amet consectetur ....</p>
              </div> : <div></div> 
              }

            <div className=' overflow-y-scroll h-full'>

              {/* <div className=' border-l-4 border-green-400 shadow-lg p-6 cursor-pointer bg-slate-800 text-white mt-3'>
                <div className='flex justify-between'>
                  <div className='flex gap-x-4'>
                    <div>
                      <div className=' p-3 rounded-full border-white border relative before:absolute before:top-[30%] before:left-0 before:h-2 before:w-2 before:translate-y-[-100%] before:z-30 before:rounded-full before:bg-green-400'>
                        <FaUser className='text-lg' />
                      </div>
                    </div>
                    <div>
                      <h3 className=' font-semibold '>Kouame Antonio</h3>
                      <span className=' text-xs'>En ligne</span>
                    </div>
                  </div>
                  <p className=' text-xs'>3h</p>
                </div>
                <p className=' text-sm mt-3'>Lorem ipsum dolor sit amet consectetur ....</p>
              </div> */}

              {Object.entries(chats)?.map((chat) =>{
                return <CartChat  key={chat[0]} item={chat[1]}/>
              })}
            </div>
            
        </div>
    </div>
  )
}

export default ContactBox