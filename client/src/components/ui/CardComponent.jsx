import { Link } from 'react-router-dom'
import { assets } from '../../assets/assets';
import { formatPriceIDR } from '../../helper/amount';

const CardComponent = ({ vehicle }) => {

    // const navigate = useNavigate()

    return (
        <div className='group rounded-xl overflow-hidden shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer min-w-[350px]'>
            <Link to={`/detail-product/${vehicle._id}`}>

                <div className='relative h-48 overflow-hidden'>
                    <img src={vehicle.image} alt="vehicle image" className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105' />

                    {vehicle.isAvaliable && <p className='absolute top-4 left-4 bg-tombol text-white text-xs px-2.5 py-1 rounded-full'>Tersedia Sekarang</p>}

                    <div className='absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm text-white px-3 py-2 rounded-lg'>
                        <span className='text-sm font-semibold'>{formatPriceIDR(vehicle.pricePerDay)}</span>
                        <span className='text-sm text-white/80'> / hari</span>
                    </div>
                </div>

                <div className='p-4 sm:p-5'>
                    <div className=''>
                        <div>
                            <h3 className='text-lg font-medim'>{vehicle.brand} {vehicle.model}</h3>
                            <p className='text-sm text-muted-foreground'>{vehicle.category} • {vehicle.year}</p>
                        </div>
                    </div>

                    <div className='mt-4 grid grid-cols-2 gap-y-2 text-gray-600'>
                        <div className='flex items-center text-sm text-mted-foregraound'>
                            <img src={assets.users_icon} alt="" className='mr-2 h-2' />
                            <span>{vehicle.seating_capacity} Seats</span>
                        </div>

                        <div className='flex items-center text-sm text-mted-foregraound'>
                            <img src={assets.fuel_icon} alt="" className='mr-2 h-2' />
                            <span>{vehicle.fuel_type}</span>
                        </div>

                        <div className='flex items-center text-sm text-mted-foregraound'>
                            <img src={assets.car_icon} alt="" className='mr-2 h-2' />
                            <span>{vehicle.transmission}</span>
                        </div>

                        <div className='flex items-center text-sm text-mted-foregraound'>
                            <img src={assets.location_icon} alt="" className='mr-2 h-2.5' />
                            <span>{vehicle.location}</span>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default CardComponent
