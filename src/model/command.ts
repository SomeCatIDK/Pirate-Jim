import { Message } from "discord.js";

export default interface ICommand {
    name: string;
    help: string;
    execute(message: Message, args: string): Promise<void>;
}
