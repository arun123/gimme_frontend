import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent implements OnInit {

    public message: string;

    constructor(
        public dialogRef: MatDialogRef<ConfirmationDialogComponent>
    ) { 
    }

    ngOnInit() {
        this.message = 'Are you sure you want to continue with this action?';
    }

    close(): void {
        this.dialogRef.close(false);
    }

    proceed(): void {
        this.dialogRef.close(true);
    }

}
