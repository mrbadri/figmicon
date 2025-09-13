import { pascalCase, camelCase, kebabCase, snakeCase } from 'change-case';

export type FormatNameCase = 'camel' | 'kebab' | 'pascal' | 'snake';
export type FormatName = (name: string, caseType: FormatNameCase) => string;

export const formatName: FormatName = (name: string, caseType: FormatNameCase) => {
  let formattedName: string;

  switch (caseType) {
    case 'camel':
      formattedName = camelCase(name);
      break;
    case 'kebab':
      formattedName = kebabCase(name);
      break;
    case 'snake':
      formattedName = snakeCase(name);
      break;
    case 'pascal':
    default:
      formattedName = pascalCase(name);
      break;
  }

  return formattedName;
};
