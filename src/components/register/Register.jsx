import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import WrapperRegister from './WrapperRegister'
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore"; 
import { auth,storage,db } from '../../firebase';
import  {IoIosAdd} from "react-icons/io"

function Register() {

    const initialValue = {image:'',userName:'',mail:'',password:'',confPass:''}
    const [formValues,setFormValues] = useState(initialValue)
    const [formErrors,setFormErrors] = useState({})
    const [submit,setSubmit] = useState(false)
    const navigate = useNavigate()

    const hundleChange = (e) =>{
        const {name, value} = e.target
        if(name +'' === 'image'){
            setFormValues({...formValues,[name]:e.target.files[0]})
        }else{
            setFormValues({...formValues,[name]:value})
        }
        
    }

    
    const register = async() =>{
        try{
            console.log(formValues)

            // Signed in
            const userCredential = await createUserWithEmailAndPassword(auth, formValues.mail, formValues.password)

            //Upload image
            const storageRef = ref(storage, formValues.userName);
            const uploadTask = uploadBytesResumable(storageRef, formValues.image);

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

                        //Update user
                        await updateProfile(userCredential.user,{
                            uid:userCredential.user.uid,
                            photoURL:downloadURL,
                            displayName:formValues.userName
                        })

                        // Create user occurente
                        await setDoc(doc(db, "users", userCredential.user.uid), {
                            displayName: formValues.userName,
                            photoURL: downloadURL,
                            mail: formValues.mail,
                            uid: userCredential.user.uid
                        })

                        // Create chat box
                        await setDoc(doc(db, "userChats", userCredential.user.uid), {})

                        console.log('Succès');
                        navigate('/')
                    });
                }
            )
        }catch (error) {
            console.log(error);
        }
             
    } 


    const hundluSubmit = (e) =>{
        e.preventDefault()
        setFormErrors(validate(formValues))
        setSubmit(true)
    }

    const validate = (value) =>{
        const errors = {}
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i
        if(!value.image){
            errors.image = 'Veillez choisir un photo'
        }
        if(!value.userName){
            errors.userName = 'Veiller remplir ce champ'
        }
        if(!value.mail){
            errors.mail = 'Veiller remplir ce champ'
        }else if(!regex.test(value.mail)){
            errors.mail = 'Format de mail incorrect'
        }
        if(!value.password){
            errors.password = 'Veillez remplir ce champ'
        }else if(value.password.length < 5){
            errors.password = 'Entrer une chaine supérieur a 5 caractères'
        }
        if(!value.confPass){
            errors.confPass = 'Veillez remplir ce champ'
        }else if(value.password !== value.confPass){
            errors.confPass = 'Valeur differente de Mots de passe'
        }
        return errors
    }

    useEffect(()=>{
        if(Object.keys(formErrors).length === 0 && submit){
            register()
        }
    },[formErrors])

  return (
    <div className=' bg-slate-50 h-screen flex justify-center items-center'>
        <WrapperRegister>
            <form onSubmit={hundluSubmit}>
                <h1 className='text-center font-bold text-3xl mb-6 text-teal-600 '>Inscription</h1>
                <div>
                    <label htmlFor="image" className=' flex justify-center rounded-lg mb-3 cursor-pointer '>
                        <div className={` relative ${formErrors.image && 'border border-red-500'} h-16 w-16 rounded-full bg-slate-800 border border-slate-700`}>
                            {formValues.image && <img src={URL.createObjectURL(formValues.image)} className="w-full h-full object-cover rounded-full" alt="" /> }
                            <div className=' absolute bottom-[-15%] bg-slate-400 rounded-full right-0 p-1 border-2'><IoIosAdd className=' text-white' /></div>
                        </div>
                    </label>
                    <input type="file" name="image" onChange={hundleChange} id="image" className=' hidden' />
                    <p className=' text-xs text-center text-red-500'>{formErrors.image}</p>
                </div>
                <div className=' flex gap-x-3'>
                    <div className=' flex flex-col mb-3 w-full'>
                        <label htmlFor="username" className='mb-2 ml-3'>Nom D'utilisateur</label>
                        <input type="text" onChange={hundleChange} className={`p-3 ${formErrors.userName && 'border border-red-500'} rounded-lg bg-slate-100 focus:outline-none`} name="userName" id="username" />
                        <span className=' text-xs text-red-500'>{formErrors.userName}</span>
                    </div>
                    <div className=' flex flex-col mb-3 w-full'>
                        <label htmlFor="mail" className='mb-2 ml-3'>Mail</label>
                        <input type="text" onChange={hundleChange} className={`p-3 ${formErrors.mail && 'border border-red-500'} rounded-lg bg-slate-100 focus:outline-none`} name="mail" id="mail" />
                        <span className=' text-xs text-red-500'>{formErrors.mail}</span>
                    </div>
                </div>
                
                <div className=' flex flex-col mb-6'>
                    <label htmlFor="password" className='mb-2 ml-3'>Mots de Passe</label>
                    <input type="password" onChange={hundleChange} className={`p-3 ${formErrors.password && 'border border-red-500'} rounded-lg bg-slate-100 focus:outline-none`} name="password" id="password" />
                    <span className=' text-xs text-red-500'>{formErrors.password}</span>
                </div>
                <div className=' flex flex-col mb-3'>
                    <label htmlFor="confPass" className='mb-2 ml-3'> Confirmer Mots de Passe</label>
                    <input type="password" onChange={hundleChange} className={`p-3 ${formErrors.confPass && 'border border-red-500'} rounded-lg bg-slate-100 focus:outline-none`} name="confPass" id="confPass" />
                    <span className=' text-xs text-red-500'>{formErrors.confPass}</span>
                </div>
                
                <button className='py-3 w-full bg-slate-700 text-white rounded-lg'>Envoyer</button>
                <div className=' text-center mt-2 text-sm text-blue-600 '><Link to='/sign' >Se connecter</Link></div>
            </form>
        </WrapperRegister>
    </div>
  )
}

export default Register