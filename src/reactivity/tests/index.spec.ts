import { add } from "../index"



it('test', () => {
    expect(add(1,1)).toBe(2)
})

// typescript 报错的情况下通过yarn test还能跑通测试？？
// 通过yarn add jest @types/jest --dev，然后直接yarn install， 以为就能解决tsconfig和测试用例的报错。
// 虽然没有解决，但是却能跑通测试？如果找不到jest定义，应该就跑不通才对。
// 如果通过报错提示，执行npm i --save-dev @types/jest就可以解决报错。但是用了npm，那就和yarn没关系了？