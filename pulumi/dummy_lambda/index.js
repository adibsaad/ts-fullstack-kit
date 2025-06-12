/* eslint-env node */
// eslint-disable-next-line @typescript-eslint/require-await
exports.handler = async function (_event, _context) {
  return {
    statusCode: 200,
    body: 'Hello world!',
  }
}
