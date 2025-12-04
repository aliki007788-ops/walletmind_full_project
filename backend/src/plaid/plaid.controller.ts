import { Controller, Post, UseGuards, Req, Body } from '@nestjs/common';
import { PlaidService } from './plaid.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Request } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('plaid')
export class PlaidController {
  constructor(private readonly plaidService: PlaidService) {}

  @Post('create_link_token')
  async createLinkToken(@Req() req: Request) {
    const userId = req.user['sub'];
    const linkToken = await this.plaidService.createLinkToken(userId);
    return { link_token: linkToken };
  }

  @Post('exchange_public_token')
  async exchangePublicToken(@Req() req: Request, @Body('public_token') publicToken: string) {
    const userId = req.user['sub'];
    const result = await this.plaidService.exchangePublicTokenAndStore(userId, publicToken);
    return { success: result };
  }

  @Post('sync_transactions')
  async syncTransactions(@Req() req: Request) {
    const userId = req.user['sub'];
    const count = await this.plaidService.syncTransactions(userId);
    return { message: `${count} transactions synced`, count };
  }
}
