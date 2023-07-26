import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-home',
  template: `
    <ion-header>
      <ion-toolbar></ion-toolbar>
    </ion-header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {}

@NgModule({
  declarations: [HomeComponent],
  imports: [IonicModule, CommonModule],
})
export class HomeComponentModule {}
