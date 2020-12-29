import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {deepClone} from '@base/app-common/utils/object-utils';
import {
    SingleValueStatistic,
    SingleValueStatisticsData,
    Statistic,
    StatisticsQuery
} from '@app-common/statistics/statistics.model';
import {StatisticsFetchGQL} from '@store/statistics/graphql/api.statistics.get';
import {StatisticsState, StatisticsStore} from '@store/statistics/statistics.store';
import {distinctUntilChanged, map} from 'rxjs/operators';
import {Field} from '@app-common/record/field.model';
import {FieldManager} from '@services/record/field/field.manager';

const initialState = {
    module: '',
    query: {} as StatisticsQuery,
    statistic: {
        id: '',
        data: {} as SingleValueStatisticsData
    } as SingleValueStatistic,
    loading: false
} as SingleValueStatisticsState;

export interface SingleValueStatisticsState extends StatisticsState {
    statistic: SingleValueStatistic;
    field?: Field;
}

@Injectable()
export class SingleValueStatisticsStore extends StatisticsStore {
    state$: Observable<SingleValueStatisticsState>;
    statistic$: Observable<Statistic>;
    loading$: Observable<boolean>;
    protected cache$: Observable<any> = null;
    protected internalState: SingleValueStatisticsState = deepClone(initialState);
    protected store = new BehaviorSubject<SingleValueStatisticsState>(this.internalState);

    constructor(
        protected fetchGQL: StatisticsFetchGQL,
        protected fieldManager: FieldManager
    ) {
        super(fetchGQL);
        this.state$ = this.store.asObservable();
        this.statistic$ = this.state$.pipe(map(state => state.statistic), distinctUntilChanged());
        this.loading$ = this.state$.pipe(map(state => state.loading), distinctUntilChanged());
    }

    protected addNewState(statistic: Statistic): void {

        if (!statistic.metadata || !statistic.metadata.dataType) {
            return;
        }

        const field = this.fieldManager.buildShallowField(statistic.metadata.dataType, statistic.data.value);

        field.metadata = {
            digits: 0
        };

        this.updateState({
            ...this.internalState,
            statistic,
            field,
            loading: false
        });
    }

    /**
     * Update the state
     *
     * @param {object} state to set
     */
    protected updateState(state: SingleValueStatisticsState): void {
        super.updateState(state);
    }
}
