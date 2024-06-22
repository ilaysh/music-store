import { HttpHandlerFn, HttpRequest } from '@angular/common/http';

export function authInterceptor(request: HttpRequest<unknown>,
  next: HttpHandlerFn) {
  // See : https://developer.spotify.com/documentation/web-api/concepts/authorization

  if (!window || !window.localStorage) {
    return next(request);

  } else {
    const token = window.localStorage.getItem('spotifyToken')
    if (!request.headers.has('Authorization')) {
      const clonedRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next(clonedRequest)
    }
    else
      return next(request);
  }
}