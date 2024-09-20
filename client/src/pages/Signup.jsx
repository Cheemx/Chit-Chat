import React, { useState } from 'react'
import {Link, useNavigate} from "react-router-dom"
import axios from "axios"
import {useForm} from "react-hook-form"
import {login} from "../store/authSlice.js"
import Input from "../components/Input.jsx"
import Button from '../components/Button.jsx'

function Signup() {
    const navigate = useNavigate()
    const [error, setError] = useState("")
    const {register, handleSubmit} = useForm()

    const onSubmit = async (data) => {
        try {
            const res = await axios.post(
                "https://chit-chat-mcvb.onrender.com/signup",
                data,
                {
                    headers: {
                        'Content-Type' : 'application/json'
                    }
                }
            )    
            if (res.status === 200) {
                const userData = res.data
                if (userData) {
                    navigate("/login")
                } else {
                    console.error("userData nahi aa rha bhai")
                }
            } else {
                console.error("Signup Failed")
            }
        } catch (error) {
            setError(error.res?.data?.message || "Erm! what an ERROR!")
        }
    }
    

    return (
        <div className='flex items-center justify-center'>
            <div className='mx-auto w-full max-w-lg rounded-xl p-10 border border-blue-800/10 bg-black bg-opacity-40'>
                <h2 className='mt-2 text-center text-2xl font-bold leading-tight text-white'>
                    Sign Up to Chitchat!                    
                </h2>
                <p>
                    Already have an Account?&nbsp;
                    <Link
                        to='/login'
                        className='font-medium text-primary transition-all duration-200 hover:underline'
                    >
                        Sign In
                    </Link>
                </p>  
                {error && <p className='text-red-600 mt-8 text-center'>{error}</p>}    

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='space-y-5'>
                        <Input
                            label = "Name: "
                            placeholder = "Enter your Name"
                            type="text"
                            {...register("fullName",{
                                required: true
                            })}
                        />
                        <Input
                            label = "Email: "
                            placeholder="Enter your email"
                            type="email"
                            {...register("email", {
                                required: true,
                                validate: {
                                    matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                    "Email address must be a valid address",
                                }
                            })}
                        />
                        <Input
                            label="Password: "
                            type="password"
                            placeholder="Enter your password"
                            {...register("password", {
                                required: true
                            })}
                        />
                        <Button type='submit' className='w-fit'>
                            Create Yapper!
                        </Button>
                    </div>
                </form>         
            </div>
        </div>
    )
}

export default Signup