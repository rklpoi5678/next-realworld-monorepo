# package.json

## publishConfig

publishConfig 필드를 사용하면 패키지를 배포(publish) 할 때 몇가지 설정들을 오버라이드 할 수 있습니다.

```json
{
  "publishConfig": {
    "access": "public",
    "bin": "./build/bin.js",
    "browser": "./build/browser.js",
    "executableFiles": ["./dist/shim.js"],
    "main": "./build/index.js",
    "exports": {
      ".": "./build/index.js",
      "./lib": "./build/index.js",
      "./feature": "./build/feature/index.js"
    },
    "module": "./build/index.mjs",
    "registry": "https://npm.pkg.github.com"
  }
}
```

PNPM에서는 bin, main, exports, types(또는 typings), module, browser, cpu, os 필드 등을 오버라이드 할 수 있고, executableFiles, directory, linkDirectory 필드를 추가로 설정할 수 있습니다.

executableFiles: Yarn 2+와 동일한 기능을 하는 필드입니다.
directory: 현재 package.json 위치를 기준으로 배포(publish) 되는 디렉토리를 저장하는 필드입니다.
linkDirectory: true로 설정할 경우 개발 중에 publishConfig.directory 위치에 심볼릭 링크가 생성됩니다.

## next.json

@ see https://bo5mi.tistory.com/270baseUrl: "."
모듈 이름의 기준 디렉토리를 지정한다. 프로젝트의 루트 디렉토리를 기준으로 상대 경로 임포트를 해석한다.
상대경로 없이 모듈을 임포트할 때(예: import { Button } from 'components/Button') 기준이 되는 경로이다.

isolatedModules: true
각 파일을 별도의 모듈로 취급하도록 설정한다.
TypeScript가 아닌 다른 트랜스파일러(Babel 등)와 함께 사용할 때 유용하다.
타입 정보만 포함된 파일 생성을 방지하고, 모든 파일이 독립적으로 컴파일될 수 있도록 한다.

resolveJsonModule: true
.json 파일을 모듈로 임포트할 수 있게 한다.
예: import data from './data.json'와 같이 JSON 파일을 직접 임포트하여 타입 안전성을 확보할 수 있다.
확장자가 .json인 모듈의 import를 허용하는 설정이다. 생각해 보면 Node.js 자바스크립트 프로젝트에서 json 설정 파일을 import해서 자주 사용해온걸 떠올릴 것이다. 타입스크립트도 가능할 것이라 생각하지만, json의 프로퍼티들을 싹다 타입을 지정해야 사용이 가능하다.
이 옵션은 json의 타입을 자동으로 설정해줘서 따로 변환 작업없이 타입스크립트에서 json 파일 데이터들을 곧바로 사용할 수 있도록 해준다.

allowImportingTsExtensions: true
.ts, .tsx 확장자를 가진 파일을 직접 임포트할 수 있게 한다.
주로 noEmit: true와 함께 설정하여 사용한다.

noEmit: true
TypeScript 컴파일러가 JavaScript 파일을 생성하지 않고 타입 검사만 수행하도록 한다.
Vite, Webpack 같은 번들러를 사용할 때 유용하다. 번들러가 트랜스파일을 담당하고 TypeScript는 타입 체킹만 수행한다.

esModuleInterop: true
CommonJS 모듈을 ES 모듈처럼 임포트할 수 있게 해주는 설정이다.
예: import React from 'react'와 같은 임포트 방식을 가능하게 한다.
라이브러리 중에서는 amd(웹) 방식을 전제로 구현된 라이브러리가 있는데 commonjs 방식으로 동작하는 TS에서는 혼란을 줄 수 있다. 상호 운용적(interoperable)으로 사용하기 위해서는 가능한 true로 지정해 놓고 타입스크립트 코딩을 하는것을 권한다.

allowSyntheticDefaultImports: true
기본 내보내기(default export)가 없는 모듈에서도 import x from 'y' 구문을 사용할 수 있게 한다.
타입 검사 수준에서만 작동하며, 런타임 동작을 변경하지 않는다.

forceConsistentCasingInFileNames: true
파일 이름의 대소문자를 일관되게 사용하도록 강제한다.
대소문자를 구분하는 파일 시스템과 구분하지 않는 파일 시스템 간의 문제를 방지한다. 프로그래밍 세계에선 같은 알파벳이라도 대소문자를 모두 구분하기 때문에 이 옵션은 가능한 true로 해놓고 사용하기를 권장한다.

strict: true
모든 엄격한 타입 검사 옵션을 활성화한다.
이 설정 하나로 noImplicitAny, strictNullChecks, strictFunctionTypes 등 여러 엄격한 검사 옵션을 켤 수 있다. 사실상 이 옵션을 쓰지않는것은 곧 타입스크립트를 쓰지 않는 다는 것과 같다. 따라서 기본으로 활성화 되어 있다

noUnusedLocals: true
사용되지 않는 지역 변수에 대해 오류를 보고한다.
코드 품질을 향상시키고 불필요한 변수 선언을 줄일 수 있다.

noImplicitOverride: true
상속 받은 메서드를 오버라이딩할 때 명시적으로 override 키워드를 사용하도록 강제한다.
부모 클래스의 메서드 시그니처가 변경될 때 자식 클래스의 오버라이딩 메서드가 적절히 업데이트되도록 보장한다.

noUnusedParameters: true
함수에서 사용되지 않는 매개변수에 대해 오류를 보고한다.
코드의 명확성을 높이고 불필요한 매개변수를 제거하도록 유도한다.

noUncheckedIndexedAccess: true
인덱스 접근 시 해당 요소가 존재하지 않을 수 있다고 가정하고 undefined를 유니온 타입으로 추가한다.
배열이나 객체에 접근할 때 경계를 벗어난 접근을 방지할 수 있다.
예: arr[0]의 타입은 T가 아닌 T | undefined가 된다.

noFallthroughCasesInSwitch: true
switch 문에서 case 간 폴스루(fall-through)가 발생할 경우 오류를 보고한다.
각 case 문이 break, return, 또는 throw로 끝나도록 강제한다.

allowJs: false
JavaScript 파일(.js)의 컴파일을 허용하지 않는다.
TypeScript 파일만 프로젝트에 포함되도록 한다.

skipLibCheck: true
선언 파일(\*.d.ts)의 타입 검사를 건너뛴다.
빌드 시간을 단축시킬 수 있지만, 서드파티 라이브러리의 타입 오류를 놓칠 수 있다.

{
"compilerOptions": {

    /* 기본 옵션
     * ------------------------------------------------------------------------------------------------------------------------------------------------ */
    "incremental": true,                   /* 증분 컴파일 활성화 */
    "target": "es5",                          /* ECMAScript 목표 버전 설정: 'ES3'(기본), 'ES5', 'ES2015', 'ES2016', 'ES2017','ES2018', 'ES2019', 'ES2020', or 'ESNEXT'. */
    "module": "esnext",                       /* 생성될 모듈 코드 설정: 'none', 'commonjs', 'amd', 'system', 'umd', 'es2015', 'es2020', or 'ESNext'. */
    "lib": ["dom", "dom.iterable", "esnext"], /* 컴파일 과정에 사용될 라이브러리 파일 설정 */
    "allowJs": true,                          /* JavaScript 파일 컴파일 허용 */
    "checkJs": true,                       /* .js 파일 오류 리포트 설정 */
    .tsx 확장자의 컴파일 결과 JSX 코드를 어떻게 컴파일할지 결정한다.

react : .js 파일로 컴파일 된다. (JSX 코드는 React.createElement() 함수의 호출로 변환됨)
react-jsx : .js 파일로 컴파일 된다. (JSX 코드는 \_jsx() 함수의 호출로 변환됨)
react-jsxdev : .js 파일로 컴파일 된다. (JSX 코드는 \_jsx() 함수의 호출로 변환됨)
preserve : .jsx 파일로 컴파일 된다. (JSX 코드가 그대로 유지됨)
react-native : .js 파일로 컴파일 된다. (JSX 코드가 그대로 유지됨)
"jsx": "react", /_ 생성될 JSX 코드 설정: 'preserve', 'react-native', or 'react'. _/
"declaration": true, /_ '.d.ts' 파일 생성 설정 _/
"declarationMap": true, /_ 해당하는 각 '.d.ts'파일에 대한 소스 맵 생성 _/
"sourceMap": true, /_ 소스맵 '.map' 파일 생성 설정 _/
"outFile": "./", /_ 복수 파일을 묶어 하나의 파일로 출력 설정 _/
"outDir": "./dist", /_ 출력될 디렉토리 설정 _/
"rootDir": "./", /_ 입력 파일들의 루트 디렉토리 설정. --outDir 옵션을 사용해 출력 디렉토리 설정이 가능 _/
"composite": true, /_ 프로젝트 컴파일 활성화 _/
"tsBuildInfoFile": "./", /_ 증분 컴파일 정보를 저장할 파일 지정 _/
"removeComments": true, /_ 출력 시, 주석 제거 설정 _/
"noEmit": true, /_ 출력 방출(emit) 유무 설정 _/
"importHelpers": true, /_ 'tslib'로부터 헬퍼를 호출할 지 설정 _/
"downlevelIteration": true, /_ 'ES5' 혹은 'ES3' 타겟 설정 시 Iterables 'for-of', 'spread', 'destructuring' 완벽 지원 설정 _/
"isolatedModules": true, /_ 각 파일을 별도 모듈로 변환 ('ts.transpileModule'과 유사) _/

    /* 엄격한 유형 검사 옵션
     * ------------------------------------------------------------------------------------------------------------------------------------------------ */
    "strict": true,                           /* 모든 엄격한 유형 검사 옵션 활성화 */
    "noImplicitAny": true,                 /* 명시적이지 않은 'any' 유형으로 표현식 및 선언 사용 시 오류 발생 */
    "strictNullChecks": true,              /* 엄격한 null 검사 사용 */
    "strictFunctionTypes": true,           /* 엄격한 함수 유형 검사 사용 */
    "strictBindCallApply": true,           /* 엄격한 'bind', 'call', 'apply' 함수 메서드 사용 */
    "strictPropertyInitialization": true,  /* 클래스에서 속성 초기화 엄격 검사 사용 */
    "noImplicitThis": true,                /* 명시적이지 않은 'any'유형으로 'this' 표현식 사용 시 오류 발생 */
    "alwaysStrict": true,                  /* 엄격모드에서 구문 분석 후, 각 소스 파일에 "use strict" 코드를 출력 */

    /* 추가 검사 옵션
     * ------------------------------------------------------------------------------------------------------------------------------------------------ */
    "noUnusedLocals": true,                /* 사용되지 않은 로컬이 있을 경우, 오류로 보고 */
    "noUnusedParameters": true,            /* 사용되지 않은 매개변수가 있을 경우, 오류로 보고 */
    "noImplicitReturns": true,             /* 함수가 값을 반환하지 않을 경우, 오류로 보고 */
    "noFallthroughCasesInSwitch": true,       /* switch 문 오류 유형에 대한 오류 보고 */

"noUncheckedIndexedAccess": true, /_ 인덱스 시그니처 결과에 'undefined' 포함 _/

    /* 모듈 분석 옵션
     * ------------------------------------------------------------------------------------------------------------------------------------------------ */
     참고로 module 프로퍼티는 moduleResolution 프로퍼티의 기본값도 결정한다.

module이 commonjs면 노드에서 작동하는 것을 의미하므로, moduleResoultion 키 값은 node이며, 만일 module이 amd(웹)면 classic으로 설정된다.
"moduleResolution": "node", /_ 모듈 분석 방법 설정: 'node' (Node.js) 또는 'classic' (TypeScript pre-1.6). _/
"baseUrl": "./", /_ 절대 경로 모듈이 아닌, 모듈이 기본적으로 위치한 디렉토리 설정 (예: './modules-name') _/
"paths": {}, /_ 'baseUrl'을 기준으로 상대 위치로 가져오기를 다시 매핑하는 항목 설정 _/
"rootDirs": [], /_ 런타임 시 프로젝트 구조를 나타내는 로트 디렉토리 목록 _/
"typeRoots": [], /_ 유형 정의를 포함할 디렉토리 목록 _/tsconfig는 기본적으로 node*modules 폴더를 제외하지만, 라이브러리의 타입을 정의해놓는 @types 폴더는 컴파일에 자동으로 경로에 포함된다. 그런데 만약 이 @types의 기본 경로를 변경하고 싶다면
"types": [], /* 컴파일 시 포함될 유형 선언 파일 입력 _/
"allowSyntheticDefaultImports": true, /_ 기본 출력(default export)이 없는 모듈로부터 기본 호출을 허용 (이 코드는 단지 유형 검사만 수행) _/
"esModuleInterop": true, /_ 모든 가져오기에 대한 네임스페이스 객체 생성을 통해 CommonJS와 ES 모듈 간의 상호 운용성을 제공. 'allowSyntheticDefaultImports' 암시 _/
"preserveSymlinks": true, /_ symlinks 실제 경로로 결정하지 않음 _/
"allowUmdGlobalAccess": true, /_ 모듈에서 UMD 글로벌에 접근 허용 \_/

    /* 소스맵 옵션
     * ------------------------------------------------------------------------------------------------------------------------------------------------ */
    "sourceRoot": "./",                    /* 디버거(debugger)가 소스 위치 대신 TypeScript 파일을 찾을 위치 설정 */
    "mapRoot": "./",                       /* 디버거가 생성된 위치 대신 맵 파일을 찾을 위치 설정 */
    "inlineSourceMap": true,               /* 하나의 인라인 소스맵을 내보내도록 설정 */
    "inlineSources": true,                 /* 하나의 파일 안에 소스와 소스 코드를 함께 내보내도록 설정. '--inlineSourceMap' 또는 '--sourceMap' 설정이 필요 */

    /* 실험적인 기능 옵션
     * ------------------------------------------------------------------------------------------------------------------------------------------------ */
    "experimentalDecorators": true,        /* ES7 데코레이터(decorators) 실험 기능 지원 설정 */
    "emitDecoratorMetadata": true,         /* 데코레이터를 위한 유형 메타데이터 방출 실험 기능 지원 설정 */

    /* 고급 옵션
     * ------------------------------------------------------------------------------------------------------------------------------------------------ */
    "skipLibCheck": true,                     /* 선언 파일 유형 검사 스킵 */
    "forceConsistentCasingInFileNames": true  /* 동일한 파일에 대한 일관되지 않은 케이스 참조를 허용하지 않음 */

}
}
