import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';


@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {
  constructor(private router: Router, private cookieService: CookieService) {}

  canActivate(): boolean {
    const tokenExists = this.cookieService.check('TOKENS');
    if (tokenExists) {
      this.router.navigate(['/tasks']);
      return false;
    }
    return true;
  }
}