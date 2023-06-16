import { db } from "./src/util/database/index.js"
import { parseRegex } from "./src/util/index.js"

const read = async () => {
  const resp = await db.ban.findMany({
    select: {
      expression: true,
    },
    where: {
      serverid: "740195456566558781",
    },
  })
  console.log(resp)
}

const write = async () => {
  const expression = "/.*?[qwrtpsdfghjklzxcvbnm]{4,}.*?d{3,}$/i"
  const resp = await db.ban.create({
    data: {
      serverid: "740195456566558781",
      expression: parseRegex(expression).source,
    },
  })
}

// write()

read()
