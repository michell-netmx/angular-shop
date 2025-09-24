import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-dashboard-admin-page',
  imports: [],
  templateUrl: './dashboard-admin-page.component.html',
})
export class DashboardAdminPageComponent {

  isDark = signal(false);

  getTheme() {
    if (localStorage.getItem('dark')) {
      return JSON.parse(localStorage.getItem('dark')!)
    }

    const isDark = !!window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    this.setTheme(isDark);
    return isDark;
  }

  toggleTheme() {
    this.isDark.set(!this.isDark);
    this.setTheme(this.isDark());
  }

  setTheme (value: boolean) {
    this.isDark.set(value);
    localStorage.setItem('dark', value.toString());
  }
}
