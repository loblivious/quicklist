import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  NgModule,
  Output,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Checklist } from '../../shared/interfaces/checcklist';

@Component({
  selector: 'app-checklist-list',
  template: `
    <ion-list lines="none">
      <ion-item-sliding
        *ngFor="let checklist of checklists; trackBy: trackByFn"
      >
        <ion-item
          color="light"
          button
          routerLink="/checklist/{{ checklist.id }}"
          routerDirection="forward"
        >
          <ion-label>{{ checklist.title }}</ion-label>
        </ion-item>

        <ion-item-options side="end">
          <ion-item-option color="light" (click)="edit.emit(checklist)">
            <ion-icon name="pencil-outline" slot="icon-only"></ion-icon>
          </ion-item-option>
          <ion-item-option color="danger" (click)="delete.emit(checklist.id)">
            <ion-icon name="trash" slot="icon-only"></ion-icon>
          </ion-item-option>
        </ion-item-options>
      </ion-item-sliding>
    </ion-list>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChecklistListComponent {
  @Input() checklists: Checklist[] = [];
  @Output() delete = new EventEmitter<string>();
  @Output() edit = new EventEmitter<Checklist>();

  trackByFn(index: number, checklist: Checklist) {
    return checklist.id;
  }
}

@NgModule({
  declarations: [ChecklistListComponent],
  imports: [CommonModule, IonicModule, RouterModule],
  exports: [ChecklistListComponent],
})
export class ChecklistListComponentModule {}
