import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // 커스텀 규칙 추가
  {
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn', // 또는 'off'로 해도 됨
    },
  },
];

export default eslintConfig;
