import { Transform } from 'class-transformer';

export const ToLowerCase = (): PropertyDecorator => {
  return Transform(
    (params) => {
      const value = params.value as unknown;

      if (Array.isArray(value)) {
        return value.map((v) => {
          if (typeof v !== 'string') {
            return v;
          }

          return v.toLowerCase();
        });
      }

      if (typeof value !== 'string') {
        return value;
      }

      return value.toLowerCase();
    },
    {
      toClassOnly: true,
    },
  );
};
