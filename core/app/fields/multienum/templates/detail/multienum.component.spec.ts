import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {Field} from '@app-common/record/field.model';
import {LanguageStore} from '@store/language/language.store';
import {languageStoreMock} from '@store/language/language.store.spec.mock';
import {MultiEnumDetailFieldComponent} from '@fields/multienum/templates/detail/multienum.component';
import {BehaviorSubject, of, Subscription} from 'rxjs';
import {shareReplay} from 'rxjs/operators';
import {UserPreferenceStore} from '@store/user-preference/user-preference.store';
import {userPreferenceStoreMock} from '@store/user-preference/user-preference.store.spec.mock';
import {NumberFormatter} from '@services/formatters/number/number-formatter.service';
import {numberFormatterMock} from '@services/formatters/number/number-formatter.spec.mock';
import {DatetimeFormatter} from '@services/formatters/datetime/datetime-formatter.service';
import {datetimeFormatterMock} from '@services/formatters/datetime/datetime-formatter.service.spec.mock';
import {DateFormatter} from '@services/formatters/datetime/date-formatter.service';
import {dateFormatterMock} from '@services/formatters/datetime/date-formatter.service.spec.mock';
import {CurrencyFormatter} from '@services/formatters/currency/currency-formatter.service';

const field: Field = {
    type: 'multienum',
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
const fieldState = new BehaviorSubject<Field>(field);
const field$ = fieldState.asObservable();

@Component({
    selector: 'multienum-detail-field-test-host-component',
    template: `
        <scrm-multienum-detail *ngIf="field.definition && field.definition.options"
                               [field]="field"></scrm-multienum-detail>
        <scrm-multienum-detail *ngIf="field.metadata && field.metadata.options$"
                               [field]="field"></scrm-multienum-detail>
    `
})
class MultiEnumDetailFieldTestHostComponent implements OnInit, OnDestroy {
    field: Field;
    sub: Subscription;

    ngOnInit(): void {
        this.sub = field$.subscribe(value => {
            this.field = value;
        });
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

}

describe('MultiEnumDetailFieldComponent', () => {
    let testHostComponent: MultiEnumDetailFieldTestHostComponent;
    let testHostFixture: ComponentFixture<MultiEnumDetailFieldTestHostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                MultiEnumDetailFieldTestHostComponent,
                MultiEnumDetailFieldComponent,
            ],
            imports: [],
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

        testHostFixture = TestBed.createComponent(MultiEnumDetailFieldTestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    }));

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
    });

    it('should have value', () => {
        expect(testHostComponent).toBeTruthy();

        fieldState.next({
            type: 'multienum',
            value: null,
            valueList: [
                '_customer',
                '_reseller',
            ],
            definition: {
                options: 'account_type_dom'
            }
        });

        testHostFixture.detectChanges();
        testHostFixture.whenRenderingDone().then(() => {
            expect(testHostFixture.nativeElement.textContent).toContain('Customer');
            expect(testHostFixture.nativeElement.textContent).toContain('Reseller');
            expect(testHostFixture.nativeElement.textContent).not.toContain('_customer');
            expect(testHostFixture.nativeElement.textContent).not.toContain('_reseller');
        });
    });

    it('should have list', () => {
        expect(testHostComponent).toBeTruthy();

        fieldState.next({
            type: 'multienum',
            value: null,
            valueList: [
                '_customer',
                '_reseller',
            ],
            definition: {
                options: 'account_type_dom'
            }
        });

        testHostFixture.detectChanges();
        testHostFixture.whenRenderingDone().then(() => {

            const uls = testHostFixture.nativeElement.getElementsByTagName('ul');

            expect(uls).toBeTruthy();
            expect(uls.length).toEqual(1);

            expect(uls.item(0).getElementsByTagName('li').length).toEqual(2);

            const item1 = uls.item(0).getElementsByTagName('li').item(0);
            const item2 = uls.item(0).getElementsByTagName('li').item(1);

            expect(item1).toBeTruthy();
            expect(item2).toBeTruthy();

            expect(item1.textContent).toContain('Customer');
            expect(item1.textContent).not.toContain('_customer');
            expect(item2.textContent).toContain('Reseller');
            expect(item2.textContent).not.toContain('_reseller');
        });
    });

    it('should allow providing option list', () => {
        expect(testHostComponent).toBeTruthy();
        fieldState.next({
            type: 'multienum',
            value: null,
            valueList: [
                '_customer',
                '_reseller',
                '_extra'
            ],
            metadata: {
                options$: of([
                    {
                        value: '_customer',
                        label: 'Customer',
                    },
                    {
                        value: '_reseller',
                        label: 'Reseller',
                    },
                    {
                        value: '_extra',
                        label: 'Extra',
                    },
                ]).pipe(shareReplay(1))
            },
        });

        testHostFixture.detectChanges();
        testHostFixture.whenRenderingDone().then(() => {

            const uls = testHostFixture.nativeElement.getElementsByTagName('ul');

            expect(uls).toBeTruthy();
            expect(uls.length).toEqual(1);

            expect(uls.item(0).getElementsByTagName('li').length).toEqual(3);

            const item1 = uls.item(0).getElementsByTagName('li').item(0);
            const item2 = uls.item(0).getElementsByTagName('li').item(1);
            const item3 = uls.item(0).getElementsByTagName('li').item(2);

            expect(item1).toBeTruthy();
            expect(item2).toBeTruthy();
            expect(item3).toBeTruthy();

            expect(item1.textContent).toContain('Customer');
            expect(item1.textContent).not.toContain('_customer');
            expect(item2.textContent).toContain('Reseller');
            expect(item2.textContent).not.toContain('_reseller');
            expect(item3.textContent).toContain('Extra');
            expect(item3.textContent).not.toContain('_extra');

        });
    });
});
