import * as t from 'io-ts';
import { IFilterType, ISearchFilterType } from './interfaces';

declare enum FilterTypeEnum {
    STRING = 'STRING',
    INT_RANGE = 'INT_RANGE',
    DATE_RANGE = 'DATE_RANGE',
    DATE_TIME_RANGE = 'DATE_TIME_RANGE',
    DICTIONARY = 'DICTIONARY',
    BOOLEAN = 'BOOLEAN',
    GROUP_TITLE = 'GROUP_TITLE',
    CHECK_EXISTENCE = 'CHECK_EXISTENCE',
}

declare const FILTER_TYPE: IFilterType;
declare const FilterTypeEnumType: t.Type<FilterTypeEnum, FilterTypeEnum, unknown>;

declare enum SearchFilterTypeEnum {
    EXACT_STRING = 'EXACT_STRING',
    DATE_RANGE = 'DATE_RANGE',
    DATE_TIME_RANGE = 'DATE_TIME_RANGE',
    INT_RANGE = 'INT_RANGE',
    DOUBLE_RANGE = 'DOUBLE_RANGE',
    SEARCH_STRING = 'SEARCH_STRING',
    CHECK_EXISTENCE = 'CHECK_EXISTENCE',
}

declare const SEARCH_FILTER_TYPE: ISearchFilterType;
declare const SearchFilterTypeEnumType: t.Type<SearchFilterTypeEnum, SearchFilterTypeEnum, unknown>;

export {
    FILTER_TYPE, FilterTypeEnumType, FilterTypeEnum,
    SEARCH_FILTER_TYPE, SearchFilterTypeEnumType, SearchFilterTypeEnum,
};
