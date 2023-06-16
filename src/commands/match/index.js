import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js"
import { getMembers, parseRegex } from "../../util/index.js"

const data = new SlashCommandBuilder()
  .setName("match")
  .setDescription("Find members whose username or nickname match the expression")
  .addStringOption(option =>
    option.setName("regex").setDescription("Regular expression to match against").setRequired(true)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
  .setDMPermission(false)

const execute = async interaction => {
  const found = []
  const userExp = interaction.options.getString("regex")
  const expression = parseRegex(userExp)
  const members = await getMembers({
    guild: interaction.guild,
    filter: user => user?.user?.username?.match(expression) || user?.nickname?.match(expression),
  })
  found.push(...members.map(({ user }) => user))
  if (!found.length) return await interaction.reply("No matching users.")
  await interaction.reply(
    `Matches for \`${expression}\`:\n\n` + found.map((user, i) => `${i + 1}. ${user}`).join("\n")
  )
}

export default { data, execute }
