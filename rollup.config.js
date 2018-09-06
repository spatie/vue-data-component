import pkg from './package.json';
import babel from 'rollup-plugin-babel';
import { uglify } from 'rollup-plugin-uglify';

export default [
    {
        input: 'src/index.js',
        external: ['vue', 'qs'],
        plugins: [
            babel({
                exclude: 'node_modules/**',
                plugins: ['external-helpers'],
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
            babel({
                exclude: 'node_modules/**',
                plugins: ['external-helpers'],
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
