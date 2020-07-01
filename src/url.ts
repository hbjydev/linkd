import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn
} from 'typeorm';

@Entity()
export default class URL extends BaseEntity {
  
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ unique: true, nullable: false })
  public alias!: string;

  @Column({ nullable: false })
  public url!: string;

  @Column({ unique: true, nullable: false })
  public accessKey!: string;

  @Column({ default: 0 })
  public hits!: number;

  @CreateDateColumn()
  public createdAt!: Date;

  @UpdateDateColumn()
  public updatedAt!: Date;

  // TODO investigate typeorm soft delete
  @DeleteDateColumn()
  public deletedAt!: Date;

}

