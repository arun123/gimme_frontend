import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { RoleService } from '@shared/services/role.service';
import { Subject } from 'rxjs';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Role } from '@role/role.model';
import { Utilities } from '@shared/components/utilities.component';
import { accessList } from '@auth/models/access.list';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import { SelectionModel } from '@angular/cdk/collections';

interface AccessFlatNode {
    expandable: boolean;
    name: string;
    level: number;
}

interface AccessItemNode {
    name: string;
    displayName: string;
    children?: AccessItemNode[];
    crud?: AccessItemNode[];
}

@Component({
    selector: 'app-role-dialog',
    templateUrl: './role-dialog.component.html',
    styleUrls: ['./role-dialog.component.scss']
})
export class RoleDialogComponent implements OnInit {
    role: Role;
    roleForm: FormGroup;

    checklistSelection = new SelectionModel<AccessFlatNode>(true /* multiple */);

    private _transformer = (node: AccessItemNode, level: number) => {
        return {
            expandable: (!!node.children && node.children.length > 0) || (!!node.crud && node.crud.length > 0),
            name: node.name,
            displayName: node.displayName,
            level: level,
        };
    }

    treeControl = new FlatTreeControl<AccessFlatNode>(node => node.level, node => node.expandable);

    treeFlattener = new MatTreeFlattener(this._transformer, node => node.level, node => node.expandable, node => node.children || node.crud);

    dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    constructor(
        private dialogRef: MatDialogRef<RoleDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
        private fb: FormBuilder,
        private roleService: RoleService,
        private utilities: Utilities
    ) { 
        this.dataSource.data = accessList;
    }

    ngOnInit() {
        let name = '';
        let role = '';
        if( this.data.dialogType === 'Edit' && this.data.role ) {
            name = this.data.role.name;
            role = this.data.role.role;
            

            // add access list to selection
            this.dataSource._flattenedData.value.forEach((node, i) => {
                var accessList = Object.values(this.data.role.accessList);

                if(accessList.includes( node.name))
                {
                    this.checklistSelection.select(node);
                }
               // if( this.data.role.accessList.includes(node.name) ) {
                 //   this.checklistSelection.select(node);
               // }
            });
        }
        this.roleForm = new FormGroup({
            'name': new FormControl(name, Validators.required),
            'role': new FormControl(role, Validators.required),
            'accessList': new FormArray([])
        });
    }

    hasChild = (_: number, node: AccessFlatNode) => node.expandable;

    /** Whether all the descendants of the node are selected */
    descendantsAllSelected(node: AccessFlatNode): boolean {
        const descendants = this.treeControl.getDescendants(node);
        return descendants.every(child => this.checklistSelection.isSelected(child));
    }

    /** Whether part of the descendants are selected */
    descendantsPartiallySelected(node: AccessFlatNode): boolean {
        const descendants = this.treeControl.getDescendants(node);
        const result = descendants.some(child => this.checklistSelection.isSelected(child));
        return result && !this.descendantsAllSelected(node);
    }

    /** Toggle the to-do item selection. Select/deselect all the descendants node */
    todoItemSelectionToggle(node: AccessFlatNode): void {
        this.checklistSelection.toggle(node);
        const descendants = this.treeControl.getDescendants(node);
        this.checklistSelection.isSelected(node)
        ? this.checklistSelection.select(...descendants)
        : this.checklistSelection.deselect(...descendants);
    }

    close() {
        this.dialogRef.close();
    }

    onSubmit() {
        let role = new Role;
        role = this.roleForm.value;
        role.accessList = [];

        this.checklistSelection.selected.forEach((item, i) => {
            role.accessList.push(item.name);
        });

        if( this.data.dialogType === 'Create' ) {
            this.roleService.addRole(role).subscribe( result => {
                if( result.id ) {
                    this.utilities.notifySuccess('Role', 'added');
                    this.close();
                } else {
                    this.utilities.notifyError('Role not added');
                }
            });
        } else {
            role.id = this.data.role.id;
            this.roleService.updateRole(role).subscribe( result => {
                this.utilities.notifySuccess('Role', 'updated');
                this.close();
            });
        }
    }
}
