import * as express from 'express';
/**
 * Logs an error message and sends back an error response to the incoming
 * request.
 * @param err Error to be logged and sent.
 * @param res Express response object.
 * @param callback A function to be called synchronously.
 */
export declare function logAndSendError(err: Error | any, res: express.Response | null, callback?: Function): void;
