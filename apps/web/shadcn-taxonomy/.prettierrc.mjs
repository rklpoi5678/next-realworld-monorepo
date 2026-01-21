/** @type {import('prettier').Config} */
const config = {
    // 기본 코드 스타일
    endOfLine: 'lf',
    semi: false,
    singleQuote: false,
    tabWidth: 2,
    trailingComma: 'all',

    // ESM 플러그인 시스템
    plugins: [
        "@ianvs/prettier-plugin-sort-imports",
        "prettier-plugin-tailwindcss"
    ],

    importOrder: [
        // React || Next.js Core
        "^(react/(.*)$)|^(react$)",
        "^(next/(.*)$)|^(next$)",
        "<THIRD_PARTY_MODULES>",
        "",
        // 프로젝트 내부 별칭(Alias) 정렬
         "^types$",
        "^@/env(.*)$",
        "^@/types/(.*)$",
        "^@/config/(.*)$",
        "^@/lib/(.*)$",
        "^@/hooks/(.*)$",
        "^@/components/ui/(.*)$",
        "^@/components/(.*)$",
        "^@/styles/(.*)$",
        "^@/app/(.*)$",
        "",
        // 상대 경로
        "^[./]",
    ],
    importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
    importOrderTypeScriptVersion: "^5",

    // Tailwind CSS v4 & React 19 Action
    tailwindFunctions: ["clsx", "twMerge", "cva", "cn"],

    jsxBracketSameLine: false,
    jsxSingleQuote: false
}

export default config;