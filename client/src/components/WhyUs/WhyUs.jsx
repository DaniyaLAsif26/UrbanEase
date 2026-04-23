import Counter from "./Counter"

const counter =[
    {num :'500+' , head :'Verified Service Providers'},
    {num :'8,000+' , head :'Happy Customers'},
    {num :'4.8★' , head :'Average Rating'},
    {num :'10,000+' , head :'Services Completed'},
]

export default function WhyUs() {
    return (
        <div className="bg-gray-700 text-white grid grid-cols-[1.25fr_1fr] px-12 py-[3.5rem] justify-start  ">
            <div className="flex flex-col justify-center items-start gap-5">
                <h2 className="font-semibold text-3xl">Your Happiness, Guaranteed</h2>
                <p className="text-[1rem] text-gray-100 font-light">We make finding trusted home service professionals simple, fast, and reliable. From repairs to personal care, connect with verified experts, enjoy hassle-free booking, and get quality service at your doorstep—all in one platform.</p>
            </div>
            <div className="grid grid-cols-2 gap-y-12 justify-items-end">
                {counter.map((i,index)=>
                <Counter key={index} data={i} />
                )}
            </div>
        </div>
    )
}