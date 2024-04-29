import React from "react";
import User from "./User";
import { SearchedUser } from "@repo/types/User";
interface DisplayProps {
    users: SearchedUser[];
}
const Display: React.FC<DisplayProps> = (props) => {
    const { users } = props;
    return <div>
        {users.map((user) => <User key={user.id} user={user} />)}
    </div>
}
export default Display;