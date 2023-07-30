import {
  FindOneOptions,
  Repository,
  FindManyOptions,
  UpdateResult,
} from 'typeorm';
import { ApiModel } from '../api.model';
import { NotFoundException } from '@nestjs/common';

/**
 * Basic Repository responsible for retrieving data from DB
 * T - entity class
 * K - class used to query data for findAll method. K class has to extend ApiMOdel.PaginationQuery
 */
export abstract class AbstractCrudRepositoryService<
  T,
  K extends ApiModel.PaginationQuery = ApiModel.PaginationQuery
> {
  constructor(private readonly _repository: Repository<T>) {}

  async findAll(filterData: K): Promise<ApiModel.PaginatedResponse<T>> {
    const [data, totalCount]: [
      T[],
      number,
    ] = await this._repository.findAndCount({
      skip: (filterData.page - 1) * filterData.limit,
      take: filterData.limit,
      ...this.createFindOptions(filterData),
    });

    return this._preparePaginatedResponse(data, totalCount, filterData);
  }

  async findOneById(id: number): Promise<T | undefined> {
    return this._repository.findOneById(id);
  }

  abstract createFindOptions(filterData: K): FindManyOptions<T>;

  protected _preparePaginatedResponse(
    data: T[],
    totalCount: number,
    pagiantionQuery: ApiModel.PaginationQuery,
  ): ApiModel.PaginatedResponse<T> {
    return {
      data,
      meta: {
        total: totalCount,
        per_page: pagiantionQuery.limit,
        current_page: pagiantionQuery.page,
        last_page:
          totalCount === 0 ? 0 : Math.ceil(totalCount / pagiantionQuery.limit),
      },
    };
  }

  // TODO: przegadać jak chcemy to zabezpieczyć przed aktualizacją
  create(data: any): Promise<any> {
    return this._repository.save(data);
  }

  // TODO: przegadać czy tak chcemy
  async update(id: number, data: any): Promise<UpdateResult> {
    return this._repository.update(id, data);
  }

  async save(data: any): Promise<any> {
    return this._repository.save(data);
  }

  async remove(...data: T[]): Promise<T[]> {
    return this._repository.remove(data);
  }

  async removeById(id: number): Promise<T> {
    const entity: T = await this.findOneById(id);
    if (!entity) {
      throw new NotFoundException();
    } else {
      return this._repository.remove(entity);
    }
  }
}
