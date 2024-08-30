import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from "axios"
import {Provider} from "react-redux"
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import App from './App.jsx'
import './index.css'
import store from "./store/store.js"
import Home from './pages/Home.jsx'
import Signup from './pages/Signup.jsx'
import Protected from "./context/Protected.jsx"
import Login from "./pages/Login.jsx"

axios.defaults.withCredentials = true;

const router = createBrowserRouter([
    {
        path:"/",
        element: <App />,
        children:[
            {
                path:"/",
                element: <Home />
            },
            {
                path:"/signup",
                element:(
                <Protected authentication = {false}>
                    <Signup />
                </Protected>
                )
            },
            {
                path:"/login",
                element:(
                <Protected authentication = {false}>
                    <Login />
                </Protected>
                )
            },
        ]
    }
])

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Provider store={store}>
          <RouterProvider router={router}/>
        </Provider>
    </StrictMode>,
)
