const pkg = require('./package.json')
export default {
    input: 'src/main.js',
    output: [
        { file: pkg.main, format: 'cjs'},
        { file: pkg.module, format: 'esm'}
    ]
}