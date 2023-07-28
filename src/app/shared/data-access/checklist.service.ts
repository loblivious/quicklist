import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, map, take } from 'rxjs';
import { Checklist } from '../interfaces/checcklist';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class ChecklistService {
  private checklists$ = new BehaviorSubject<Checklist[]>([]);

  constructor(private storageService: StorageService) {}

  load() {
    this.storageService.loadChecklists$
      .pipe(take(1))
      .subscribe((checklists) => {
        this.checklists$.next(checklists);
      });
  }

  getChecklists() {
    return this.checklists$.asObservable();
  }

  getChecklistById(id: string) {
    return this.getChecklists().pipe(
      filter((checklists) => checklists.length > 0),
      map((checklists) => checklists.find((checklist) => checklist.id === id))
    );
  }

  add(checklist: Pick<Checklist, 'title'>) {
    const newChecklist = {
      ...checklist,
      id: this.generateSlug(checklist.title),
    };

    this.checklists$.next([...this.checklists$.value, newChecklist]);
  }

  generateSlug(title: string) {
    let slug = title.toLowerCase().replace(/\s+/g, '-');

    const matchingSlugs = this.checklists$.value.find(
      (checklist) => checklist.id === slug
    );

    if (matchingSlugs) {
      slug += Date.now.toString();
    }

    return slug;
  }
}
