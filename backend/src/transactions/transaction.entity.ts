import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @Column({ unique: true })
  plaid_transaction_id: string;

  @Column('float')
  amount: number;

  @Column({ nullable: true })
  currency_code: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  category: string;

  @Column({ type: 'date' })
  transaction_date: string;

  @CreateDateColumn()
  created_at: Date;
}
