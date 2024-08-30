import React from 'react'
import { Link,useNavigate } from "react-router-dom"
import { useSelector } from 'react-redux'
import Button from "./Button.jsx"
import LogoutBtn from './LogoutBtn.jsx'

function Header() {
    const authStatus = useSelector((state) => state.auth.status)
    const navigate = useNavigate()

    const navItems = [
        {
            name:"Home",
            slug:"/",
            active: true
        },
        {
            name:"Signup",
            slug:"/signup",
            active : !authStatus
        },
        {
            name:"Login",
            slug:"/login",
            active : !authStatus
        }
    ]
    return (
        <header className='container mx-auto px-1 py-3 w-full shadow bg-black bg-opacity-80'>
            <nav className='flex flex-wrap items-center justify-between'>
                <div>
                    <Link to="/">
                        Link
                    </Link>
                </div>
                <ul className='flex items-center ml-auto space-x-1'>
                    {navItems.map((item) => item.active ? (
                        <li key={item.name}>
                            <Button onClick={() => navigate(item.slug)}>
                                {item.name}
                            </Button>
                        </li>
                    ) : null
                    )}
                    {authStatus && (
                        <li>
                            <LogoutBtn />
                        </li>
                    )}
                </ul>
            </nav>
        </header>
    )
}

export default Header