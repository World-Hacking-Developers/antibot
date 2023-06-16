import {
  ContextMenuCommandBuilder,
  ApplicationCommandType,
  ModalBuilder,
  TextInputBuilder,
  ActionRowBuilder,
  TextInputStyle,
} from "discord.js"

const commandName = "Format code"

const data = new ContextMenuCommandBuilder()
  .setName(commandName)
  .setDMPermission(false)
  .setType(ApplicationCommandType.Message)

const execute = async (interaction, customParams) => {
  if (interaction.isMessageContextMenuCommand()) {
    // Handle command invocation
    const languageOption = new TextInputBuilder()
      .setCustomId("language")
      .setLabel("Language (optional)")
      .setStyle(TextInputStyle.Short)
      .setRequired(false)
    const actionRow = new ActionRowBuilder().addComponents(languageOption)
    const modal = new ModalBuilder()
      .setCustomId(`${commandName}:${interaction.targetId}`)
      .setTitle("Formatting menu")
      .addComponents(actionRow)
    return await interaction.showModal(modal)
  }
  // Handle language selection via modal
  const language = interaction.fields.getTextInputValue("language") || ""
  const message = await interaction.channel.messages.fetch(customParams[1])
  const messageContent = message.content?.replaceAll("```", "\\`\\`\\`") || ""
  const formatted = `⤷ ${message.author} wrote
\`\`\`${messageContent ? language : ""}
${messageContent}
\`\`\``
  await interaction.reply(formatted)
}

export default { data, execute }
