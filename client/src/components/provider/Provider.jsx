import provider from '../../assets/service.webp'
import {useNavigate} from 'react-router-dom'

export default function Provider() {

const navigate = useNavigate()

    return (
        <div className="grid grid-cols-[1.25fr_1fr] gap-10 px-[7rem] py-20 justify-items-center items-center bg-black text-white">
            <div className="">
                <h2 className="text-[2.5rem] font-semibold mb-5">Are You a Service Provider</h2>
                <p className="text-[1.05rem] mb-5 text-gray-200 font-light">
                    Are you a skilled service provider looking to grow your business? Join our platform and connect with customers who are actively searching for your expertise. Whether you specialize in home services, personal care, or professional assistance, we help you showcase your skills to the right audience. Easily manage your bookings, set your availability, and track your earnings—all from one place. Build trust through ratings and reviews, expand your reach, and focus on what you do best while we handle the rest.
                </p>
                <button className="w-[13rem] bg-red-600 text-white px-5 py-2 text-[1.1rem] rounded-xl" onClick={()=> navigate('/register/provider')}>Join Us</button>
            </div>
            <div className="">
                <img src={provider} alt="" className="h-50 w-[90%] rounded-3xl" />
            </div>
        </div>
    )
}