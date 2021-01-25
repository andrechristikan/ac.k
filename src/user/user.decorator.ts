import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IPayload } from 'auth/auth.interface';

export const User = createParamDecorator(
    (data: string, ctx: ExecutionContext): IPayload => {
        const request = ctx.switchToHttp().getRequest();
        const user: IPayload = request.user;
        return data ? user[data] : user;
    }
);