import { Page } from '@playwright/test';

const positions = [
  {
    x: 647,
    y: 390,
  },
  {
    x: 643,
    y: 664,
  },
  {
    x: 1123,
    y: 595,
  },
  {
    x: 1073,
    y: 301,
  },
  {
    x: 647,
    y: 390,
  },
];

export const useDrawingTool = (page: Page) => ({
  open: async () => await page.getByTestId('drawing-tool-button').click(),

  enableDrawing: async () => await page.getByTestId('start-drawing-button').click({ delay: 300 }),

  draw: async () => {
    await page.waitForTimeout(1000);
    const map = page.getByRole('region', { name: 'Map' });
    await map.click({
      position: positions[0],
      delay: 300,
      force: true,
    });
    await page.waitForTimeout(500);
    await map.click({
      position: positions[1],
      delay: 300,
      force: true,
    });
    await page.waitForTimeout(500);
    await map.click({
      position: positions[2],
      delay: 300,
      force: true,
    });
    await page.waitForTimeout(500);
    await map.click({
      position: positions[3],
      delay: 300,
      force: true,
    });
    await page.waitForTimeout(500);
    await map.click({
      position: positions[4],
      delay: 300,
      force: true,
    });
    await page.waitForTimeout(500);
  },
  drawBouns: [
    [-4.374684979839401, 0.5613643613065875],
    [22.480153729838037, 15.475547647941127],
  ],
  geojsonBounds: [
    [-56.295627936195814, -29.62928334855291],
    [-40.56395311652216, -16.334885770322714],
  ],

  uploadGeojson: async (file: string) => {
    await page.getByTestId('shapefile-upload').setInputFiles(file);
    await page.waitForTimeout(1000);
  },
});
