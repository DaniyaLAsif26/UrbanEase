export default function Counter({ data }) {
    return (
        <div className="flex flex-col  gap-2 justify-center items-start min-w-[12rem] relative">
            <div className="absolute top-0 left-0 w-1/2 h-px bg-white "></div>
            <div className="font-semibold text-4xl pt-1">{data.num}</div>
            <p className="">{data.head}</p>

        </div>
    )
}