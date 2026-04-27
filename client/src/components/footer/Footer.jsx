import logo from '../../assets/logo.png'
import FooterOptions from './FooterOptions'

const links = [
    {
        head: 'Popular Services', nav: [
            {
                name: "House cleaning", link: ''
            },
            {
                name: "Laundry & ironing", link: ''
            },
            {
                name: "Plumbing", link: ''
            },
            {
                name: "Electric Work", link: ''
            },
            {
                name: "Personal Fitness Training", link: ''
            },
            {
                name: "Painting & Wall Finishing", link: ''
            },
        ]
    },
    {
        head: 'Quick Links', nav: [
            {
                name: "About", link: ''
            },
            {
                name: "Blog", link: ''
            },
            {
                name: "Helo", link: ''
            },
            {
                name: "Contact Us", link: ''
            },
            {
                name: "Become a Provider", link: ''
            },
            {
                name: "Admin", link: '/admin/login'
            },
        ]
    },
]


export default function Footer() {
    return (
        <div className="bg-white text-black grid grid-cols-[1.25fr_1fr_1fr] py-16 px-16 justify-items-center">
            <div className="px-7">
                <img src={logo} className='h-9 mb-5' />
                <p className='max-w-[25rem]'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque sunt deleniti consequatur in qui harum id officiis maxime? Illum deserunt voluptate sit placeat ipsam quas quo doloremque, debitis sequi aut animi sed ipsum iste eveniet quis.</p>
            </div>
            {links.map((l, index) =>
                <FooterOptions key={index} data={l} />
            )}
        </div>
    )
}