import * as dotenv from "dotenv"
import { REST, Routes } from "discord.js"
import { commands } from "./src/commands/index.js"
console.log(commands)

dotenv.config()

const token = process.env.DISCORD_TOKEN
const rest = new REST({ version: "10" }).setToken(token)
const init = async () => {
  try {
    console.log(`Refreshing ${commands.length} slash commands...`)
    console.log("Body", commands)
    const data = await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENTID), {
      body: commands,
    })
    console.log(`Refreshed ${data.length} slash commands.`)
  } catch (error) {
    console.error(error)
  }
}

init()
