import app from "../index";
import ICommand from "../model/command";

const commandDatabase = new Map<string, ICommand>();

const seperator = " | ";
const prefix = "!";

app.on("message", async (message) => {
    if (message.content.startsWith(prefix)) {
        const args = message.content.substr(1).split(seperator);

        if (args.length > 0) {
            const command = commandDatabase.get(args[0]);

            if (command !== undefined) {
                await command.execute(message, args.slice(0, args.length - 1));
            }
        }
    }
});

export async function registerCommand(command: ICommand) {
    commandDatabase.set(command.name, command);
}
