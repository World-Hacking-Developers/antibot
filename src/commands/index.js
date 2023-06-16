import { Collection } from "discord.js"
import ping from "./ping/index.js"
import format from "./format/index.js"
import ban from "./ban/index.js"
import kick from "./kick/index.js"
import match from "./match/index.js"

// Explicitely list commands
const rawCommands = [ping, format, ban, kick, match]
const slashCommands = new Collection()
const commands = []

// ---- Register slash-commands and text-based commands ----
rawCommands.forEach(command => {
  slashCommands.set(command.data.name, command)
  if (!command.onlyText) commands.push(command.data)
})

export { commands, slashCommands }
