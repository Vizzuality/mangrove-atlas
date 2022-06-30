import ee from '@google/earthengine';
import * as PRIVATE_KEY from './credentials.json'

export function eeAuthenticate(): Promise<void> {
  return new Promise((resolve, reject) => {
    // Authenticate to service account using short living access tokens
    ee.data.authenticateViaPrivateKey(PRIVATE_KEY,
      () => ee.initialize(null, null, resolve, reject),
      (error) => {
            console.error(error);
            }
    );
  });
}

export function eeEvaluate(eeStatement: ee.ComputedObject): Promise<any> {
  return new Promise((resolve, reject) => {
    eeStatement.evaluate((success: any, failure: any) => {
      if (failure) reject(new Error(failure));
      resolve(success);
    });
  });
}

export function arrSum(arr: []): number {
  return arr.reduce((a, b) => a + b, 0)
};
