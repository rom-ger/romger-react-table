import * as moment from 'moment';
import { RgReactBaseComponent, RgReactBaseComponentInterface } from '@romger/react-base-components';
import { IFilterField, IRangeValue } from '../../../interfaces';
import { dateRangeFilterTemplate } from './dateRangeFilterTemplate';

export interface IDateRangeFilterProps {
    filterField: IFilterField | null;
    withTime?: boolean;
    fastUpdate?: boolean;
    changeFilter: (dateRange: IRangeValue<Date>, checkExistenceValue: boolean | null) => any;
}

export interface IDateRangeFilterState {
    from: Date | null;
    to: Date | null;
    fromHour: number  | null;
    fromMinutes: number  | null;
    toHour: number  | null;
    toMinutes: number  | null;
}

export interface IDateRangeFilter extends RgReactBaseComponentInterface {
    props: IDateRangeFilterProps;
    state: IDateRangeFilterState;
    isNotValidData: boolean;
    apply: (checkExistenceValue?: boolean | null) => any;
    setRangeAsToday: () => any;
    setRangeAsYesterday: () => any;
    setRangeAsWeek: () => any;
    setRangeAsMonth: () => any;
    setRangeAsYear: () => any;
}

class DateRangeFilter extends RgReactBaseComponent<IDateRangeFilterProps, IDateRangeFilterState> implements IDateRangeFilter {
    constructor(props: IDateRangeFilterProps) {
        super(props);
        this.state = {
            from: null,
            to: null,
            fromHour: null,
            fromMinutes: null,
            toHour: null,
            toMinutes: null,
        };
    }

    get isNotValidData(): boolean {
        return !!this.props.withTime &&
        (
            (!!this.state.fromHour && (this.state.fromHour < 0 || this.state.fromHour > 23)) ||
            (!!this.state.toHour && (this.state.toHour < 0 || this.state.toHour > 23)) ||
            (!!this.state.fromMinutes && (this.state.fromMinutes < 0 || this.state.fromMinutes > 59)) ||
            (!!this.state.toMinutes && (this.state.toMinutes < 0 || this.state.toMinutes > 59))
        );
    }

    componentDidMount() {
        this.setState(
            {
                from: this.props.filterField?.dateRangeValue?.from ?? null,
                to: this.props.filterField?.dateRangeValue?.to ?? null,
            },
            () => this.setState({
                fromHour: this.state.from ? this.moment(this.state.from)
                                                .hour() : null,
                fromMinutes: this.state.from ? this.moment(this.state.from)
                                                   .minute() : null,
                toHour: this.state.to ? this.moment(this.state.to)
                                                .hour() : null,
                toMinutes: this.state.to ? this.moment(this.state.to)
                                                .minute() : null,
            }),
        );
    }

    componentWillReceiveProps(nextProps: IDateRangeFilterProps) {
        if (!this.props.fastUpdate) {
            return;
        }
        this.setState(
            {
                from: nextProps.filterField?.dateRangeValue?.from ?? null,
                to: nextProps.filterField?.dateRangeValue?.to ?? null,
            },
            () => this.setState({
                fromHour: this.state.from ? this.moment(this.state.from)
                                                .hour() : null,
                fromMinutes: this.state.from ? this.moment(this.state.from)
                                                   .minute() : null,
                toHour: this.state.to ? this.moment(this.state.to)
                                                .hour() : null,
                toMinutes: this.state.to ? this.moment(this.state.to)
                                                .minute() : null,
            }),
        );
    }

    /**
     * Установить дату на сегодня
     */
    setRangeAsToday = () => {
        this.setState(
            {
                from: this.moment()
                        .toDate(),
                to: this.moment()
                        .toDate(),
            },
            () => !this.props.fastUpdate ? null : this.apply(),
        );
    }

    /**
     * Установить дату на вчера
     */
    setRangeAsYesterday = () => {
        this.setState(
            {
                from: this.moment()
                        .subtract(1, 'days')
                        .toDate(),
                to: this.moment()
                        .subtract(1, 'days')
                        .toDate(),
            },
            () => !this.props.fastUpdate ? null : this.apply(),
        );
    }

    /**
     * Установить дату на неделю
     */
    setRangeAsWeek = () => {
        this.setState(
            {
                from: this.moment()
                        .startOf('week')
                        .toDate(),
                to: this.moment()
                        .toDate(),
            },
            () => !this.props.fastUpdate ? null : this.apply(),
        );
    }

    /**
     * Установить дату на месяц
     */
    setRangeAsMonth = () => {
        this.setState(
            {
                from: this.moment()
                        .startOf('month')
                        .toDate(),
                to: this.moment()
                        .toDate(),
            },
            () => !this.props.fastUpdate ? null : this.apply(),
        );
    }

    /**
     * Установить дату на год
     */
    setRangeAsYear = () => {
        this.setState(
            {
                from: this.moment()
                        .startOf('year')
                        .toDate(),
                to: this.moment()
                        .toDate(),
            },
            () => !this.props.fastUpdate ? null : this.apply(),
        );
    }

    /**
     * Применяем фильтр
     */
    apply = (checkExistenceValue?: boolean | null) => {
        let from: moment.Moment | null = this.state.from ? this.moment(this.state.from)
                                                               .startOf('day') : null;
        let to: moment.Moment | null = this.state.to ? this.moment(this.state.to)
                                                           .endOf('day') : null;
        if (!!this.props.withTime) {
            const maxHour: number = 23;
            const maxMinute: number = 59;
            if (from) {
                if (this.state.fromHour !== null && this.state.fromHour >= 0 && this.state.fromHour <= maxHour) {
                    from.hour(this.state.fromHour);
                }
                if (this.state.fromMinutes !== null && this.state.fromMinutes >= 0 && this.state.fromMinutes <= maxMinute) {
                    from.minute(this.state.fromMinutes);
                }
            }
            if (to) {
                if (this.state.toHour !== null && this.state.toHour >= 0 && this.state.toHour <= maxHour) {
                    to.hour(this.state.toHour);
                }
                if (this.state.toMinutes !== null && this.state.toMinutes >= 0 && this.state.toMinutes <= maxMinute) {
                    to.minute(this.state.toMinutes);
                }
            }
        }
        this.props.changeFilter(
            {
                from: from ? from.toDate() : null,
                to: to ? to.toDate() : null,
            },
            checkExistenceValue ?? null,
        );
    }

    render(): JSX.Element | false {
        return !!this.props.filterField && dateRangeFilterTemplate(this);
    }
}

export { DateRangeFilter };
