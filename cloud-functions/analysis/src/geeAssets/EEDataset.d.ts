import ee from '@google/earthengine';

export interface IDataAsset {
  /** Path to earth engine asset */
  readonly assetPath: { [key: string]: string };
  readonly versionCode: string;

  readonly citation: string;
  readonly sourceName: string;
  readonly sourceUrl?: string;

  /** Function that returns ee.Image instance with asset */
  getEEAsset: (key?: string) => ee.Image;
}
