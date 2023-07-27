import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Checklist } from '../interfaces/checcklist';

@Component({
  selector: 'app-checklist-list',
  template: `
    <ion-list lines="none">
      <ion-item *ngFor="let checklist of checklists; trackBy: trackByFn">
        <ion-label>{{ checklist.title }}</ion-label>
      </ion-item>
    </ion-list>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChecklistListComponent {
  @Input() checklists: Checklist[] = [];

  trackByFn(index: number, checklist: Checklist) {
    return checklist.id;
  }
}

@NgModule({
  declarations: [ChecklistListComponent],
  imports: [CommonModule, IonicModule],
  exports: [ChecklistListComponent],
})
export class ChecklistListComponentModule {}
