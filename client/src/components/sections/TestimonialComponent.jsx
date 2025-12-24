import React from 'react'
import TitleComponent from '../ui/TitleComponent';

const TestimonialComponent = () => {

    const testimoni = [
        {
            image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200',
            name: 'Briar Martin',
            location: 'Purwokerto, Grendeng',
            date: 'April 20, 2025',
            rating: 4,
            comment: 'Radiant made undercutting all of our competitors an absolute Lorem ipsum dolor sit, amet consectetur adipisicing elit. Perferendis minus vero, nulla rerum praesentium obcaecati cumque? breeze.'
        },
        {
            image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200',
            name: 'Avery Johnson',
            location: 'Purwokerto, Teluk',
            date: 'May 10, 2025',
            rating: 4,
            comment: 'Radiant made undercutting all of our competitors an absolute Lorem ipsum dolor praesentium obcaecati cumque? breeze.'
        },
        {
            image: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&auto=format&fit=crop&q=60',
            name: 'Jordan Lee',
            location: 'Purwokerto, Purwanegara',
            date: 'June 5, 2025',
            rating: 5,
            comment: 'Radiant made - adipisicing elit. Perferendis minus vero, nulla rerum praesentium obcaecati cumque? breeze.'
        },
        {
            image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=60',
            name: 'Avery Johnson',
            location: 'Purwokerto, Sokanegara',
            date: 'May 10, 2025',
            rating: 3,
            comment: 'Our competitors an absolute Lorem ipsum dolor sit, amet consectetur adipisicing elit. Perferendis Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ipsa molestiae tempora, illo eligendi ducimus ipsum nihil repellat deleniti? Lorem ipsum dolor sit, amet consectetur adipisicing elit. '
        },
    ];

    const Star = ({ filled }) => (
        <svg className="w-4 h-4 text-yellow-400" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 17.25l-6.16 3.73 1.64-7.03L2.5 9.77l7.19-.61L12 2.5l2.31 6.66 7.19.61-5 4.18 1.64 7.03z" />
        </svg>
    );

    const CreateCard = ({ testimoni }) => (
        <div className="p-3 rounded-lg mx-4 shadow hover:shadow-lg transition-all duration-200 w-100 shrink-0">
            <div className="flex gap-2">
                <img className="size-11 rounded-full" src={testimoni.image} alt="User Image" />
                <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                        <p>{testimoni.name}</p>
                    </div>
                    <span className="text-xs text-slate-500">{testimoni.location}</span>
                </div>
            </div>
            <div className='flex items-center gap-1 mt-4'>
                {Array(5).fill(0).map((_, index) => (
                    <Star key={index} filled={testimoni.rating > index} />
                ))}
            </div>
            <p className="text-sm py-4 text-gray-800 max-h-50 overflow-auto scrollbar-hide">{testimoni.comment}</p>
            <div className="flex items-center text-slate-500 text-xs gap-1">
                <div className="flex items-center gap-1">
                    <span>Posted on</span>
                </div>
                <p>{testimoni.date}</p>
            </div>
        </div>
    );
    return (
        <>
            <style>{`
            @keyframes marqueeScroll {
                0% { transform: translateX(0%); }
                100% { transform: translateX(-50%); }
            }

            .marquee-inner {
                animation: marqueeScroll 25s linear infinite;
            }

            .marquee-reverse {
                animation-direction: reverse;
            }
        `}</style>

            <div className="mt-30 px-6 marquee-row w-full mx-auto max-w-7xl overflow-hidden relative">

                <TitleComponent title='Testimonial Pelanggan' subTitle='Dengarkan pendapat pengguna kami tentang kami. Kami selalu mencari cara untuk meningkatkan layanan. Jika Anda memiliki pengalaman positif dengan kami, silakan tinggalkan ulasan.' />

                <div className="absolute left-0 bottom-0 h-80 w-20 md:w-15 z-10 pointer-events-none bg-gradient-to-r from-white to-transparen"></div>
                <div className="marquee-inner flex transform-gpu min-w-[200%] pt-18 pb-5">
                    {[...testimoni, ...testimoni].map((item, index) => (
                        <CreateCard key={index} testimoni={item} />
                    ))}
                </div>
                <div className="absolute right-0 bottom-0 h-80 w-20 md:w-15 z-10 pointer-events-none bg-gradient-to-l from-white to-transparent"></div>
            </div>
        </>
    )
}

export default TestimonialComponent
