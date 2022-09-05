import { Transform } from 'class-transformer';

export const Trim = (): PropertyDecorator => {
  return Transform((params) => {
    const value = params.value as unknown;
    const multipleSpaceCharacters = /\s\s+/g;

    if (Array.isArray(value)) {
      return value.map((v) => {
        if (typeof v !== 'string') {
          return v;
        }

        return v.trim().replace(multipleSpaceCharacters, ' ');
      });
    }

    if (typeof value !== 'string') {
      return value;
    }

    return value.trim().replace(multipleSpaceCharacters, ' ');
  });
};
