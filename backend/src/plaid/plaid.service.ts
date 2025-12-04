import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PlaidApi, Configuration, PlaidEnvironments, Products, CountryCode } from 'plaid';
import { UsersService } from '../users/users.service';
import * as crypto from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../transactions/transaction.entity';

@Injectable()
export class PlaidService {
  private readonly plaidClient: PlaidApi;
  private readonly ALGORITHM = 'aes-256-gcm';
  private readonly IV_LENGTH = 16;
  private readonly KEY: Buffer;

  constructor(private config: ConfigService, private usersService: UsersService, @InjectRepository(Transaction) private transactionRepository: Repository<Transaction>) {
    const configuration = new Configuration({
      basePath: PlaidEnvironments[this.config.get('PLAID_ENV')],
      baseOptions: {
        headers: {
          'PLAID-CLIENT-ID': this.config.get('PLAID_CLIENT_ID'),
          'PLAID-SECRET': this.config.get('PLAID_SECRET'),
        },
      },
    });
    this.plaidClient = new PlaidApi(configuration);
    const encryptionKey = this.config.get<string>('ENCRYPTION_KEY');
    if (!encryptionKey || encryptionKey.length !== 64) throw new Error('ENCRYPTION_KEY must be a 64-character hex string');
    this.KEY = Buffer.from(encryptionKey, 'hex');
  }

  private encrypt(text: string): string {
    const iv = crypto.randomBytes(this.IV_LENGTH);
    const cipher = crypto.createCipheriv(this.ALGORITHM, this.KEY, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');
    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
  }

  private decrypt(encryptedText: string): string {
    const [ivHex, authTagHex, encryptedData] = encryptedText.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const decipher = crypto.createDecipheriv(this.ALGORITHM, this.KEY, iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  async createLinkToken(userId: string): Promise<string> {
    const request = {
      user: { client_user_id: userId },
      client_name: 'WalletMind',
      products: [Products.Transactions],
      country_codes: [CountryCode.Us],
      language: 'en',
    };
    try {
      const response = await this.plaidClient.linkTokenCreate(request);
      return response.data.link_token;
    } catch (error) {
      throw new InternalServerErrorException('خطا در ایجاد توکن Plaid');
    }
  }

  async exchangePublicTokenAndStore(userId: string, publicToken: string): Promise<boolean> {
    try {
      const response = await this.plaidClient.itemPublicTokenExchange({ public_token: publicToken });
      const accessToken = response.data.access_token;
      const encryptedAccessToken = this.encrypt(accessToken);
      await this.usersService.setPlaidAccessToken(userId, encryptedAccessToken);
      return true;
    } catch (error) {
      throw new InternalServerErrorException('خطا در تبادل توکن Plaid');
    }
  }

  async syncTransactions(userId: string): Promise<number> {
    const user = await this.usersService.findOneById(userId);
    if (!user || !user.plaid_access_token) throw new Error('کاربر توکن Plaid ندارد.');
    const accessToken = this.decrypt(user.plaid_access_token);
    try {
      const response = await this.plaidClient.transactionsSync({ access_token: accessToken });
      const transactions = response.data.added || [];
      const items = transactions.map(tx => ({
        user_id: userId,
        plaid_transaction_id: tx.transaction_id,
        amount: tx.amount,
        currency_code: tx.iso_currency_code,
        description: tx.name,
        category: tx.category ? tx.category.join(', ') : 'Other',
        transaction_date: tx.date,
      }));
      for (const item of items) {
        const exists = await this.transactionRepository.findOne({ where: { plaid_transaction_id: item.plaid_transaction_id } });
        if (!exists) await this.transactionRepository.save(this.transactionRepository.create(item));
      }
      return transactions.length;
    } catch (error) {
      throw new InternalServerErrorException('خطا در همگام‌سازی تراکنش‌ها.');
    }
  }
}
