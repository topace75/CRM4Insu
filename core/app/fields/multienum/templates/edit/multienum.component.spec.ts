import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {Field} from '@app-common/record/field.model';
import {LanguageStore} from '@store/language/language.store';
import {languageStoreMock} from '@store/language/language.store.spec.mock';
import {TagInputModule} from 'ngx-chips';
import {FormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BrowserDynamicTestingModule} from '@angular/platform-browser-dynamic/testing';
import {MultiEnumEditFieldComponent} from '@fields/multienum/templates/edit/multienum.component';
import {UserPreferenceStore} from '@store/user-preference/user-preference.store';
import {userPreferenceStoreMock} from '@store/user-preference/user-preference.store.spec.mock';
import {NumberFormatter} from '@services/formatters/number/number-formatter.service';
import {numberFormatterMock} from '@services/formatters/number/number-formatter.spec.mock';
import {DatetimeFormatter} from '@services/formatters/datetime/datetime-formatter.service';
import {datetimeFormatterMock} from '@services/formatters/datetime/datetime-formatter.service.spec.mock';
import {DateFormatter} from '@services/formatters/datetime/date-formatter.service';
import {dateFormatterMock} from '@services/formatters/datetime/date-formatter.service.spec.mock';
import {CurrencyFormatter} from '@services/formatters/currency/currency-formatter.service';

@Component({
    selector: 'multienum-edit-field-test-host-component',
    template: '<scrm-multienum-edit [field]="field"></scrm-multienum-edit>'
})
class MultiEnumEditFieldTestHostComponent {
    field: Field = {
        type: 'enum',
        value: null,
        valueList: [
            '_customer',
            '_reseller'
        ],
        metadata: null,
        definition: {
            options: 'account_type_dom'
        }
    };
}

describe('MultiEnumEditFieldComponent', () => {
    let testHostComponent: MultiEnumEditFieldTestHostComponent;
    let testHostFixture: ComponentFixture<MultiEnumEditFieldTestHostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                MultiEnumEditFieldTestHostComponent,
                MultiEnumEditFieldComponent,
            ],
            imports: [
                TagInputModule,
                FormsModule,
                BrowserDynamicTestingModule,
                BrowserAnimationsModule
            ],
            providers: [
                {provide: LanguageStore, useValue: languageStoreMock},
                {provide: UserPreferenceStore, useValue: userPreferenceStoreMock},
                {provide: NumberFormatter, useValue: numberFormatterMock},
                {provide: DatetimeFormatter, useValue: datetimeFormatterMock},
                {provide: DateFormatter, useValue: dateFormatterMock},
                {
                    provide: CurrencyFormatter,
                    useValue: new CurrencyFormatter(userPreferenceStoreMock, numberFormatterMock, 'en_us')
                },
            ],
        }).compileComponents();

        testHostFixture = TestBed.createComponent(MultiEnumEditFieldTestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    }));

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
    });

    it('should have value', () => {
        expect(testHostComponent).toBeTruthy();

        testHostComponent.field = {
            type: 'enum',
            value: null,
            valueList: [
                '_customer',
                '_reseller'
            ],
            metadata: null,
            definition: {
                options: 'account_type_dom'
            }
        };

        testHostFixture.detectChanges();
        testHostFixture.whenStable().then(() => {


            const field = testHostFixture.nativeElement.getElementsByTagName('scrm-multienum-edit')[0];

            expect(field).toBeTruthy();

            const tagInput = field.getElementsByTagName('tag-input').item(0);

            expect(tagInput).toBeTruthy();

            const tag1 = tagInput.getElementsByTagName('tag').item(0);

            expect(tag1).toBeTruthy();

            const tagText1 = tag1.getElementsByClassName('tag__text').item(0);

            expect(tagText1.textContent).toContain('Customer');
            expect(tagText1.textContent).not.toContain('_customer');

            const deleteIcon1 = tag1.getElementsByTagName('delete-icon').item(0);

            expect(deleteIcon1).toBeTruthy();

            const tag2 = tagInput.getElementsByTagName('tag').item(1);

            expect(tag2).toBeTruthy();

            const tagText2 = tag2.getElementsByClassName('tag__text').item(0);

            expect(tagText2.textContent).toContain('Reseller');
            expect(tagText2.textContent).not.toContain('_reseller');

            const deleteIcon2 = tag1.getElementsByTagName('delete-icon').item(0);

            expect(deleteIcon2).toBeTruthy();

        });

    });

    it('should allow removing value', () => {
        expect(testHostComponent).toBeTruthy();

        const element = testHostFixture.nativeElement;

        testHostComponent.field = {
            type: 'enum',
            value: null,
            valueList: [
                '_customer',
                '_reseller'
            ],
            metadata: null,
            definition: {
                options: 'account_type_dom'
            }
        };

        testHostFixture.detectChanges();
        testHostFixture.whenStable().then(() => {

            const deleteIcon = element.getElementsByTagName('delete-icon').item(0);

            expect(deleteIcon).toBeTruthy();

            deleteIcon.click();

            testHostFixture.detectChanges();
            testHostFixture.whenRenderingDone().then(() => {

                const tag = element.getElementsByClassName('tag__text');

                expect(tag).toBeTruthy();

                expect(tag.length).toEqual(1);
            });

        });


    });

    it('should allow adding value', () => {
        expect(testHostComponent).toBeTruthy();

        const element = testHostFixture.nativeElement;

        testHostComponent.field = {
            type: 'enum',
            value: null,
            valueList: [
                '_customer',
                '_reseller'
            ],
            metadata: null,
            definition: {
                options: 'account_type_dom'
            }
        };

        testHostFixture.detectChanges();
        testHostFixture.whenStable().then(() => {

            const deleteIcon = element.getElementsByTagName('delete-icon').item(0);

            expect(deleteIcon).toBeTruthy();

            deleteIcon.click();

            testHostFixture.detectChanges();
            testHostFixture.whenRenderingDone().then(() => {

                const input = element.getElementsByTagName('tag-input-form').item(0);

                input.click();

                testHostFixture.detectChanges();
                testHostFixture.whenRenderingDone().then(() => {

                    const menu = window.document.getElementsByClassName('ng2-dropdown-menu').item(0);
                    const item = menu.getElementsByClassName('ng2-menu-item').item(0);

                    expect(menu).toBeTruthy();
                    expect(item).toBeTruthy();

                    item.parentElement.click();

                    testHostFixture.detectChanges();
                    testHostFixture.whenRenderingDone().then(() => {

                        const tag = element.getElementsByTagName('tag').item(0);

                        expect(tag).toBeTruthy();

                        const tagText = tag.getElementsByClassName('tag__text').item(0);

                        expect(tagText.textContent).toContain('Customer');
                        expect(tagText.textContent).not.toContain('_customer');

                        const newDeleteIcon = element.getElementsByTagName('delete-icon').item(0);

                        expect(newDeleteIcon).toBeTruthy();

                    });

                });

            });

        });
    });
});
