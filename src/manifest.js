import { defineManifest } from '@crxjs/vite-plugin';
import packageData from '../package.json' assert { type: 'json' };

const isDev = process.env.NODE_ENV == 'development';

export default defineManifest({
  name: `${packageData.displayName || packageData.name}${isDev ? ` ➡️ Dev` : ''}`,
  description: packageData.description,
  version: packageData.version,
  manifest_version: 3,
  icons: {
    16: 'icons/logo-16.png',
    19: 'icons/logo-19.png',
    32: 'icons/logo-32.png',
    38: 'icons/logo-38.png',
    48: 'icons/logo-48.png',
    128: 'icons/logo-128.png',
  },
  action: {
    default_icon: {
      16: 'icons/logo-16.png',
      32: 'icons/logo-32.png',
      48: 'icons/logo-48.png',
      128: 'icons/logo-128.png',
    },
  },
  content_scripts: [
    {
      matches: ['<all_urls>'],
      js: ['src/contentScript/index.js'],
      all_frames: true,
    },
  ],
  web_accessible_resources: [
    {
      resources: ['img/*.png', 'img/*.svg', 'icons/*.png', 'icons/*.svg'],
      matches: ['<all_urls>'],
    },
  ],
  permissions: ['clipboardWrite'],
});
