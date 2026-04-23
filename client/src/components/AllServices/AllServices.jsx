import allservices from '../../assets/allservices.webp'
import CatOptions from '../categories/CatOptions.jsx'

import { services } from '../../data/services.js'

export default function AllServices() {
    return (
        <div className="">
            <div className="relative h-[17rem] w-full bg-black">
                <img src={allservices} alt="" className="absolute h-full w-full opacity-50" />
                <h2 className="absolute inset-0 flex items-center justify-center text-white text-[3rem] font-bold">
                    Services we offer
                </h2>
            </div>
            <div className="py-12 px-[7rem]">
                {services.map((service, index) =>
                    <div className="">
                        <h3 className="text-[2.25rem] mb-5 font-normal" >{service.head}</h3>
                        <div className="flex flex-row flex-wrap items-center justify-between gap-10 mb-20 ">

                            {service.options.map((cat) =>
                                <CatOptions data={cat} />
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}