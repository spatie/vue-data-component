import pkg from './package.json';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import { uglify } from 'rollup-plugin-uglify';
import resolve from 'rollup-plugin-node-resolve';

export default [
    {
        input: 'src/index.js',
        external: ['vue', 'qs'],
        plugins: [
            resolve(),
            commonjs(),
            babel({
                exclude: 'node_modules/**',
            }),
        ],
        output: [
            {
                file: pkg.module,
                format: 'es',
            },
            {
                file: pkg.main,
                format: 'cjs',
                exports: 'named',
            },
            {
                file: pkg.browser,
                format: 'umd',
                name: 'DataComponent',
                exports: 'named',
                globals: {
                    vue: 'vue',
                    'query-string': 'queryString',
                },
            },
        ],
    },
    {
        input: 'src/index.js',
        external: ['vue', 'qs'],
        plugins: [
            resolve(),
            commonjs(),
            babel({
                exclude: 'node_modules/**',
            }),
            uglify(),
        ],
        output: [
            {
                file: pkg.browser.replace('.js', '.min.js'),
                format: 'umd',
                name: 'DataComponent',
                exports: 'named',
                globals: {
                    vue: 'vue',
                    qs: 'queryString',
                },
            },
        ],
    },
];
