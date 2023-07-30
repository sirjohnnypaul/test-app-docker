import { InjectRepository } from '@nestjs/typeorm';
import { AbstractCrudRepositoryService } from '../../../models/data-access/abstract-crud-repository.service';
import { Repository, FindOneOptions } from 'typeorm';
import { ApiModel } from '../../../models/api.model';
import { EmailEntity } from '../entites/email.entity';

export class EmailRepositoryService extends AbstractCrudRepositoryService<
  EmailEntity
> {
  constructor(
    @InjectRepository(EmailEntity)
    private readonly _repo: Repository<EmailEntity>,
  ) {
    super(_repo);
  }

  createFindOptions(
    filterData: ApiModel.PaginationQuery,
  ): FindOneOptions<EmailEntity> {
    const findOption: FindOneOptions = {};
    return {};
  }

}
