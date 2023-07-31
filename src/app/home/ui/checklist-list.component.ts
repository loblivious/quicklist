import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  NgModule,
  Output,
  ViewChild,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonList, IonicModule } from '@ionic/angular';
import { Checklist } from '../../shared/interfaces/checcklist';

@Component({
  selector: 'app-checklist-list',
  template: `
    <ion-list lines="none">
      <ion-item-sliding
        *ngFor="let checklist of checklists; trackBy: trackByFn"
      >
        <ion-item
          color="primary"
          button
          routerLink="/checklist/{{ checklist.id }}"
          routerDirection="forward"
        >
          <ion-label>{{ checklist.title }}</ion-label>
        </ion-item>

        <ion-item-options side="end">
          <ion-item-option
            color="light"
            (click)="edit.emit(checklist); closeItems()"
          >
            <ion-icon name="pencil-outline" slot="icon-only"></ion-icon>
          </ion-item-option>
          <ion-item-option
            color="danger"
            (click)="delete.emit(checklist.id); closeItems()"
          >
            <ion-icon name="trash" slot="icon-only"></ion-icon>
          </ion-item-option>
        </ion-item-options>
      </ion-item-sliding>

      <ion-card *ngIf="checklists.length === 0">
        <ion-card-header>
          <h2>Welcome!</h2>
        </ion-card-header>
        <ion-card-content>
          <p>Click the add button to create your first quicklist</p>
        </ion-card-content>
      </ion-card>
    </ion-list>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChecklistListComponent {
  @Input() checklists: Checklist[] = [];
  @Output() delete = new EventEmitter<string>();
  @Output() edit = new EventEmitter<Checklist>();
  @ViewChild(IonList) checklistList!: IonList;

  trackByFn(index: number, checklist: Checklist) {
    return checklist.id;
  }

  async closeItems() {
    await this.checklistList.closeSlidingItems();
  }
}

@NgModule({
  declarations: [ChecklistListComponent],
  imports: [CommonModule, IonicModule, RouterModule],
  exports: [ChecklistListComponent],
})
export class ChecklistListComponentModule {}
