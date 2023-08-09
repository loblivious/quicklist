import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { filter, map, switchMap, tap } from 'rxjs';
import { Checklist } from '../interfaces/checcklist';
import { ChecklistItemService } from './../../checklist/data-access/checklist-item.service';
import { AddChecklist } from './../interfaces/checcklist';
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

  update = this.updater(
    (state, args: { id: string; editedData: AddChecklist }) => ({
      ...state,
      checklists: [
        ...state.checklists.map((checklist) =>
          checklist.id === args.id
            ? { ...checklist, title: args.editedData.title }
            : checklist
        ),
      ],
    })
  );

  constructor(
    private storageService: StorageService,
    private checklistItemService: ChecklistItemService
  ) {
    super({ checklists: [] });
  }

  getChecklists() {
    return this.checklists$;
  }

  getChecklistById(id: string) {
    return this.checklists$.pipe(
      filter((checklists) => checklists.length > 0), // don't emit if checklists haven't loaded yet
      map((checklists) => checklists.find((checklist) => checklist.id === id))
    );
  }

  generateSlug(title: string) {
    let slug = title.toLowerCase().replace(/\s+/g, '-');

    const matchingSlugs = this.get().checklists.find(
      (checklist) => checklist.id === slug
    );

    if (matchingSlugs) {
      slug += Date.now.toString();
    }

    return slug;
  }
}
