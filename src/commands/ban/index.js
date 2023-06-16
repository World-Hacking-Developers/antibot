import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js"
import { cache } from "../../eventHandlers/guildMemberAdd.js"
import { db } from "../../util/database/index.js"
import { getMembers, parseRegex } from "../../util/index.js"

const data = new SlashCommandBuilder()
  .setName("ban")
  .setDescription("Ban multiple members at once")
  .addStringOption(option =>
    option.setName("regex").setDescription("Regular expression to match for ban")
  )
  .addUserOption(option => option.setName("user").setDescription("User or id to ban"))
  .addStringOption(option => option.setName("reason").setDescription("Reason for the ban"))
  .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
  .setDMPermission(false)

const execute = async interaction => {
  const toBan = []
  const user = interaction.options.getUser("user")
  if (user) toBan.push(user)
  const userExp = interaction.options.getString("regex")
  if (userExp) {
    const expression = parseRegex(userExp)
    const members = await getMembers({
      guild: interaction.guild,
      filter: user => user?.user?.username?.match(expression) || user?.nickname?.match(expression),
    })
    toBan.push(...members.map(({ user }) => user))
    if (interaction.guild.id in cache) cache[interaction.guild.id].push(expression)
    // No need to wait for this
    db.ban.create({ data: { serverid: interaction.guild.id, expression: expression.source } })
  }
  if (!toBan.length || toBan.length > 10) return interaction.reply("No matching users.")
  const reason = interaction.options.getString("reason")
  for (let user of toBan) await user.ban({ reason, deleteMessageSeconds: 604800 })
  await interaction.reply("Banned: " + toBan.map(user => `${user}`).join(", "))
}

export default { data, execute }
