import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import { Link } from 'react-router-dom'

export default function CatOptions({ data }) {

    return (
        <Link to={data.link}>
        <div className="min-h-[14.6rem] bg-white w-[16.8rem] flex justify-start items-center flex-col shadow-[0_10px_25px_rgba(0,0,0,0.25)] cursor-pointer rounded-md transition-transform duration-300 hover:scale-[1.03]" key={data.name}>
            <img src={data.img} alt={data.name} className="h-[10.5rem] w-full object-cover rounded-t-md" />
            <div className="flex justify-center items-center gap-1.5 ">
                <div className="py-4  ">{data.name}
                </div>
                <ArrowForwardIosIcon style={{ fontSize: 12 }} />
            </div>
        </div>
        </Link>
    )
}