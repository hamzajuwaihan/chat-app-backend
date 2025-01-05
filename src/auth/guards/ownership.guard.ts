import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class OwnershipGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.userId;
    const resourceId = Object.values(request.params)[0];
    console.log('userId', userId);
    console.log('resourceId', resourceId);

    if (!userId || !resourceId) {
      throw new ForbiddenException('Unauthorized access');
    }

    if (userId !== resourceId) {
      throw new ForbiddenException(
        'You do not have permission to modify this resource',
      );
    }

    return true;
  }
}
