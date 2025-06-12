import { Command } from 'commander'

const program = new Command()

program.name('cli').version('0.1.0')

const cmd1 = program.command('cmd1').description('command 1')

cmd1
  .command('subcmd1')
  .description('subcommand 1')
  .action(() => {
    console.log('subcommand 1')
  })

await program.parseAsync()
process.exit(0)
