import hero_img from '../assets/hero-img.png'


export default function HeroSection() {
    return (
        <div className="h-[21rem] w-full bg-black">
            <img src={hero_img} className='w-full h-full opacity-45' />
        </div>
    )
}