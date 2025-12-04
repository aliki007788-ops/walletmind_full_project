import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../transactions/transaction.entity';

interface SubscriptionResult {
  name: string;
  monthlyCost: number;
  yearlyCost: number;
  transactionCount: number;
}

@Injectable()
export class AnalysisService {
  constructor(@InjectRepository(Transaction) private transactionRepository: Repository<Transaction>) {}

  async findRecurringSubscriptions(userId: string): Promise<SubscriptionResult[]> {
    const userTransactions = await this.transactionRepository.find({ where: { user_id: userId } });
    const potentialSubs = new Map<string, { totalAmount: number; count: number; dates: Date[] }>();

    userTransactions.forEach(tx => {
      if (tx.amount < 0 && this.isSubscriptionLike(tx.description)) {
        const name = this.normalizeName(tx.description);
        const existing = potentialSubs.get(name);
        if (existing) { existing.totalAmount += tx.amount; existing.count++; existing.dates.push(new Date(tx.transaction_date)); }
        else potentialSubs.set(name, { totalAmount: tx.amount, count: 1, dates: [new Date(tx.transaction_date)] });
      }
    });

    const results: SubscriptionResult[] = [];
    potentialSubs.forEach((sub, name) => {
      if (sub.count >= 2) {
        const monthlyCost = Math.abs(sub.totalAmount / sub.count);
        results.push({
          name,
          monthlyCost: parseFloat(monthlyCost.toFixed(2)),
          yearlyCost: parseFloat((monthlyCost * 12).toFixed(2)),
          transactionCount: sub.count,
        });
      }
    });

    return results;
  }

  private isSubscriptionLike(description: string): boolean {
    const keywords = ['subscription', 'recurring', 'monthly', 'netflix', 'spotify', 'adobe', 'aws'];
    return keywords.some(kw => description.toLowerCase().includes(kw));
  }

  private normalizeName(description: string): string {
    const lower = description.toLowerCase();
    if (lower.includes('netflix')) return 'Netflix';
    if (lower.includes('spotify')) return 'Spotify';
    if (lower.includes('adobe')) return 'Adobe Creative Cloud';
    return description.split(' ')[0];
  }
}
