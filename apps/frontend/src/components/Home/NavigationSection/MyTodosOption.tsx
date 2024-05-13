import React from "react";
import { MdOutlineEditNote } from "react-icons/md";
import { useNavigate } from "react-router-dom";
const MyTodosOption: React.FC = () => {
    const navigate = useNavigate();
    return <div className="flex justify-center items-center gap-2 lg:h-[4rem] lg:w-full size-12 lg:p-2 p-1 lg:hover:border-none hover:border-2 hover:border-gray-600 lg:rounded-md rounded-full cursor-pointer bg-zinc-500/40 aspect-square" onClick={() => navigate("/home/mytodos")}>
        <MdOutlineEditNote className="size-9" />
        <p className="lg:block hidden">My Todos</p>
    </div>;
};
export default MyTodosOption;