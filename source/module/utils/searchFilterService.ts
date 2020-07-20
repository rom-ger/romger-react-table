import { IFilterField, ISearchFilter } from '../../interfaces';
import { FilterTypeEnum } from '../enums/filterType';
import SEARCH_FILTER_TYPE from '../enums/searchFilterType';
import { BaseDictionaryTableUtils } from '../utils/baseDictionaryTableUtils';
import { moment } from './momentService';

export class SearchFilterService {
    /**
     * Собрать фильтр для отправки на бэк
     */
    static buildFilters(filtersConfig: IFilterField[], notCalcTimeSet: boolean = false): ISearchFilter[] {
        let filters: ISearchFilter[] = [];
        filtersConfig.forEach((el: IFilterField) => {
            if (el.withCheckExistence && el.checkExistenceValue !== null && el.checkExistenceValue !== undefined) {
                return filters.push({
                    type: SEARCH_FILTER_TYPE.CHECK_EXISTENCE,
                    fieldNames: el.fields && el.fields.length ? el.fields : [el.field],
                    exclude: !el.checkExistenceValue,
                });
            }
            if (el.type === FilterTypeEnum.BOOLEAN && el.booleanValue !== null && el.booleanValue !== undefined) {
                return filters.push({
                    type: SEARCH_FILTER_TYPE.EXACT_STRING,
                    fieldNames: el.fields && el.fields.length ? el.fields : [el.field],
                    values: [el.booleanValue],
                    exclude: el.exclude,
                });
            }
            if (el.type === FilterTypeEnum.DATE_RANGE && !!el.dateRangeValue && (!!el.dateRangeValue.from || !!el.dateRangeValue.to)) {
                return filters.push({
                    type: SEARCH_FILTER_TYPE.DATE_RANGE,
                    fieldNames: el.fields && el.fields.length ? el.fields : [el.field],
                    valueFrom: el.dateRangeValue.from ? moment(el.dateRangeValue.from)
                                                            .format('YYYY-MM-DD') : null,
                    valueTo: el.dateRangeValue.to ? moment(el.dateRangeValue.to)
                                                            .format('YYYY-MM-DD') : null,
                    exclude: el.exclude,
                });
            }
            if (el.type === FilterTypeEnum.DATE_TIME_RANGE && !!el.dateRangeValue && (!!el.dateRangeValue.from || !!el.dateRangeValue.to)) {
                return filters.push({
                    type: SEARCH_FILTER_TYPE.DATE_TIME_RANGE,
                    fieldNames: el.fields && el.fields.length ? el.fields : [el.field],
                    valueFrom: el.dateRangeValue.from ? moment(el.dateRangeValue.from)
                                                            .add(notCalcTimeSet ? 0 : new Date().getTimezoneOffset(), 'minutes')
                                                            .format('YYYY-MM-DD HH:mm') : null,
                    valueTo: el.dateRangeValue.to ? moment(el.dateRangeValue.to)
                                                            .add(notCalcTimeSet ? 0 : new Date().getTimezoneOffset(), 'minutes')
                                                            .format('YYYY-MM-DD HH:mm') : null,
                    exclude: el.exclude,
                });
            }
            if (el.type === FilterTypeEnum.INT_RANGE && !!el.intRangeValue && (el.intRangeValue.from !== null || el.intRangeValue.to !== null)) {
                return filters.push({
                    type: SEARCH_FILTER_TYPE.INT_RANGE,
                    fieldNames: el.fields && el.fields.length ? el.fields : [el.field],
                    valueFrom: el.intRangeValue.from,
                    valueTo: el.intRangeValue.to,
                    exclude: el.exclude,
                });
            }
            if (el.type === FilterTypeEnum.STRING && !!el.stringValue) {
                return filters.push({
                    type: SEARCH_FILTER_TYPE.SEARCH_STRING,
                    fieldNames: el.fields && el.fields.length ? el.fields : [el.field],
                    values: [el.stringValue],
                    exclude: el.exclude,
                });
            }
            if (el.type === FilterTypeEnum.DICTIONARY && !!el.dictionaryValue && !!BaseDictionaryTableUtils.getModelValue(el.dictionaryValue, el.dictionaryModelField) && !el.dictionaryMultiSelect) {
                return filters.push({
                    type: SEARCH_FILTER_TYPE.EXACT_STRING,
                    fieldNames: el.fields && el.fields.length ? el.fields : [el.field],
                    values: [BaseDictionaryTableUtils.getModelValue(el.dictionaryValue, el.dictionaryModelField)],
                    exclude: el.exclude,
                });
            }
            if (el.type === FilterTypeEnum.DICTIONARY && !!el.dictionaryMultiSelect && !!el.dictionaryValue && !!el.dictionaryValue.length) {
                return filters.push({
                    type: SEARCH_FILTER_TYPE.EXACT_STRING,
                    fieldNames: el.fields && el.fields.length ? el.fields : [el.field],
                    values: el.dictionaryValue.map((dictionary: any) => BaseDictionaryTableUtils.getModelValue(dictionary, el.dictionaryModelField)),
                    exclude: el.exclude,
                });
            }
            return;
        });
        return filters;
    }
}
