import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  NgModule,
  ViewChild,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { IonContent, IonRouterOutlet, IonicModule } from '@ionic/angular';
import {
  BehaviorSubject,
  combineLatest,
  filter,
  map,
  switchMap,
  tap,
} from 'rxjs';
import { ChecklistService } from '../shared/data-access/checklist.service';
import { Checklist } from '../shared/interfaces/checcklist';
import { ChecklistItem } from '../shared/interfaces/checklist-item';
import { FormModalComponentModule } from '../shared/ui/form-modal.component';
import { ChecklistItemService } from './data-access/checklist-item.service';
import { ChecklistItemListComponentModule } from './ui/checklist-item-list.component';

@Component({
  selector: 'app-checklist',
  template: `
    <ng-container *ngIf="vm$ | async as vm">
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-back-button defaultHref="/"></ion-back-button>
          </ion-buttons>
          <ion-title>
            {{ vm.checklist.title }}
          </ion-title>
          <ion-buttons slot="end">
            <ion-button (click)="resetChecklistItems(vm.checklist.id)">
              <ion-icon name="refresh" slot="icon-only"></ion-icon>
            </ion-button>
            <ion-button (click)="formModalIsOpen$.next(true)">
              <ion-icon name="add" slot="icon-only"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>

      <ion-content>
        <app-checklist-item-list
          [checklistItems]="vm.items"
          (toggle)="toggleChecklistItem($event)"
          (delete)="deleteChecklistItem($event)"
          (edit)="openEditModal($event)"
        ></app-checklist-item-list>
        <ion-modal
          [isOpen]="vm.formModalIsOpen"
          [canDismiss]="true"
          (ionModalDidDismiss)="
            checklistItemIdBeingEdited$.next(null); formModalIsOpen$.next(false)
          "
          [presentingElement]="routerOutlet.nativeEl"
        >
          <ng-template>
            <app-form-modal
              [title]="
                vm.checklistItemIdBeingEdited ? 'Edit item' : 'Create item'
              "
              [formGroup]="checklistItemForm"
              (save)="
                vm.checklistItemIdBeingEdited
                  ? editChecklistItem(vm.checklistItemIdBeingEdited)
                  : addChecklistItem(vm.checklist.id)
              "
            ></app-form-modal>
          </ng-template>
        </ion-modal>
      </ion-content>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChecklistComponent {
  checklistAndItems$ = this.route.paramMap.pipe(
    switchMap((paramMap) =>
      combineLatest([
        this.checklistService
          .getChecklistById(paramMap.get('id') as string)
          .pipe(filter((checklist): checklist is Checklist => !!checklist)),
        this.checklistItemService
          .getItemsByChecklistId(paramMap.get('id') as string)
          .pipe(
            tap(() => setTimeout(() => this.ionContent.scrollToBottom(200), 0))
          ),
      ])
    )
  );

  formModalIsOpen$ = new BehaviorSubject<boolean>(false);
  checklistItemIdBeingEdited$ = new BehaviorSubject<string | null>(null);

  vm$ = combineLatest([
    this.checklistAndItems$,
    this.formModalIsOpen$,
    this.checklistItemIdBeingEdited$,
  ]).pipe(
    map(
      ([[checklist, items], formModalIsOpen, checklistItemIdBeingEdited]) => ({
        checklist,
        items,
        formModalIsOpen,
        checklistItemIdBeingEdited,
      })
    )
  );

  checklistItemForm = this.fb.nonNullable.group({
    title: ['', Validators.required],
  });

  @ViewChild(IonContent) ionContent!: IonContent;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private checklistService: ChecklistService,
    private checklistItemService: ChecklistItemService,
    public routerOutlet: IonRouterOutlet
  ) {}

  addChecklistItem(checklistId: string) {
    this.checklistItemService.add(
      this.checklistItemForm.getRawValue(),
      checklistId
    );
  }

  toggleChecklistItem(itemId: string) {
    this.checklistItemService.toggle(itemId);
  }

  resetChecklistItems(checklistId: string) {
    this.checklistItemService.reset(checklistId);
  }

  deleteChecklistItem(id: string) {
    this.checklistItemService.remove(id);
  }

  editChecklistItem(id: string) {
    this.checklistItemService.update(id, this.checklistItemForm.getRawValue());
  }

  openEditModal(checklistItem: ChecklistItem) {
    this.checklistItemForm.patchValue({ title: checklistItem.title });
    this.checklistItemIdBeingEdited$.next(checklistItem.id);
    this.formModalIsOpen$.next(true);
  }
}

@NgModule({
  declarations: [ChecklistComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormModalComponentModule,
    ChecklistItemListComponentModule,
    RouterModule.forChild([
      {
        path: '',
        component: ChecklistComponent,
      },
    ]),
  ],
})
export class ChecklistComponentModule {}
