import { Component } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';
import * as moment from 'moment';

@Component({
    selector: 'app-utils',
    template: ``,
    styles: [``]
})

export class Utilities {
    constructor(
        private notify: NotificationsService
    ) {}

    notifySuccess(entity: string, action: string) {
        return this.notify.success("Success", `${entity} ${action} successfully!`, {
            timeOut: 3000,
            showProgressBar: true,
            pauseOnHover: true,
            clickToClose: false,
            clickIconToClose: true
        });
    }

    notifyError(errorMessage: string) {
        return this.notify.error("Error", errorMessage, {
            timeOut: 3000,
            showProgressBar: true,
            pauseOnHover: true,
            clickToClose: false,
            clickIconToClose: true
        });
    }

    notifyWarning(errorMessage: string) {
        return this.notify.warn("Warning", errorMessage, {
            timeOut: 3000,
            showProgressBar: true,
            pauseOnHover: true,
            clickToClose: false,
            clickIconToClose: true
        });
    }


    compareObjFn(objOne, objTwo) {
        if( objOne && objTwo ) {
            return objOne.id === objTwo.id;
        }
    }
}

export const DATE_FORMAT = {
    parse: {
      dateInput: ['LL', 'DD/ MM / GGGG']
    },
    display: {
      dateInput: 'DD / MM / GGGG',
      monthYearLabel: 'MMM YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM YYYY',
    },
};