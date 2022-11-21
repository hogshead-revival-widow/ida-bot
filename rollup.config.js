import replace from '@rollup/plugin-replace';
import { chromeExtension, simpleReloader } from 'rollup-plugin-chrome-extension';
import json from '@rollup/plugin-json';
import typescript from '@rollup/plugin-typescript';

export default {
    input: 'src/manifest.ts',
    output: {
        dir: 'build',
        format: 'esm',
    },
    plugins: [
        replace({
            preventAssignment: true,
            __LOGGING__: process.env.LOGGING === 'on' ? true : false,
        }),
        chromeExtension(),
        simpleReloader(),
        json(),
        typescript(),
    ],
};
