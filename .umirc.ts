import { defineConfig } from 'dumi';

export default defineConfig({
  title: ' ',
  favicon: '//www.fhd001.com/favicon.ico',
  logo: '//img1.fhd001.com/official/image/cloud_logo.png',
  outputPath: 'dist',
  mode: 'site',
  base: '/fhdcloud/doc/dist/index.html#/',
  navs: [
    null,
    {
      title: 'GitHub',
      path: 'https://github.com/syukinmei',
    },
  ],
});
