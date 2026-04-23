import CatOptions from "./CatOptions"
import WhyUs from '../WhyUs/WhyUs'

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import { services } from "../../data/services"

const cleaning = services.find(item => item.head === "Cleaning & Household")?.options

const home = services.find(item => item.head === "Home Maintenance")?.options.slice(0, 4)

export default function Categories() {
    return (
        <div className="pt-12">
            <div className="px-20 pb-16">
                <div className="flex flex-row justify-between items-center">

                <div className="pb-7 flex flex-col gap-2">
                    <h2 className="text-2xl font-semibold ">Cleaning & Household</h2>
                    <p className="">Instantly book highly rated pros for cleaning and handyman tasks at an upfront price.</p>
                </div>
                    <a href="/services" className=" flex items-center justify-center gap-1.5 text-blue-500 hover:text-blue-700">See All <ArrowForwardIosIcon style={{ fontSize: 12 }} /></a>
                </div>
                <div className="grid grid-cols-4 items-center justify-items-center gap-y-10 ">
                    {cleaning.map((cat) =>
                        <CatOptions data={cat} />
                    )}
                </div>
            </div>

            <WhyUs />

            <div className="py-16 px-20">
                <div className="flex justify-between items-center">
                <div className="pb-7 flex flex-col gap-2">
                    <h2 className="text-2xl font-semibold ">Home Maintenance</h2>
                    <p className="">Get free quotes from top local home improvement pros on larger home projects.</p>
                </div>
                <a href="/services" className=" flex items-center justify-center gap-1.5 text-blue-500 hover:text-blue-700">See All <ArrowForwardIosIcon style={{ fontSize: 12 }} /></a>
                </div>
                <div className="grid grid-cols-4 items-center justify-items-center gap-y-10 ">
                    {home.map((cat) =>
                        <CatOptions data={cat} />
                    )}
                </div>
            </div>
        </div>
    )
}