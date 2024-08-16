import { Message } from "discord.js";
import { ExtendedClient } from "./structs/ExtendedClient";
export * from "colors";
import config from "./config.json"

import fs from "fs";

const Client = new ExtendedClient();
Client.start();

export { Client, config }

