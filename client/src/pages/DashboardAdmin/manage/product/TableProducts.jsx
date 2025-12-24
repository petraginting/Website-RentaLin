import {
    ChevronUpDownIcon,
} from "@heroicons/react/24/outline";
import { EyeIcon, EyeSlashIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import {
    Avatar,
    Card,
    CardBody,
    Chip,
    IconButton,
    Tooltip,
    Typography
} from "@material-tailwind/react"
import { formatPriceIDR } from "../../../../helper/amount";
import { useNavigate } from "react-router-dom";

const TableProducts = ({ header, datas, deleteProduct, toggleAvailability }) => {
    const navigate = useNavigate()

    return (
        <Card className="my-6 w-full bg-white shadow-2xl/4">
            <CardBody className="px-5">
                <table className="mt-4 w-full min-w-max table-auto text-left">
                    <thead>
                        <tr>
                            {header.map((head, index) => (
                                <th
                                    key={index}
                                    className={`${head === "Kategori" || head === "Status" ? "max-md:hidden" : ""} cursor-pointer border-y border-gray-300 bg-gray-50/50 p-4 transition-colors hover:bg-gray-100`}
                                >
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                                    >
                                        {head}{" "}
                                        {index !== header.length - 1 && (
                                            <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />
                                        )}
                                    </Typography>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {datas.map(
                            (data, index) => {
                                const isLast = index === datas.length - 1;
                                const classes = isLast
                                    ? "p-4"
                                    : "p-4 border-b border-gray-200";

                                return (
                                    <tr key={data._id} className="hover:bg-gray-50">
                                        <td className={classes}>
                                            <div className="flex items-center gap-3">
                                                <Avatar src={data.image} alt={data.brand} size="sm" />
                                                <div className="flex flex-col">
                                                    <Typography
                                                        variant="small"
                                                        color="gray"
                                                        className="font-normal"
                                                    >
                                                        {data.brand} {data.model}
                                                    </Typography>
                                                    <Typography
                                                        variant="small"
                                                        color="gray"
                                                        className="font-normal opacity-70"
                                                    >
                                                        {data.seating_capacity} • {data.transmission}
                                                    </Typography>
                                                </div>
                                            </div>
                                        </td>
                                        <td className={`${classes} max-md:hidden`}>
                                            <div className="flex flex-col">
                                                <Typography
                                                    variant="small"
                                                    color="gray"
                                                    className="font-normal"
                                                >
                                                    {data.category}
                                                </Typography>
                                            </div>
                                        </td>
                                        <td className={classes}>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal text-gray-500"
                                            >
                                                {formatPriceIDR(data.pricePerDay)}
                                            </Typography>
                                        </td>
                                        <td className={`${classes} max-md:hidden`}>
                                            <div className="w-max ">
                                                <Chip
                                                    variant="ghost"
                                                    size="sm"
                                                    value={data.isAvaliable ? "Avaliable" : "Unavaliable"}
                                                    className={`${data.isAvaliable ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"} px-3 py-1 rounded-full text-xs lowercase font-medium`}
                                                />
                                            </div>
                                        </td>
                                        <td className={`${classes} flex gap-3`} >
                                            <IconButton variant="text" className={`${data.isAvaliable ? "bg-[#3085d6]" : "bg-[#d33]"} flex justify-center items-center`} onClick={() => toggleAvailability(data._id)}>

                                                {data.isAvaliable ? <EyeSlashIcon className="h-4 w-4 text-white" />
                                                    :
                                                    <EyeIcon className="h-4 w-4 text-white" />}

                                            </IconButton>
                                            <Tooltip content="Edit kendaraan">
                                                <IconButton variant="text" className="flex justify-center items-center bg-[#3085d6] " onClick={() => navigate('/owner/edit-product/' + data._id)}>
                                                    <PencilIcon className="h-4 w-4 text-white" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip content="Hapus kendaraan">
                                                <IconButton variant="text" className="flex justify-center items-center bg-[#d33] " onClick={() => deleteProduct(data._id)}>
                                                    <TrashIcon className="h-4 w-4 text-white" />
                                                </IconButton>
                                            </Tooltip>
                                        </td>
                                    </tr>
                                );
                            },
                        )}
                    </tbody>
                </table>
            </CardBody>
        </Card >
    )
}

export default TableProducts
