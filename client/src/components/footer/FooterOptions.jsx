import { Link } from 'react-router-dom'

export default function FooterOptions({ data }) {
    return (
        <div className="px-7">
            <h4 className="font-semibold text-[1.5rem] mb-5">
                {data.head}
            </h4>
            <ul className="flex flex-col gap-3 pl-3">
                {data.nav.map((i, key) =>
                    <Link to={i.link}>
                        <li className={i.link && 'text-red-500 font-semibold'}>{i.name}</li>
                    </Link>
                )}
            </ul>
        </div>
    )
}