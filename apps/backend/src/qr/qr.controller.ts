import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { QrService } from './qr.service';

@Controller('qr')
export class QrController {
  constructor(private readonly qrService: QrService) {}

  @Post('generate')
  async generate(@Body() body: { ticketId: string }) {
    return this.qrService.generateQr(body.ticketId);
  }

  @Get('verify/:token')
  async verify(@Param('token') token: string) {
    return this.qrService.verifyQr(token);
  }
}