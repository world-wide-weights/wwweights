import {
  Injectable,
  Logger,
  NestMiddleware,
  NotFoundException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/**
 * @description Middleware used for hiding all non image files by blocking corresponding requests 
 */
@Injectable()
export class ServeFileTypeMiddleware implements NestMiddleware {
  private logger = new Logger(ServeFileTypeMiddleware.name);
  // Only allow png and jp(e)g files. Other resources should not be requested.
  use(req: Request, _: Response, next: NextFunction) {
    // Is the requested file an image? If no throw an error => Image backend only serves images and coffee
    if (!req.path.match(/\/([^\/]+)\.(jpg|jpeg|png)$/i)) {
      this.logger.warn(
        `A file with a forbidden file type was requested (${req.path})`,
      );
      throw new NotFoundException(req.path);
    }
    next();
  }
}
