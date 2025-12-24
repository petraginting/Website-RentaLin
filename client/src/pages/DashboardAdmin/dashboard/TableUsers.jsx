import {
    MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { PencilIcon } from "@heroicons/react/24/solid";
import {
    Avatar,
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Chip,
    IconButton,
    Input,
    Tab,
    Tabs,
    TabsHeader,
    Tooltip,
    Typography
} from "@material-tailwind/react"
import { useState } from "react";

const TableUsers = ({ feature, header, datas }) => {

    const [pick, setPick] = useState('all')

    return (
        <Card className="mt-6 w-full bg-white shadow-2xl/4">
            <CardHeader floated={false} shadow={false} className="rounded-none px-5">
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    <Tabs value={pick} className="w-full md:w-max">
                        <TabsHeader className="gap-3">
                            {feature.map(({ label, value }) => (
                                <Tab
                                    key={value}
                                    value={value}
                                    onClick={() => setPick(value)}
                                    className={`px-5 py-2 rounded-lg transition-all duration-100 ease-in-out ${pick === value ? "bg-blue-500 text-white" : ""}`}
                                >
                                    {label}
                                </Tab>
                            ))}
                        </TabsHeader>
                    </Tabs>
                    <div className="w-full md:w-80 flex border border-borderColor items-center ps-2 pe-4 rounded-lg">
                        <Input
                            label="Search"
                            placeholder="Cari"
                            className="outline-none border-none"
                            size="md"
                        />
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
                    </div>
                </div>
            </CardHeader>
            <CardBody className="px-5">
                <table className="mt-4 w-full min-w-max table-auto text-left">
                    <thead>
                        <tr>
                            {header.map((head) => (
                                <th
                                    key={head}
                                    className="cursor-pointer border-y border-gray-300 bg-gray-50/50 p-4 transition-colors hover:bg-gray-100 "
                                >
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                                    >
                                        {head}
                                    </Typography>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {datas.map(
                            ({ img, name, email, job, org, online, date }, index) => {
                                const isLast = index === datas.length - 1;
                                const classes = isLast
                                    ? "p-4"
                                    : "p-4 border-b border-gray-200";

                                return (
                                    <tr key={index}>
                                        <td className={classes}>
                                            <div className="flex items-center gap-3">
                                                <Avatar src={img} alt={name} size="sm" />
                                                <div className="flex flex-col">
                                                    <Typography
                                                        variant="small"
                                                        color="gray"
                                                        className="font-normal"
                                                    >
                                                        {name}
                                                    </Typography>
                                                    <Typography
                                                        variant="small"
                                                        color="gray"
                                                        className="font-normal opacity-70"
                                                    >
                                                        {email}
                                                    </Typography>
                                                </div>
                                            </div>
                                        </td>
                                        <td className={classes}>
                                            <div className="flex flex-col">
                                                <Typography
                                                    variant="small"
                                                    color="gray"
                                                    className="font-normal"
                                                >
                                                    {job}
                                                </Typography>
                                                <Typography
                                                    variant="small"
                                                    color="gray"
                                                    className="font-normal opacity-70"
                                                >
                                                    {org}
                                                </Typography>
                                            </div>
                                        </td>
                                        <td className={classes}>
                                            <div className="w-max ">
                                                <Chip
                                                    variant="ghost"
                                                    size="sm"
                                                    value={online ? "online" : "offline"}
                                                    className={`${online ? "bg-green-100 text-green-400" : "bg-gray-100 text-gray-500"} px-3 font-semibold lowercase`}
                                                />
                                            </div>
                                        </td>
                                        <td className={classes}>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal text-gray-500"
                                            >
                                                {date}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <Tooltip content="Edit User">
                                                <IconButton variant="text" className="flex justify-center items-center">
                                                    <PencilIcon className="h-4 w-4" />
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
            <CardFooter className="flex items-center justify-between border-t border-gray-400 p-4 mx-5">
                <Typography variant="small" color="blue-gray" className="font-normal text-gray-500">
                    Page 1 of 10
                </Typography>
                <div className="flex gap-2">
                    <Button variant="outlined" size="sm" className="border-none font-medium text-sm text-gray-500 ">
                        Sebelumnya
                    </Button>
                    <Button variant="outlined" size="sm" className="border-none font-medium text-sm bg-primary text-white hover:bg-blue-700">
                        Selanjutnya
                    </Button>
                </div>
            </CardFooter>
        </Card >
    )
}

export default TableUsers
