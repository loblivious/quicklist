import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  NgModule,
  Output,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ChecklistItem } from 'src/app/shared/interfaces/checklist-item';

@Component({
  selector: 'app-checklist-item-list',
  template: `
    <ion-list lines="none">
      <ion-item-sliding *ngFor="let item of checklistItems; trackBy: trackByFn">
        <ion-item color="light">
          <ion-checkbox
            color="light"
            [checked]="item.checked"
            justify="space-between"
            (ionChange)="toggle.emit(item.id)"
          >
            {{ item.title }}
          </ion-checkbox>
        </ion-item>

        <ion-item-options side="end">
          <ion-item-option color="light" (click)="edit.emit(item)">
            <ion-icon name="pencil-outline" slot="icon-only"></ion-icon>
          </ion-item-option>
          <ion-item-option color="danger" (click)="delete.emit(item.id)">
            <ion-icon name="trash" slot="icon-only"></ion-icon>
          </ion-item-option>
        </ion-item-options>
      </ion-item-sliding>
    </ion-list>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChecklistItemListComponent {
  @Input() checklistItems: ChecklistItem[] = [];
  @Output() toggle = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();
  @Output() edit = new EventEmitter<ChecklistItem>();

  trackByFn(index: number, item: ChecklistItem) {
    return item.id;
  }
}

@NgModule({
  declarations: [ChecklistItemListComponent],
  imports: [CommonModule, IonicModule],
  exports: [ChecklistItemListComponent],
})
export class ChecklistItemListComponentModule {}
