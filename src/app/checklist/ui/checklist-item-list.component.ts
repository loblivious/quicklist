import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ChecklistItem } from 'src/app/shared/interfaces/checklist-item';

@Component({
  selector: 'app-checklist-item-list',
  template: `
    <ion-list lines="none">
      <ion-item *ngFor="let item of checklistItems; trackBy: trackByFn">
        <ion-label>{{ item.title }}</ion-label>
      </ion-item>
    </ion-list>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChecklistItemListComponent {
  @Input() checklistItems: ChecklistItem[] = [];

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
