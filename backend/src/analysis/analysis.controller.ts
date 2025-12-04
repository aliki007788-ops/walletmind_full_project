import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Request } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('analysis')
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  @Get('subscriptions')
  async getSubscriptions(@Req() req: Request) {
    const userId = req.user['sub'];
    return this.analysisService.findRecurringSubscriptions(userId);
  }
}
