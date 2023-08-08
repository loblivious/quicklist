import { AddChecklist } from './../interfaces/checcklist';
import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import {
  BehaviorSubject,
  Observable,
  filter,
  map,
  shareReplay,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { AddChecklist, Checklist } from '../interfaces/checcklist';
import { ChecklistItemService } from './../../checklist/data-access/checklist-item.service';
import { StorageService } from './storage.service';

interface ChecklistState {
  checklists: Checklist[];
}

@Injectable({
  providedIn: 'root',
})
export class ChecklistService extends ComponentStore<ChecklistState> {
  // selectors
  checklists$ = this.select((state) => state.checklists).pipe(
    tap((checklists) => this.storageService.saveChecklists(checklists))
  );

  //effects
  load = this.effect(($) =>
    $.pipe(
      switchMap(() =>
        this.storageService.loadChecklists$.pipe(
          tap((checklists) => {
            this.patchState({ checklists });
          })
        )
      )
    )
  );

  //updaters
  add = this.updater((state, checklist: AddChecklist) => ({
    ...state,
    checklists: [
      ...state.checklists,
      {
        ...checklist,
        id: this.generateSlug(checklist.title),
      },
    ],
  }));

  remove = this.updater((state, id: string) => {
    this.checklistItemService.removeAllItemsForChecklist(id);
    return {
      ...state,
      checklists: [
        ...state.checklists.filter((checklist) => checklist.id !== id),
      ],
    };
  });

  // pipe will convert behavior subject into observable, so we need to make a
  // new observable to keep ultilizing behavior subject's next()
  private sharedChecklists$: Observable<Checklist[]> = this.checklists$.pipe(
    tap((checklists) => this.storageService.saveChecklists(checklists)),
    shareReplay(1)
  );

  constructor(
    private storageService: StorageService,
    private checklistItemService: ChecklistItemService
  ) {
    super({ checklists: [] });
  }

  getChecklists() {
    return this.sharedChecklists$;
  }

  getChecklistById(id: string) {
    return this.getChecklists().pipe(
      filter((checklists) => checklists.length > 0),
      map((checklists) => checklists.find((checklist) => checklist.id === id))
    );
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
