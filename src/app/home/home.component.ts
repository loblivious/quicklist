import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  NgModule,
  ViewChild,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  AlertController,
  IonContent,
  IonRouterOutlet,
  IonicModule,
} from '@ionic/angular';
import { BehaviorSubject, tap } from 'rxjs';
import { ChecklistService } from '../shared/data-access/checklist.service';
import { Checklist } from '../shared/interfaces/checcklist';
import { FormModalComponentModule } from './../shared/ui/form-modal.component';
import { ChecklistListComponentModule } from './ui/checklist-list.component';

@Component({
  selector: 'app-home',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Home</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="formModalIsOpen$.next(true)">
            <ion-icon name="add" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <app-checklist-list
        *ngIf="checklists$ | async as checklists"
        [checklists]="checklists"
        (delete)="deleteChecklist($event)"
        (edit)="openEditModal($event)"
      ></app-checklist-list>

      <ion-modal
        *ngIf="{
          checklistIdBeingEdited: checklistIdBeingEdited$ | async,
          isOpen: formModalIsOpen$ | async
        } as vm"
        [isOpen]="vm.isOpen"
        [canDismiss]="true"
        (ionModalDidDismiss)="
          formModalIsOpen$.next(false); checklistIdBeingEdited$.next(null)
        "
        [presentingElement]="routerOutlet.nativeEl"
      >
        <ng-template>
          <app-form-modal
            [title]="
              vm.checklistIdBeingEdited ? 'Edit checklist' : 'Create checklist'
            "
            [formGroup]="checklistForm"
            (save)="
              vm.checklistIdBeingEdited
                ? editChecklist(vm.checklistIdBeingEdited)
                : addChecklist()
            "
          ></app-form-modal>
        </ng-template>
      </ion-modal>
    </ion-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  formModalIsOpen$ = new BehaviorSubject<boolean>(false);
  checklistIdBeingEdited$ = new BehaviorSubject<string | null>(null);

  checklists$ = this.checklistService.getChecklists().pipe(
    tap(() => {
      setTimeout(() => {
        this.ionContent.scrollToBottom(200);
      }, 0);
    })
  );

  checklistForm = this.fb.nonNullable.group({
    title: ['', Validators.required],
  });

  @ViewChild(IonContent) ionContent!: IonContent;

  constructor(
    private fb: FormBuilder,
    private checklistService: ChecklistService,
    public routerOutlet: IonRouterOutlet,
    private alertControl: AlertController
  ) {}

  addChecklist() {
    this.checklistService.add(this.checklistForm.getRawValue());
  }

  async deleteChecklist(id: string) {
    const alert = await this.alertControl.create({
      header: 'Are you sure?',
      subHeader: 'This will also delete all of the items for this checklist',
      buttons: [
        {
          text: 'Delete',
          cssClass: 'confirm-delete-button',
          role: 'destructive',
          handler: () => {
            this.checklistService.remove(id);
          },
        },
        {
          text: 'Cancel',
          cssClass: 'cancel-delete-button',
          role: 'cancel',
        },
      ],
    });
    alert.present();
  }

  editChecklist(id: string) {
    this.checklistService.update(id, this.checklistForm.getRawValue());
  }

  openEditModal(checklist: Checklist) {
    this.checklistForm.patchValue({ title: checklist.title });
    this.checklistIdBeingEdited$.next(checklist.id);
    this.formModalIsOpen$.next(true);
  }
}

@NgModule({
  declarations: [HomeComponent],
  imports: [
    IonicModule,
    CommonModule,
    FormModalComponentModule,
    ChecklistListComponentModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomeComponent,
      },
    ]),
  ],
})
export class HomeComponentModule {}
