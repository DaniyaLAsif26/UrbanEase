import logo from "../../assets/logo.png"
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"

import { services } from "../../data/services"

import { useLogin } from "../../context/LoginContext";

export default function Navbar() {

    const { isUserLoggedIn, isUserLoaded } = useLogin()

    const [open, setOpen] = useState(false)
    const navigate = useNavigate()

    const handleNav = (path) => {
        setOpen(false);
        navigate(path)
    }

    return (
        <nav className="relative h-[4.26rem] w-full text-black flex items-center justify-between bg-[#f5f5dc] px-5 shadow-[0_10px_25px_rgba(0,0,0,0.25)]"
            onMouseLeave={() => setOpen(false)}
        >
            <div className="flex justify-center items-center font-semibold">
                <a href="/" className=""><img src={logo} className="h-7" /></a>

                <div
                    className="flex justify-center items-center gap-0.5 cursor-pointer ml-12"
                    onMouseEnter={() => setOpen(true)}
                >
                    <div>All Services</div>
                    {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </div>
            </div>

            {open &&
                <div className="absolute left-[12rem] top-full w-[60rem] bg-white z-20 shadow-[0_10px_25px_rgba(0,0,0,0.25)]">
                    <div className=" grid grid-cols-4 px-5 pt-7 gap-x-7 ">
                        {services.map((item, index) =>
                            <div key={index}>
                                <div className="text-red-500 font-semibold mb-5">{item.head}</div>
                                <ul className="font-normal flex flex-col gap-5">
                                    {item.options.map((i, idx) =>

                                        <li className="hover:font-semibold cursor-pointer" onClick={() => handleNav(i.link)} key={idx}>{i.name}</li>

                                    )}
                                </ul>
                            </div>

                        )}
                    </div>
                    <div className="flex justify-center items-center bg-white py-7">
                        <button className="py-2 px-4 bg-red-600 text-white rounded-xl" onClick={() => {
                            setOpen(false);
                            navigate('/services')
                        }}>
                            All Services
                        </button>
                    </div>
                </div>
            }

            <div className="flex justify-center items-center gap-5 mr-7 font-semibold">
                <Link to="/register/provider">
                    <div>Become a Provider</div>
                </Link>
                <div>Help</div>
                {isUserLoggedIn ?
                    <Link to="/profile/user">
                        <div><AccountCircleIcon style={{ fontSize: "2.25rem" }} /></div>
                    </Link>
                    :
                    <Link to="/register/user">
                        <div>Log In</div>
                    </Link>
                }

            </div>
        </nav>
    )
}