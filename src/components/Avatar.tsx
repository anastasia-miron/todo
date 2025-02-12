import { clsx } from "clsx";
import { UserModel } from "../typings/models";
import "./Avatar.css"

interface Props {
    user: UserModel;
    className?: string;
}

const Avatar: React.FC<Props> = (props) => {
    const {user, className} = props;
    return (
        <div className={clsx('avatar', className)}>
            {user.profile_img 
            ? (<img className="avatar__image" alt={user.username} src={user.profile_img} />) 
            : (<div className="avatar__initials">{user.username.substring(0, 2) || 'NA'}</div>)}
        </div>
    );
};

export default Avatar;