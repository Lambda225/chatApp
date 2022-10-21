import React, { useEffect, useState } from 'react'
import {Link, useNavigate} from "react-router-dom"
import { signInWithEmailAndPassword } from "firebase/auth";
import { async } from '@firebase/util';
import { auth } from '../../firebase';

function Sign() {

  const initialValue = {mail:'',password:''}
  const [formValue,setFormValue] = useState(initialValue)
  const [formErrors,setFormErrors] = useState({})
  const [submit,setSubmit] = useState(false)
  const navigate = useNavigate()

  const hundleChange = (e) =>{
    const {name , value} = e.target
    setFormValue({...formValue, [name]:value})
  }

  const sign = async() =>{
    try{
      const res = await signInWithEmailAndPassword(auth, formValue.mail, formValue.password)
      console.log(res);
      navigate('/')
    }catch (error){
      console.log(error);
    }
    
  } 

  const hundelSubmit = (e) =>{
    e.preventDefault()
    setFormErrors(valide(formValue))
    setSubmit(true)
  }

  const valide = (value) =>{
    const error = {}
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i
    if(!value.mail){
      error.mail = 'Veillez remplie ce champ'
    }else if(!regex.test(value.mail)){
      error.mail = "Format de mail incorrecte "
    }
    if(!value.password){
      error.password= 'Veillez remplie ce champ'
    }
    return error
  }

  useEffect(()=>{
    if(Object.keys(formErrors).length == 0 && submit){
      sign()
    }
  },[formErrors])

  return (
    <form onSubmit={hundelSubmit} className=' h-screen flex justify-center items-center bg-slate-50'>
      <div className=' shadow-xl px-6 py-8 min-w-[320px] max-w-[400px] w-[30%] bg-white rounded-lg border-3 border-slate-200'>
        <h1 className='text-center font-bold text-3xl mb-6 text-teal-600 '>Connection</h1>
        <div className=' flex flex-col mb-3'>
          <label htmlFor="mail" className='mb-2 ml-3'>Mail</label>
          <input type="text" value={formValue.mail} onChange={hundleChange} className={`p-3 ${formErrors.mail && 'border border-red-500'} rounded-lg bg-slate-100 focus:outline-none`} name="mail" id="mail" />
          <span className=' text-xs text-red-500'>{formErrors.mail}</span>
        </div>
        <div className=' flex flex-col mb-6'>
          <label htmlFor="Password" className='mb-2 ml-3'>Mots de Passe</label>
          <input type="password" value={formValue.password} onChange={hundleChange} className={`p-3 ${formErrors.password && 'border border-red-500'} rounded-lg bg-slate-100 focus:outline-none`} name="password" id="Password" />
          <span className=' text-xs text-red-500'>{formErrors.password}</span>
        </div>
        <button className='py-3 w-full bg-slate-700 text-white rounded-lg'>Envoyer</button>
        <div className=' text-center mt-2 text-sm text-blue-600 '><Link to='/register' >Creer un compte</Link></div>
      </div>
    </form>
  )
}

export default Sign