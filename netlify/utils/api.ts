
// This would interact with the 'error_logs' table in a real scenario.
// For now, it logs to the console for demonstration.
async function logError(context: string, error: unknown) {
  const message = error instanceof Error ? error.message : 'An unknown error occurred.';
  const stack = error instanceof Error ? error.stack : undefined;
  
  console.error(`[ERROR] Context: ${context}`, {
    message,
    stack,
    timestamp: new Date().toISOString(),
  });

  // In a real implementation with a database:
  // await dbClient.insertInto('error_logs', {
  //   context,
  //   message,
  //   stack_trace: stack,
  // });
}

type NetlifyFunctionHandler = (request: Request) => Promise<Response>;

/**
 * A higher-order function to wrap Netlify function handlers with
 * centralized security headers and error logging.
 * @param handler The original Netlify function handler.
 * @returns A new handler with added protections.
 */
export function withApiProtection(handler: NetlifyFunctionHandler): NetlifyFunctionHandler {
  return async (request: Request) => {
    let response: Response;
    try {
      response = await handler(request);
    } catch (error) {
      // Extract function name from URL for context
      const functionName = new URL(request.url).pathname.split('/').pop() || 'unknown';
      await logError(`netlify-function:${functionName}`, error);
      
      response = new Response(
        JSON.stringify({ success: false, error: 'An internal server error occurred.' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Apply security headers to all responses
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');

    return response;
  };
}
