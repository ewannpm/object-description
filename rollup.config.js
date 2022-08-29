const pkg = require('./package.json')
export default {
    input: 'src/ObjectDescription.js',
    output: [
        {
            file: pkg.main,
            format: 'cjs',
            exports: "auto"
        },
        {
            file: pkg.module,
            format: 'esm',
            exports: "auto"
        }
    ]
}