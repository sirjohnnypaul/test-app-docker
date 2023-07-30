import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailEntity } from './entites/email.entity';
import { EmailRepositoryService } from './providers/email.repository.service';
@Module({
  imports: [TypeOrmModule.forFeature([EmailEntity])],
  providers: [EmailRepositoryService],
  exports: [EmailRepositoryService],
})
export class EmailEntityModule {}
