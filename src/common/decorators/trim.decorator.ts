import { Transform } from 'class-transformer';
import { isArray, map, trim } from 'lodash';

export const Trim = (): PropertyDecorator => {
  return Transform((params) => {
    const value = params.value as string[] | string;
    const multipleSpaceCharacters = /\s\s+/g;

    if (isArray(value)) {
      return map(value, (v) => trim(v).replace(multipleSpaceCharacters, ' '));
    }

    return trim(value).replace(multipleSpaceCharacters, ' ');
  });
};
