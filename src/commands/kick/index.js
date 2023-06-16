import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js"
import { getMembers, parseRegex } from "../../util/index.js"

const data = new SlashCommandBuilder()
  .setName("kick")
  .setDescription("Kick multiple members at once")
  .addStringOption(option =>
    option.setName("regex").setDescription("Regular expression to match for kick")
  )
  .addUserOption(option => option.setName("user").setDescription("User or id to kick"))
  .addStringOption(option => option.setName("reason").setDescription("Reason for the kick"))
  .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
  .setDMPermission(false)

const execute = async interaction => {
  const toKick = []
  const user = interaction.options.getUser("user")
  if (user) toKick.push(user)
  const userExp = interaction.options.getString("regex")
  if (userExp) {
    const expression = parseRegex(userExp)
    const members = await getMembers({
      guild: interaction.guild,
      filter: user => user?.user?.username?.match(expression) || user?.nickname?.match(expression),
    })
    toKick.push(...members.map(({ user }) => user))
  }
  if (!toKick.length || toKick.length > 10) return interaction.reply("No matching users.")
  const reason = interaction.options.getString("reason")
  for (let user of toKick) await user.kick(reason)
  await interaction.reply("Kicked: " + toKick.map(user => `${user}`).join(", "))
}

export default { data, execute }
