import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import {
  AddChecklistItem,
  ChecklistItem,
} from 'src/app/shared/interfaces/checklist-item';

@Injectable({
  providedIn: 'root',
})
export class ChecklistItemService {
  checklistItems$ = new BehaviorSubject<ChecklistItem[]>([]);

  getItemsByChecklistId(checklistId: string) {
    return this.checklistItems$.pipe(
      map((items) => items.filter((item) => item.checklistId === checklistId))
    );
  }

  add(item: AddChecklistItem, checklistId: string) {
    const newItem = {
      id: Date.now().toString(),
      checklistId,
      checked: false,
      ...item,
    };

    this.checklistItems$.next([...this.checklistItems$.value, newItem]);
  }

  toggle(itemId: string) {
    const newItems = this.checklistItems$.value.map((item) =>
      item.id === itemId ? { ...item, checked: !item.checked } : item
    );

    this.checklistItems$.next(newItems);
  }

  reset(checklistId: string) {
    const newItems = this.checklistItems$.value.map((item) =>
      item.checklistId === checklistId ? { ...item, checked: false } : item
    );

    this.checklistItems$.next(newItems);
  }
}
