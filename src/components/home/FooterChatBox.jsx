import { async } from '@firebase/util'
import { arrayUnion, doc, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore'
import React, { useContext, useState } from 'react'
import {IoIosSend,IoMdAttach} from 'react-icons/io'
import { AuthContext } from '../../context/AuthContext'
import { ChatContext } from '../../context/ChatContext'
import { db, storage } from '../../firebase'
import {v4 as uuid} from 'uuid'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'

function FooterChatBox() {

  const [text,setText] = useState('')
  const [img,setImg] = useState()
  const {currentUser} = useContext(AuthContext)
  const {data} = useContext(ChatContext)

  const hundleSubmit = async (e) =>{
    e.preventDefault()
    if(img){
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on('state_changed',
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        },
          (error) =>{
            console.log('Get image');
          },
          ()=>{
            getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) => {
              await updateDoc(doc(db,"chats",data.chatId),{
                message :arrayUnion({
                  id:uuid(),
                  text,
                  senderId:currentUser.uid,
                  date:Timestamp.now(),
                  img:downloadURL
                })
              })
            });
          }
      )
    }else{
      await updateDoc(doc(db,"chats",data.chatId),{
        message :arrayUnion({
          id:uuid(),
          text,
          senderId:currentUser.uid,
          date:Timestamp.now()
        })
      })

      await updateDoc(doc(db,"userChats",data.user.uid),{
        [data.chatId +".lastmessage"]:{
          text,
        },
        [data.chatId + ".date"]:serverTimestamp()
      })
      await updateDoc(doc(db,"userChats",currentUser.uid),{
        [data.chatId +".lastmessage"]:{
          text,
        },
        [data.chatId + ".date"]:serverTimestamp()
      })
    }

    setImg(null)
    setText('')
  }

  return (
    <div>
        <form onSubmit={hundleSubmit} action="" className='flex items-center justify-center py-4 gap-x-3'>
            <div className='flex items-center bg-slate-200 w-4/6 px-3 overflow-hidden rounded-full'>
                <input type="file" className=' hidden' name="" id="files" onChange={e => setImg(e.target.files[0])} />
                <label htmlFor="files" className='text-xl cursor-pointer'><IoMdAttach /></label>
                <input value={text} type="text" className=' focus:outline-none bg-transparent p-3 w-full' onChange={e => setText(e.target.value)} placeholder='Message'/>
            </div>
            <button className='text-xl p-3 rounded-full bg-teal-700 text-white'><IoIosSend /></button>
        </form>
    </div>
  )
}

export default FooterChatBox