import { readFileSync } from 'node:fs'
import { parseLine } from './parse.js'
import { formatIngredient } from './format.js'

interface Args {
  file?: string
  scale: number
}

function parseArgs(argv: string[]): Args {
  let file: string | undefined
  let scale = 1

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '--scale' || arg === '-s') {
      const value = argv[++i]
      const parsed = Number(value)
      if (!Number.isFinite(parsed) || parsed <= 0) {
        throw new Error(`invalid scale value: ${value}`)
      }
      scale = parsed
    } else if (arg.startsWith('-')) {
      throw new Error(`unknown flag: ${arg}`)
    } else {
      file = arg
    }
  }

  return { file, scale }
}

// fd 0 is stdin; reading it directly (rather than via readline) is enough
// for a line-oriented format and keeps this dependency-free.
function readInput(file: string | undefined): string {
  return readFileSync(file ?? 0, 'utf8')
}

function main(): void {
  const { file, scale } = parseArgs(process.argv.slice(2))
  const text = readInput(file)

  for (const line of text.split('\n')) {
    const formatted = formatIngredient(parseLine(line), scale)
    if (formatted.length > 0) console.log(formatted)
  }
}

main()
