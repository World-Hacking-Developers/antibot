export const getMembers = async ({ guild, filter }) => {
  const members = await guild.members.fetch()
  if (filter) return members.filter(filter)
  return members
}

export const parseRegex = rawExpression => {
  const parsed = rawExpression.replace(/(^\/|\/[gim]*?$)/gi, "")
  return new RegExp(parsed, "i")
}
