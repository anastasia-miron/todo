import { UserModel, UserTypeEnum } from "./typings/models";

export const user: UserModel = {
    id: '1',
    username: 'username',
    email: 'username@email.com',
    profile_img: 'https://thispersondoesnotexist.com/',
    phone: '079123456',
    type: UserTypeEnum.VOLUNTEER
}