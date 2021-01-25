import {Component, ViewChild} from '@angular/core';
import {DataTypeFormatter} from '@services/formatters/data-type.formatter.service';
import {LanguageStore} from '@store/language/language.store';
import {TagInputComponent} from 'ngx-chips';
import {RelateService} from '@services/record/relate/relate.service';
import {BaseRelateComponent} from '@fields/base/base-relate.component';
import {ModuleNameMapper} from '@services/navigation/module-name-mapper/module-name-mapper.service';
import {ButtonInterface} from '@app-common/components/button/button.model';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {RecordListModalComponent} from '@containers/record-list-modal/components/record-list-modal/record-list-modal.component';
import {Record} from '@app-common/record/record.model';
import {RecordListModalResult} from '@containers/record-list-modal/components/record-list-modal/record-list-modal.model';

@Component({
    selector: 'scrm-relate-edit',
    templateUrl: './relate.component.html',
    styleUrls: [],
    providers: [RelateService]
})
export class RelateEditFieldComponent extends BaseRelateComponent {
    @ViewChild('tag') tag: TagInputComponent;
    selectButton: ButtonInterface;

    /**
     * Constructor
     *
     * @param {object} languages service
     * @param {object} typeFormatter service
     * @param {object} relateService service
     * @param {object} moduleNameMapper service
     * @param {object} modalService service
     */
    constructor(
        protected languages: LanguageStore,
        protected typeFormatter: DataTypeFormatter,
        protected relateService: RelateService,
        protected moduleNameMapper: ModuleNameMapper,
        protected modalService: NgbModal
    ) {
        super(languages, typeFormatter, relateService, moduleNameMapper);

        this.selectButton = {
            klass: ['btn', 'btn-sm', 'btn-outline-secondary', 'select-button'],
            onClick: (): void => {
                this.showSelectModal();
            },
            icon: 'cursor'
        } as ButtonInterface;
    }

    /**
     * On init handler
     */
    ngOnInit(): void {
        super.ngOnInit();
    }

    /**
     * Handle newly added item
     *
     * @param {object} item added
     */
    onAdd(item): void {

        if (item) {
            const relateName = this.getRelateFieldName();
            this.setValue(item.id, item[relateName]);
            return;
        }

        this.setValue('', '');
        this.selectedValues = [];

        return;
    }

    /**
     * Handle item removal
     */
    onRemove(): void {
        this.setValue('', '');
        this.selectedValues = [];

        setTimeout(() => {
            this.tag.focus(true, true);
        }, 200);
    }

    /**
     * Set value on field
     *
     * @param {string} id to set
     * @param {string} relateValue to set
     */
    protected setValue(id: string, relateValue: string): void {
        const relate = this.buildRelate(id, relateValue);
        this.field.value = relateValue;
        this.field.valueObject = relate;
        this.field.formControl.setValue(relateValue);
        this.field.formControl.markAsDirty();
    }

    /**
     * Show record selection modal
     */
    protected showSelectModal(): void {
        const modal = this.modalService.open(RecordListModalComponent, {size: 'xl', scrollable: true});

        modal.componentInstance.module = this.getRelatedModule();

        modal.result.then((data: RecordListModalResult) => {

            if (!data || !data.selection || !data.selection.selected) {
                return;
            }

            const record = this.getSelectedRecord(data);
            this.setItem(record);
        });
    }

    /**
     * Get Selected Record
     *
     * @param {object} data RecordListModalResult
     * @returns {object} Record
     */
    protected getSelectedRecord(data: RecordListModalResult): Record {
        let id = '';
        Object.keys(data.selection.selected).some(selected => {
            id = selected;
            return true;
        });

        let record: Record = null;

        data.records.some(rec => {
            if (rec && rec.id === id) {
                record = rec;
                return true;
            }
        });

        return record;
    }

    /**
     * Set the record as the selected item
     *
     * @param {object} record to set
     */
    protected setItem(record: Record): void {
        this.tag.writeValue([record.attributes]);
        this.onAdd(record.attributes);
    }
}
