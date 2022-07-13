/**
 * This package contains the logic to load user's function.
 * @packageDocumentation
 */
/**
 * Import function signature type's definition.
 */
import { HandlerFunction } from './functions';
/**
 * Returns user's function from function file.
 * Returns null if function can't be retrieved.
 * @return User's function or null.
 */
export declare function getUserFunction(codeLocation: string, functionTarget: string): HandlerFunction | null;
