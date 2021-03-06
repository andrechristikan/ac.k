import {
    Controller,
    Post,
    Body,
    HttpCode,
    HttpStatus,
    BadRequestException
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { ILogin } from 'src/auth/auth.interface';
import { UserService } from 'src/user/user.service';
import { ResponseService } from 'src/response/response.service';
import { Response, ResponseJson } from 'src/response/response.decorator';
import { IResponse } from 'src/response/response.interface';
import { ConfigService } from '@nestjs/config';
import { UserDocumentFull } from 'src/user/user.interface';
import { Message } from 'src/message/message.decorator';
import { MessageService } from 'src/message/message.service';
import { Logger as LoggerService } from 'winston';
import { Logger } from 'src/logger/logger.decorator';
import { PermissionEntity } from 'src/permission/permission.schema';
@Controller('/auth')
export class AuthController {
    constructor(
        @Response() private readonly responseService: ResponseService,
        @Message() private readonly messageService: MessageService,
        @Logger() private readonly logger: LoggerService,
        private readonly authService: AuthService,
        private readonly userService: UserService,
        private readonly configService: ConfigService
    ) {}

    @HttpCode(HttpStatus.OK)
    @ResponseJson()
    @Post('/login')
    async login(@Body() data: ILogin): Promise<IResponse> {
        const user: UserDocumentFull = await this.userService.findOne<UserDocumentFull>(
            {
                email:
                    data[this.configService.get<string>('auth.defaultUsername')]
            },
            true
        );

        if (!user) {
            this.logger.error('Authorized error user not found', {
                class: 'AuthController',
                function: 'login'
            });

            throw new BadRequestException(
                this.responseService.error(
                    this.messageService.get('auth.login.emailNotFound')
                )
            );
        }

        const validate: boolean = await this.authService.validateUser(
            data.password,
            user.password
        );

        if (!validate) {
            this.logger.error('Authorized error', {
                class: 'AuthController',
                function: 'login'
            });

            throw new BadRequestException(
                this.responseService.error(
                    this.messageService.get('auth.login.passwordNotMatch')
                )
            );
        }

        const { _id, email, firstName, lastName, role } = user;

        const accessToken: string = await this.authService.createAccessToken({
            _id,
            email,
            firstName,
            lastName,
            role: user.role.name
        });

        return this.responseService.success(
            this.messageService.get('auth.login.success'),
            {
                accessToken,
                expiredIn: this.configService.get<string>(
                    'auth.jwtExpirationTime'
                )
            }
        );
    }
}
