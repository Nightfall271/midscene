import path, { join } from 'node:path';
import { parseContextFromWebPage } from '@/common/utils';
import { generateExtractData } from '@/debug';
import { describe, expect, it } from 'vitest';
import { launchPage } from '../ai/puppeteer/utils';

const pagePath = join(__dirname, './fixtures/web-extractor/index.html');
describe(
  'extractor',
  () => {
    it('basic', async () => {
      const { page, reset } = await launchPage(`file://${pagePath}`, {
        viewport: {
          width: 1080,
          height: 2000,
        },
      });

      const { content } = await parseContextFromWebPage(page);
      await generateExtractData(
        page,
        path.join(__dirname, 'fixtures/web-extractor'),
        {
          disableInputImage: false,
          disableOutputImage: false,
          disableOutputWithoutTextImg: true,
          disableResizeOutputImg: true,
          disableSnapshot: true,
        },
      );

      const list = content.map((item) => {
        return {
          content: item.content,
          attributes: item.attributes,
        };
      });

      expect(list).toMatchSnapshot();
      await reset();
    });

    it('scroll', async () => {
      const { page, reset } = await launchPage(`file://${pagePath}`, {
        viewport: {
          width: 1080,
          height: 200,
        },
      });
      await page.scrollDownOneScreen();
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await generateExtractData(
        page,
        path.join(__dirname, 'fixtures/web-extractor/scroll'),
        {
          disableInputImage: false,
          disableOutputImage: false,
          disableOutputWithoutTextImg: true,
          disableResizeOutputImg: true,
          disableSnapshot: true,
        },
      );
    });

    it('profile ', async () => {
      const { page, reset } = await launchPage('https://webinfra.org/about');
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.time('total - parseContextFromWebPage');
      const { content } = await parseContextFromWebPage(page);
      console.timeEnd('total - parseContextFromWebPage');
      await reset();
    });
  },
  {
    timeout: 90 * 1000,
  },
);