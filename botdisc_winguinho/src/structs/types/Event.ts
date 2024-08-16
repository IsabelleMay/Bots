import { ClientEvents } from "discord.js";

export type EventType<key extends keyof ClientEvents> = {
    name: key;
    once?: boolean;
    run(...args: ClientEvents[key]): any;
}

export class Event<key extends keyof ClientEvents> {
    constructor(options: EventType<key>){
        Object.assign(this, options)
    }
}   