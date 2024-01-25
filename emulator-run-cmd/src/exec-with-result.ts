import { exec } from '@actions/exec'
import { ExecOptions } from '@actions/exec/lib/interfaces'

export default async function execWithResult(commandLine: string, args?: string[], options?: ExecOptions): Promise<Result> {

  let result: Result = new Result()
  let commands = commandLine.replace( /&& \\\n/m, '&& ' ).split("\n");
  for (const command of commands) {
    let exitCode = await exec.exec('bash', ['-c', command], options);

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
