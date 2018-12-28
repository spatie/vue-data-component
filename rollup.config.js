import pkg from './package.json';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import { uglify } from 'rollup-plugin-uglify';
import resolve from 'rollup-plugin-node-resolve';

const plugins = [
    babel({
        exclude: 'node_modules/**',
    }),
    resolve(),
    commonjs(),
];

export default [
    {
        input: 'src/index.js',
        external: ['vue', 'deepmerge', 'qs'],
        plugins: plugins,
        output: [
            {
                file: pkg.module,
                format: 'es',
            },
            {
                file: pkg.main,
                format: 'cjs',
                exports: 'named',
            }
        ],
    },
    {
        input: 'src/index.js',
        external: ['vue'],
        plugins: [...plugins],
        output: [
            {
                file: pkg.browser,
                format: 'umd',
                name: 'DataComponent',
                exports: 'named',
                globals: {
                    vue: 'vue',
                },
            },
        ],
    },
    {
        input: 'src/index.js',
        external: ['vue'],
        plugins: [...plugins, uglify()],
        output: [
            {
                file: pkg.browser.replace('.js', '.min.js'),
                format: 'umd',
                name: 'DataComponent',
                exports: 'named',
                globals: {
                    vue: 'vue',
                },
            },
        ],
    },
];
