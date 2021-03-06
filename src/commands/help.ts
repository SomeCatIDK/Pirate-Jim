import { GuildMember, RichEmbed, TextChannel } from "discord.js";
import CommandRegistry from "../controllers/commands";
import ICommand from "../model/command/command";
import ECommandCategory from "../model/command/command-category";
import ECommandResult from "../model/command/command-result";

export default class CommandHelp implements ICommand {
    public name = "help";
    public aliases: string[] = [];
    public syntax = "help <command>";
    public description = "Gets a list of commands, or gets the specific details of the specified command.";
    public category = ECommandCategory.INFORMATIONAL;

    public async execute(author: GuildMember, channel: TextChannel, args: string[]): Promise<ECommandResult> {
        if (args.length === 0) {
            await channel.send(this.buildListEmbed());
        } else {
            const command = CommandRegistry.get(args[0].toLowerCase());

            if (command) {
                await channel.send(this.buildCommandEmbed(command));
            } else {
                await channel.send("The requested command couldn't be found!");
            }
        }

        return ECommandResult.SUCCESS;
    }

    private buildListEmbed(): RichEmbed {
        const embed = new RichEmbed();
        const categoryMap = new Map<string, ICommand[]>();

        const iterator = CommandRegistry.values();

        for (const command of iterator) {
            if (!categoryMap.has(command.category.toString())) {
                categoryMap.set(command.category.toString(), [ command ]);
            } else {
                const innerCategory = categoryMap.get(command.category.toString()) as ICommand[];

                if (!innerCategory.includes(command)) {
                    innerCategory.push(command);
                }
            }
        }

        embed.setTitle("**Commands:**");

        categoryMap.forEach((commands, key) => {
            let description = "";

            commands.forEach((x) => {
                description = `${description}${x.name}: ${x.description}\n`;
            });

            embed.addField(`${key}:`, description);
        });

        embed.setColor("#00ff00");

        return embed;
    }

    private buildCommandEmbed(command: ICommand): RichEmbed {
        const embed = new RichEmbed();

        embed.addField("Name: ", command.name);

        if (command.description) {
            embed.addField("Description:", command.description);
        }

        if (command.syntax) {
            embed.addField("Syntax:", command.syntax);
        }

        if (command.aliases.length !== 0) {
            let aliasText = "";

            command.aliases.forEach((x) => aliasText = `${aliasText}${x}\n`);

            embed.addField("Aliases:", aliasText);
        }

        if (command.category) {
            embed.addField("Category:", command.category.toString());
        }

        embed.setColor("#00ff00");

        return embed;
    }
}
