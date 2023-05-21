import { add } from "../index"



it('test', () => {
    expect(add(1,1)).toBe(2)
})

// typescript 报错的情况下通过yarn test还能跑通测试？？
// 通过yarn add jest @types/jest --dev，然后直接yarn install， 以为就能解决tsconfig和测试用例的报错。
// 虽然没有解决，但是却能跑通测试？如果找不到jest定义，应该就跑不通才对。
// 如果通过报错提示，执行npm i --save-dev @types/jest就可以解决报错。但是用了npm，那就和yarn没关系了？


// test 能跑通因为安装了 jest （yarn add jest）
// 之所以报错是因为安装了依赖但是没有生成依赖对应的node modules文件
// 找不到jest定义只是因为无法识别jest api的对应typescript types，但是安装了jest并且测试逻辑正确，所以跑通
// 是的，如果一定要用yarn来下载依赖的话，代替的方案是执行 yarn config set nodeLinkers node_modules, 然后 yarn install