import { defineConfig } from 'dumi';

const baseUrl = process.env.NODE_ENV === 'production' ? '/fhdcloud/doc/dist/index.html#/' : '/';

export default defineConfig({
  title: ' ',
  favicon: '//www.fhd001.com/favicon.ico',
  logo: '//img1.fhd001.com/official/image/cloud_logo.png',
  outputPath: 'dist',
  mode: 'site',
  base: baseUrl,
  publicPath: baseUrl,
});
