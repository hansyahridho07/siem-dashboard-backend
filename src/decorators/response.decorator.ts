import { Request, Response, NextFunction } from 'express';

/**
 * Method decorator that intercepts controller returns, wraps them in a success JSON structure,
 * and passes any thrown error to Express next() handler.
 * 
 * @param message The success message to include in the response.
 * @param statusCode The HTTP status code (defaults to 200).
 */
export function Success(message: string, statusCode: number = 200) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (req: Request, res: Response, next: NextFunction) {
      try {
        // Execute the controller method with controller's context
        const result = await originalMethod.apply(this, [req, res, next]);
        
        // If response is already sent, do nothing
        if (res.headersSent) return;

        // Extract metadata if returned in service payload (e.g., pagination info)
        const hasMeta = result && typeof result === 'object' && 'meta' in result;
        const hasData = result && typeof result === 'object' && 'data' in result;

        const meta = hasMeta ? result.meta : undefined;
        const data = hasData ? result.data : result;

        return res.status(statusCode).json({
          success: true,
          message,
          ...(meta ? { meta } : {}),
          data: data !== undefined ? data : null,
        });
      } catch (error) {
        next(error);
      }
    };

    return descriptor;
  };
}

/**
 * Method decorator that sends the raw object returned by the controller method
 * directly as the HTTP response payload.
 * 
 * If the returned object has a `_status` property, it will be used as the HTTP status code.
 * 
 * @param defaultStatusCode The default HTTP status code (defaults to 200).
 */
export function CustomResponse(defaultStatusCode: number = 200) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (req: Request, res: Response, next: NextFunction) {
      try {
        const result = await originalMethod.apply(this, [req, res, next]);
        
        if (res.headersSent) return;

        let statusCode = defaultStatusCode;
        const responseData = { ...result };

        if (responseData && typeof responseData === 'object' && '_status' in responseData) {
          statusCode = responseData._status;
          delete responseData._status;
        }

        return res.status(statusCode).json(responseData);
      } catch (error) {
        next(error);
      }
    };

    return descriptor;
  };
}
