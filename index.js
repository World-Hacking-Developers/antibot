import * as dotenv from "dotenv"
import { Client, GatewayIntentBits, Events } from "discord.js"
import { slashCommands } from "./src/commands/index.js"
import handleNewMember from "./src/eventHandlers/guildMemberAdd.js"
dotenv.config()
const token = process.env.DISCORD_TOKEN

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
})

// Set commands
client.commands = slashCommands

// Verify if we are live
client.once(Events.ClientReady, c => {
  console.log(`Ready! Logged in as ${c.user.tag}`)
})

// Handle commands
client.on(Events.InteractionCreate, async interaction => {
  if (
    !interaction.isChatInputCommand() &&
    !interaction.isMessageContextMenuCommand() &&
    !interaction.isModalSubmit()
  )
    return
  const customParams = interaction.customId?.split(":")
  const command = interaction.client.commands.get(
    customParams ? customParams[0] : interaction.commandName
  )
  if (!command)
    return console.error(`No command named ${interaction.commandName || customParams[0]} found.`)

  try {
    await command.execute(interaction, customParams)
  } catch (error) {
    console.error("Error executing slash command:", error)
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        ephemeral: true,
      })
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      })
    }
  }
})

client.on(Events.MessageCreate, async message => {
  if (message.author.bot) return
  // TODO: prevent bots here
})

client.on(Events.GuildMemberAdd, handleNewMember)

client.login(token)
