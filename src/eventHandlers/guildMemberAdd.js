import { db } from "../util/database/index.js"
import { parseRegex } from "../util/index.js"

export const cache = {}

const handleNewMember = async member => {
  // Get the data from the db if it's not in cache already
  if (!(member.guild.id in cache))
    cache[member.guild.id] = (
      await db.ban.findMany({
        select: {
          expression: true,
        },
        where: {
          serverid: member.guild.id,
        },
      })
    )?.map(({ expression }) => parseRegex(expression))

  // Match the user vs every banned expression
  if (
    cache[member.guild.id]?.some(
      regex => member.nickname?.match(regex) || member.user?.username?.match(regex)
    )
  )
    return await member.ban({
      deleteMessageSeconds: 604800,
      reason: "User matches spam-prevention autoban system.",
    })
}

export default handleNewMember
