import * as express from 'express';
export interface HttpFunction {
    (req: express.Request, res: express.Response): any;
}
export interface EventFunction {
    (data: {}, context: Context): any;
}
export interface EventFunctionWithCallback {
    (data: {}, context: Context, callback: Function): any;
}
export interface CloudEventFunction {
    (cloudevent: CloudEventsContext): any;
}
export interface CloudEventFunctionWithCallback {
    (cloudevent: CloudEventsContext, callback: Function): any;
}
export declare type HandlerFunction = HttpFunction | EventFunction | EventFunctionWithCallback | CloudEventFunction | CloudEventFunctionWithCallback;
/**
 * The Cloud Functions context object for the event.
 *
 * @link https://cloud.google.com/functions/docs/writing/background#function_parameters
 */
export interface CloudFunctionsContext {
    /**
     * A unique ID for the event. For example: "70172329041928".
     */
    eventId?: string;
    /**
     * The date/time this event was created. For example: "2018-04-09T07:56:12.975Z"
     * This will be formatted as ISO 8601.
     */
    timestamp?: string;
    /**
     * The type of the event. For example: "google.pubsub.topic.publish".
     */
    eventType?: string;
    /**
     * The resource that emitted the event.
     */
    resource?: string;
}
/**
 * The CloudEvents v1.0 context object for the event.
 *
 * @link https://github.com/cloudevents/spec/blob/master/spec.md#context-attributes
 */
export interface CloudEventsContext {
    /**
     * Type of occurrence which has happened.
     */
    type?: string;
    /**
     * The version of the CloudEvents specification which the event uses.
     */
    specversion?: string;
    /**
     * The event producer.
     */
    source?: string;
    /**
     * ID of the event.
     */
    id?: string;
    /**
     * Timestamp of when the event happened.
     */
    time?: string;
    /**
     * A link to the schema that the event data adheres to.
     */
    schemaurl?: string;
    /**
     * Content type of the event data.
     */
    contenttype?: string;
    [key: string]: any;
}
export declare type Context = CloudFunctionsContext | CloudEventsContext;
