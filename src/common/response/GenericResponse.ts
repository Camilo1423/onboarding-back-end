import { TypeResponse } from './TypeResponse';

export class GenericResponse<T> {
  constructor(
    public readonly status: TypeResponse,
    public readonly message: string,
    public readonly data?: T,
  ) {}
}
