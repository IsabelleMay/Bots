import { ApplicationCommandData, ButtonInteraction, Collection, CommandInteraction, CommandInteractionOptionResolver, Interaction, ModalSubmitInteraction, StringSelectMenuInteraction } from "discord.js";
import { ExtendedClient } from "../ExtendedClient";

interface Commandprops {
    client: ExtendedClient,
    interaction: CommandInteraction,
    options: CommandInteractionOptionResolver
}

export type ComponentsButton = Collection<string, (Interaction: ButtonInteraction) => any>
export type ComponentsSelect = Collection<string, (Interaction: StringSelectMenuInteraction) => any>
export type ComponentsModal = Collection<string, (Interaction: ModalSubmitInteraction) => any>

interface CommandComponents {
    buttons?: ComponentsButton;
    selects?: ComponentsSelect;
    modals?: ComponentsModal;
}

export type ComandType = ApplicationCommandData & CommandComponents & {
    run(props: Commandprops): any
}

export class Comand {
    constructor(options: ComandType){
        options.dmPermission = false;
        Object.assign(this, options);
    }
}