import { RgReactBaseComponent } from '@romger/react-base-components';
import { noun } from 'plural-ru';
import { IFilterField, IRangeValue } from '../../../interfaces';
import { FilterTypeEnum } from '../../enums/filterType';
import { BaseDictionaryTableUtils } from '../../utils/baseDictionaryTableUtils';
import { tableSidebarFiltersTemplate } from './tableSidebarFiltersTemplate';

export interface IRgReactTableSidebarFiltersProps {
    filterFields: IFilterField[];
    updateFilterAllValue: (changeFilterFields: IFilterField[], notClose?: boolean) => any;
}

export interface IRgReactTableSidebarFiltersState {
    filterFields: IFilterField[];
}

export interface IRgReactTableSidebarFilters {
    props: IRgReactTableSidebarFiltersProps;
    state: IRgReactTableSidebarFiltersState;
    updateFilterDictionaryValue: (dictionaryValue: any, checkExistenceValue: boolean | null, field?: string) => any;
    updateFilterStringValue: (stringValue: any, checkExistenceValue: boolean | null, field?: string) => any;
    updateFilterIntRangeValue: (intRangeValue: IRangeValue<number>, checkExistenceValue: boolean | null, field?: string) => any;
    updateFilterDateRangeValue: (dateRangeValue: IRangeValue<Date>, checkExistenceValue: boolean | null, field?: string) => any;
    updateFilterBooleanValue: (booleanValue: boolean | null, field?: string) => any;
    apply: () => any;
    clearAll: () => any;
    getShortContentByFilter: (filterField: IFilterField) => string | null;
    clearOneFilter: (filterField: IFilterField) => any;
}

class RgReactTableSidebarFilters extends RgReactBaseComponent<IRgReactTableSidebarFiltersProps, IRgReactTableSidebarFiltersState> implements IRgReactTableSidebarFilters {
    state: IRgReactTableSidebarFiltersState = {
        filterFields: [],
    };

    componentDidMount() {
        this.setState({
            filterFields: this.props.filterFields,
        });
    }

    componentWillReceiveProps(nextProps: IRgReactTableSidebarFiltersProps) {
        this.setState({
            filterFields: nextProps.filterFields,
        });
    }

    /**
     * Применяем фильтр по сущносятм
     */
    updateFilterDictionaryValue = (dictionaryValue: any, checkExistenceValue: boolean | null, field?: string) => {
        let filterFields: IFilterField[] | undefined = this.state.filterFields;
        if (!filterFields) {
            return;
        }
        let index: number = filterFields.findIndex((filterField: IFilterField) => filterField.field === field);
        if (index === -1) {
            return;
        }
        filterFields[index].dictionaryValue = dictionaryValue;
        if (filterFields[index].withCheckExistence) {
            filterFields[index].checkExistenceValue = checkExistenceValue;
        }
        this.setState({
            filterFields,
        });
    }

    /**
     * Применяем фильтр по строке
     */
    updateFilterStringValue = (stringValue: string | null, checkExistenceValue: boolean | null, field?: string) => {
        let filterFields: IFilterField[] | undefined = this.state.filterFields;
        if (!filterFields) {
            return;
        }
        let index: number = filterFields.findIndex((filterField: IFilterField) => filterField.field === field);
        if (index === -1) {
            return;
        }
        filterFields[index].stringValue = stringValue;
        if (filterFields[index].withCheckExistence) {
            filterFields[index].checkExistenceValue = checkExistenceValue;
        }
        this.setState({
            filterFields,
        });
    };

    /**
     * Применяем фильтр по диапазону чисел
     */
    updateFilterIntRangeValue = (intRangeValue: IRangeValue<number>, checkExistenceValue: boolean | null, field?: string) => {
        let filterFields: IFilterField[] | undefined = this.state.filterFields;
        if (!filterFields) {
            return;
        }
        let index: number = filterFields.findIndex((filterField: IFilterField) => filterField.field === field);
        if (index === -1) {
            return;
        }
        filterFields[index].intRangeValue = intRangeValue;
        if (filterFields[index].withCheckExistence) {
            filterFields[index].checkExistenceValue = checkExistenceValue;
        }
        this.setState({
            filterFields,
        });
    }

    /**
     * Применяем фильтр по диапазону дат
     */
    updateFilterDateRangeValue = (dateRangeValue: IRangeValue<Date>, checkExistenceValue: boolean | null, field?: string) => {
        let filterFields: IFilterField[] | undefined = this.state.filterFields;
        if (!filterFields) {
            return;
        }
        let index: number = filterFields.findIndex((filterField: IFilterField) => filterField.field === field);
        if (index === -1) {
            return;
        }
        filterFields[index].dateRangeValue = dateRangeValue;
        if (filterFields[index].withCheckExistence) {
            filterFields[index].checkExistenceValue = checkExistenceValue;
        }
        this.setState({
            filterFields,
        });
    }

    /**
     * Применяем буленовский
     */
    updateFilterBooleanValue = (booleanValue: boolean | null, field?: string) => {
        let filterFields: IFilterField[] | undefined = this.state.filterFields;
        if (!filterFields) {
            return;
        }
        let index: number = filterFields.findIndex((filterField: IFilterField) => filterField.field === field);
        if (index === -1) {
            return;
        }
        filterFields[index].booleanValue = booleanValue;
        this.setState({
            filterFields,
        });
    }

    /**
     * Применить все фильтры разом
     */
    apply = (notClose?: boolean) => {
        return this.props.updateFilterAllValue(this.state.filterFields, notClose);
    }

    /**
     * Очистить все фильтры разом
     */
    clearAll = () => {
        let filterFields: IFilterField[] = this.state.filterFields;
        filterFields.forEach((filterField: IFilterField) => {
            filterField.dateRangeValue = undefined;
            filterField.dictionaryValue = undefined;
            filterField.intRangeValue = undefined;
            filterField.stringValue = undefined;
            filterField.booleanValue = undefined;
            filterField.checkExistenceValue = undefined;
        });
        this.setState(
            {
                filterFields,
            },
            () => this.apply(),
        );
    }

    /**
     * Получим короткое значение выбранного фильтра
     */
    clearOneFilter = (filterField: IFilterField): any => {
        let filterFields: IFilterField[] = this.state.filterFields;
        filterFields.forEach((child: IFilterField) => {
            if (child.field === filterField.field) {
                child.dateRangeValue = undefined;
                child.dictionaryValue = undefined;
                child.intRangeValue = undefined;
                child.stringValue = undefined;
                child.booleanValue = undefined;
                child.checkExistenceValue = undefined;
            }
        });
        this.setState(
            {
                filterFields,
            },
            () => this.apply(true),
        );
    }

    /**
     * Получим короткое значение выбранного фильтра
     */
    getShortContentByFilter = (filterField: IFilterField): string | null => {
        let result: string | null = null;
        if (filterField.type === FilterTypeEnum.STRING && !!filterField.stringValue) {
            result = filterField.stringValue;
        }
        if (filterField.type === FilterTypeEnum.DICTIONARY  && !filterField.dictionaryMultiSelect && !!filterField.dictionaryValue) {
            result = BaseDictionaryTableUtils.getVisibleValue(filterField.dictionaryValue, filterField.dictionaryVisibleField);
        }
        if (filterField.type === FilterTypeEnum.DICTIONARY  && !!filterField.dictionaryMultiSelect && !!filterField.dictionaryValue && !!filterField.dictionaryValue.length) {
            result = filterField.dictionaryValue.length === 1 ? BaseDictionaryTableUtils.getVisibleValue(filterField.dictionaryValue[0], filterField.dictionaryVisibleField) : `${filterField.dictionaryValue.length} ${noun(filterField.dictionaryValue.length, 'элемент', 'элемента', 'элементов')}`;
        }
        if (filterField.type === FilterTypeEnum.INT_RANGE && !!filterField.intRangeValue && (filterField.intRangeValue.from !== null || filterField.intRangeValue.to !== null)) {
            if (filterField.intRangeValue.from === null) {
                result = `по ${filterField.intRangeValue.to}`;
            } else if (filterField.intRangeValue.to === null) {
                result = `c ${filterField.intRangeValue.from}`;
            } else {
                result = `${filterField.intRangeValue.from !== null ? filterField.intRangeValue.from : ''} - ${filterField.intRangeValue.to !== null ? filterField.intRangeValue.to : ''}`;
            }
        }
        if ((filterField.type === FilterTypeEnum.DATE_RANGE || filterField.type === FilterTypeEnum.DATE_TIME_RANGE) && !!filterField.dateRangeValue && (filterField.dateRangeValue.from !== null || filterField.dateRangeValue.to !== null)) {
            if (filterField.dateRangeValue.from === null) {
                result = `по ${this.getDateValue(filterField.dateRangeValue.to, filterField.type === FilterTypeEnum.DATE_TIME_RANGE)}`;
            } else if (filterField.dateRangeValue.to === null) {
                result = `c ${this.getDateValue(filterField.dateRangeValue.from, filterField.type === FilterTypeEnum.DATE_TIME_RANGE)}`;
            } else {
                result = `${filterField.dateRangeValue.from !== null ? this.getDateValue(filterField.dateRangeValue.from, filterField.type === FilterTypeEnum.DATE_TIME_RANGE) : ''} - ${filterField.dateRangeValue.to !== null ? this.getDateValue(filterField.dateRangeValue.to, filterField.type === FilterTypeEnum.DATE_TIME_RANGE) : ''}`;
            }
        }
        if (filterField.type === FilterTypeEnum.BOOLEAN && filterField.booleanValue !== null && filterField.booleanValue !== undefined) {
            result = filterField.booleanValue ? (filterField.booleanTrueTitle ? filterField.booleanTrueTitle : 'Да') : (filterField.booleanFalseTitle ? filterField.booleanFalseTitle : 'Нет');
        }
        if (!!filterField.withCheckExistence && filterField.checkExistenceValue !== undefined && filterField.checkExistenceValue !== null) {
            result = filterField.checkExistenceValue ? 'Не пустые' : 'Пустые';
        }
        return result;
    }

    /**
     * Получить отображаемую дату
     */
    getDateValue = (dateValue: Date | null, withTime?: boolean): string => {
        return dateValue ? this.moment(dateValue)
                               .format(withTime ? 'DD.MM.YYYY HH:mm' : 'DD.MM.YYYY') : '';
    }

    render() {
        return tableSidebarFiltersTemplate(this);
    }
}

export { RgReactTableSidebarFilters };
