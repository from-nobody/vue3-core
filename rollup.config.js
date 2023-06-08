import typescript from "@rollup/plugin-typescript"


export default {
    input: './src/index.ts',
    output: [
        {
            format: 'cjs',
            file: 'lib/vue-ninja.cjs.js'
        },
        {
            format: 'es',
            file: 'lib/vue-ninja.esm.js'
        }
    ],
    plugins: [typescript()]
}