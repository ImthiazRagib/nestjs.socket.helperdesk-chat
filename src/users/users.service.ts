import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Users } from './entity/users.entity';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class UsersService {

    constructor(
        @InjectModel(Users)
        private readonly userRepository: typeof Users,
    ) { }

    async createUser(userData: { userName: string; email: string, password: string }): Promise<Users> {
        const user = await this.userRepository.create({
            ...userData as any
        });

        return await this.getUserByIdentifier(user.id);
    }

    async getUserByIdentifier(identifier: string | number) {
        // TODO: implement actual lookup logic
        let where: any = {}

        if (typeof identifier === 'string') {
            where.userName = identifier
        }

        if (typeof identifier === 'number') {
            where.id = identifier
        }

        const user = await this.userRepository.findOne({
            where,
            raw:true,
            nest: true
        });


        if (!user) {
            throw new HttpException('User with the identifier not found.', HttpStatus.NOT_FOUND)
        }

        return user;
    }
}
