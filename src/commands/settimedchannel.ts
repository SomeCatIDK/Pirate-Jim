import { Message } from "discord.js";

import ICommand from "../model/command";

export default class CommandSetTimedChannel implements ICommand {
    public name = "settimedchannel";
    public help = "Sets the channel this is sent into as a timed channel, where the slowmode is extended to whatever time is requested.";

    public async execute(message: Message, args: string) { }
}
