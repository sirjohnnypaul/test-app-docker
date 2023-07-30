import { Transform } from 'class-transformer';
import { HttpException, HttpStatus, ValidationError } from '@nestjs/common';
import { Request } from 'express';
import { IsInt } from 'class-validator';

export namespace ApiModel {
  export const PAGINATION_BASE_PAGE: number = 1;
  export const PAGINATION_BASE_LIMIT: number = 10;
  export class PaginationQuery {
    @Transform(value => +value)
    @IsInt()
    page: number = PAGINATION_BASE_PAGE;

    @Transform(value => +value)
    @IsInt()
    limit: number = PAGINATION_BASE_LIMIT;
  }

  export class PaginationMetaDTO {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  }

  export class PaginatedResponse<T> {
    data: T[];
    meta: PaginationMetaDTO;
  }

  // TODO: translations
  export class ValidationDTOError extends HttpException {
    constructor(errors: ValidationError[]) {
      super(
        {
          fields: ValidationDTOError._mapValidationErrorsToApiFieldError(
            errors,
          ),
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    private static _mapValidationErrorsToApiFieldError(
      errors: ValidationError[],
    ): ApiFieldError {
      let fieldError: ApiFieldError = {};

      errors.forEach((error: ValidationError) => {
        fieldError = {
          ...fieldError,
          ...this._getErrors(error),
        };
      });

      return fieldError;
    }

    private static _getErrors(error: ValidationError): ApiFieldError {
      const result: ApiFieldError = {};

      // gets validation errors from childrens
      error.children.forEach((childrenError: ValidationError) => {
        this._getNestedValidationErrors(result, childrenError, error.property);
      });

      this._generateTopLevelConstrains(error, error.property, result);

      return result;
    }

    private static _getNestedValidationErrors(
      fieldError: ApiFieldError,
      error: ValidationError,
      parent_property_path: string,
    ): void {
      if (error.children?.length > 0) {
        error.children?.forEach(_err =>
          this._getNestedValidationErrors(
            fieldError,
            _err,
            `${parent_property_path}.${error.property}`,
          ),
        );
      }

      this._generateTopLevelConstrains(
        error,
        `${parent_property_path}.${error.property}`,
        fieldError,
      );
    }

    private static _generateTopLevelConstrains(
      error: ValidationError,
      property: string,
      fieldError: ApiFieldError,
    ): void {
      if (error.constraints) {
        if (!fieldError[`${property}`]) {
          fieldError[`${property}`] = [];
        }

        Object.keys(error.constraints).forEach((key: string) => {
          fieldError[`${property}`].push(error.constraints[key]);
        });
      }
    }
  }

  export interface ApiFieldError {
    [key: string]: string[];
  }

}
