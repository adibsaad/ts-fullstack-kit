export const simpleProgressOptions = isProduction => {
  let lastProgressMsg: string | null = null
  const progressOptions: {
    handler?: (percentage: number, msg: string, ...args: string[]) => void
  } = {}
  if (isProduction) {
    progressOptions.handler = (
      percentage: number,
      message: string,
      ...args
    ) => {
      // e.g. Output each progress message directly to the console:
      if (message && lastProgressMsg !== message) {
        lastProgressMsg = message
        console.log(`${Math.floor(percentage * 100)}%`, message, ...args)
      }
    }
  }
  return progressOptions
}
