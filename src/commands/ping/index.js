import { SlashCommandBuilder } from "discord.js"

const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Replies with Pong!")
  .setDMPermission(false)

const execute = async interaction => {
  await interaction.reply("Pong!")
}

export default { data, execute }
