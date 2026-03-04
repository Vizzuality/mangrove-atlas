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

  draw: async () => {
    await page.waitForTimeout(500);
    const map = page.locator('.mapboxgl-canvas');
    await map.click({
      position: positions[0],
      delay: 300,
      force: true,
    });
    await page.waitForTimeout(300);
    await map.click({
      position: positions[1],
      delay: 300,
      force: true,
    });
    await page.waitForTimeout(300);
    await map.click({
      position: positions[2],
      delay: 300,
      force: true,
    });
    await page.waitForTimeout(300);
    await map.click({
      position: positions[3],
      delay: 300,
      force: true,
    });
    await page.waitForTimeout(300);
    await map.click({
      position: positions[4],
      delay: 300,
      force: true,
    });
    await page.waitForTimeout(300);
  },
  drawBounds: [
    [-4.374684979839401, 0.5613643613065875],
    [22.480153729838037, 15.475547647941127],
  ],
  geojsonBounds: [
    [-56.295627936195814, -29.62928334855291],
    [-40.56395311652216, -16.334885770322714],
  ],

  uploadGeojson: async (file: string) => {
    await page.getByTestId('shapefile-upload').setInputFiles(file);
  },
});
