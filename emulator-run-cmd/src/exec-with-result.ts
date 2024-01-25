import { exec } from '@actions/exec'
import { ExecOptions } from '@actions/exec/lib/interfaces'

export default async function execWithResult(commandLine: string, args?: string[], options?: ExecOptions): Promise<Result> {

  const commands: Array<string> = commandLine
    .trim()
    .split(/\r\n|\n|\r/)
    .map((value: string) => value.trim())
    .filter((value: string) => {
      return !value.startsWith('#') && value.length > 0;
  });

  console.log({commands})

  let result: Result = new Result()
  
  for (const command of commands) {
    let exitCode = await exec(command);

    result.stdout += result.stdout.trim()
    result.stderr += result.stderr.trim()
    result.exitCode = exitCode

    if (exitCode !== 0) {
      // If a command fails, break the loop and return the result
      break;
    }  
  }

  return result
}

export async function execIgnoreFailure(commandLine: string, args?: string[], options?: ExecOptions): Promise<string> {
  let result = await execWithResult(commandLine, args, options);
  return result.stdout
}

export class Result {
  exitCode: number = 0;
  stdout: string = '';
  stderr: string = '';
}
