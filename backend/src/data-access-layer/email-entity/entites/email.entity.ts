import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../models/entity/base-entity.entity';

@Entity('email')
export class EmailEntity extends BaseEntity {
  @Column({ type: 'varchar', nullable: false })
  title: string;

  @Column({ type: 'varchar', nullable: false })
  to: string;

  @Column({ type: 'varchar', nullable: false })
  message: string;
}
