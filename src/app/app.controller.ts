import { Controller, Get } from '@nestjs/common';
import { AppService } from 'app/app.service';
import { ResponseService } from 'response/response.service';
import { IApiResponseSuccess } from 'response/response.interface';
import { Response } from 'response/response.decorator';

@Controller('/api/test')
export class AppController {
    constructor(
        @Response() private readonly responseService: ResponseService,
        private readonly appService: AppService
    ) {}

    @Get('/')
    getHello(): IApiResponseSuccess {
        const message: string = this.appService.getHello();
        return this.responseService.success(200, message);
    }
}
