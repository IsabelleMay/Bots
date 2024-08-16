import { ApplicationCommandType } from "discord.js";
import { Comand } from "../../structs/types/Command";

export default new Comand ({
    name: "ping",
    description: "replay with pong",
    type: ApplicationCommandType.ChatInput,
    run({interaction}){
        interaction.reply({ephemeral: true, content: "pong"})
    }
})