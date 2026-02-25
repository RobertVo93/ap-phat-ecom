import { EventEmitter } from 'events';

// Use global variable to avoid loosing connections when hot-reload in dev environment
// In production environment, server build and run once (don't hot-reload so emitter created and exist till server shut down)
const globalForEmitter = global as unknown as { notificationEmitter: EventEmitter };

export const notificationEmitter = globalForEmitter.notificationEmitter || new EventEmitter();

notificationEmitter.setMaxListeners(200)

if (process.env.NODE_ENV !== 'production') globalForEmitter.notificationEmitter = notificationEmitter;