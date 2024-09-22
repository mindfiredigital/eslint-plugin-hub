import type { ESLint, Linter } from 'eslint';

declare module '@mindfiredigital/eslint-plugin-hub' {
  // Type for individual rule
  export interface ESLintRule extends Linter.RuleEntry {
    meta?: {
      docs?: {
        description?: string;
        category?: string;
        recommended?: boolean;
        url?: string;
      };
      schema?: object[];
      messages?: Record<string, string>;
    };
  }

  // General rules
  export const generalRules: Record<string, ESLintRule>;

  // React rules
  export const reactRules: Record<string, ESLintRule>;

  // Angular rules
  export const angularRules: Record<string, ESLintRule>;

  // Flat and legacy configurations
  export const flatConfigBase: ESLint.ConfigData;

  export const legacyConfigBase: ESLint.ConfigData;

  // MERN Recommended Rules (Legacy)
  export const mernRecommendedRulesLegacy: Record<
    string,
    Linter.RuleLevel | Linter.RuleLevelAndOptions
  >;

  // MERN Recommended Rules (Flat Config)
  export const mernRecommendedRulesFlat: Record<
    string,
    Linter.RuleLevel | Linter.RuleLevelAndOptions
  >;

  // The hub object with meta and rules
  export const hub: {
    meta: {
      name: string;
      version: string;
    };
    rules: Record<string, ESLintRule>;
  };

  // Configurations for flat and legacy formats
  export const configs: {
    all: ESLint.ConfigData;
    general: ESLint.ConfigData;
    react: ESLint.ConfigData;
    angular: ESLint.ConfigData;
    mern: ESLint.ConfigData;
    'flat/all': ESLint.ConfigData;
    'flat/general': ESLint.ConfigData;
    'flat/react': ESLint.ConfigData;
    'flat/angular': ESLint.ConfigData;
    'flat/mern': ESLint.ConfigData;
  };
}
