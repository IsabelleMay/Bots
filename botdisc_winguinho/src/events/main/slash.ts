import { CommandInteractionOptionResolver } from "discord.js";
import { Client } from "../..";
import { Event } from "../../structs/types/Event"

export default new Event ({
    name: "interactionCreate",
    run(interaction) {
        if (!interaction.isCommand()) return;

        const Command = Client.commands.get(interaction.commandName);
        if (!Command) return;

        const options = interaction.options as CommandInteractionOptionResolver

        Command.run({ 
            client: Client,
            interaction: interaction,
            options: options
         })
    }
})