import { ApplicationCommandDataResolvable, BitFieldResolvable, Client, ClientEvents, Collection, GatewayIntentsString, IntentsBitField, Partials } from "discord.js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { Comand, ComandType, ComponentsButton, ComponentsModal, ComponentsSelect } from "./types/Command";
import { EventType } from "./types/Event";

dotenv.config();

const fileCondition = (fileName: string) => fileName.endsWith(".ts") || fileName.endsWith(".js");

export class ExtendedClient extends Client {
    public commands: Collection<string, ComandType> = new Collection();
    public buttons: Collection<string, any> = new Collection(); // Defina o tipo correto aqui
    public selects: Collection<string, any> = new Collection(); // Defina o tipo correto aqui
    public modals: Collection<string, any> = new Collection(); // Defina o tipo correto aqui

    constructor() {
        super({
            intents: Object.keys(IntentsBitField.Flags) as BitFieldResolvable<GatewayIntentsString, number>,
            partials: [
                Partials.Channel, Partials.GuildMember, Partials.GuildScheduledEvent, Partials.Message, Partials.Reaction, Partials.ThreadMember, Partials.User
            ]
        });
    }

    public start() {
        this.registerModules();
        this.registerEvents();
        this.login(process.env.BOT_TOKEN);
    }

    private registerCommands(commands: Array<ApplicationCommandDataResolvable>) {
        this.application?.commands.set(commands)
            .then(() => {
                console.log("🤠 Slash Commands (/) defined");
            })
            .catch(error => {
                console.log(`💀 An error occurred while trying to set the Slash Commands (/): \n ${error}`);
            });
    }

    private async registerModules() {
        const slashCommands: Array<ApplicationCommandDataResolvable> = [];

        const commandsPath = path.join(__dirname, "..", "commands");
        
        const commandDirs = fs.readdirSync(commandsPath);
        for (const dir of commandDirs) {
            const commandFiles = fs.readdirSync(path.join(commandsPath, dir)).filter(fileCondition);
            for (const fileName of commandFiles) {
                const command: ComandType = (await import(`../commands/${dir}/${fileName}`))?.default;
                const { name, buttons, selects, modals } = command;

                if (name) {
                    this.commands.set(name, command);
                    slashCommands.push(command);

                    if (buttons) buttons.forEach((run, key) => this.buttons.set(key, run));
                    if (selects) selects.forEach((run, key) => this.selects.set(key, run));
                    if (modals) modals.forEach((run, key) => this.modals.set(key, run));
                }
            }
        }

        this.once("ready", () => this.registerCommands(slashCommands));
    }

    private async registerEvents() {
        const eventsPath = path.join(__dirname, "..", "events");
        
        const eventDirs = fs.readdirSync(eventsPath);
        for (const dir of eventDirs) {
            const eventFiles = fs.readdirSync(path.join(eventsPath, dir)).filter(fileCondition);
            for (const fileName of eventFiles) {
                const { name, once, run }: EventType<keyof ClientEvents> = (await import(`../events/${dir}/${fileName}`))?.default;

                try {
                    if (name) (once) ? this.once(name, run) : this.on(name, run);
                } catch (error) {
                    console.log(`An error occurred on event: ${name} \n${error}`);
                }
            }
        }
    }
}
