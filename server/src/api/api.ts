import { usersApi } from './users';
import { itemsApi } from './items';
import { authApi } from './auth';
import { commentsApi } from './comments';
import { adminApi } from './admin';
import { yearsApi } from './years';

export const api = {
	users:    usersApi,
	items:    itemsApi,
	auth:     authApi,
	comments: commentsApi,
	admin:    adminApi,
	years:    yearsApi,
};
