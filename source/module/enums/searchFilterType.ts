import { TypeService } from '@romger/react-global-module/lib/services';
import { ISearchFilterType } from '../../interfaces';

export enum SearchFilterTypeEnum {
    EXACT_STRING = 'EXACT_STRING',
    DATE_RANGE = 'DATE_RANGE',
    DATE_TIME_RANGE = 'DATE_TIME_RANGE',
    INT_RANGE = 'INT_RANGE',
    DOUBLE_RANGE = 'DOUBLE_RANGE',
    SEARCH_STRING = 'SEARCH_STRING',
    CHECK_EXISTENCE = 'CHECK_EXISTENCE',
}

const SEARCH_FILTER_TYPE: ISearchFilterType = {
    EXACT_STRING: 'EXACT_STRING',
    DATE_RANGE: 'DATE_RANGE',
    DATE_TIME_RANGE: 'DATE_TIME_RANGE',
    INT_RANGE: 'INT_RANGE',
    DOUBLE_RANGE: 'DOUBLE_RANGE',
    SEARCH_STRING: 'SEARCH_STRING',
    CHECK_EXISTENCE: 'CHECK_EXISTENCE',
};

export default SEARCH_FILTER_TYPE;

export const SearchFilterTypeType = TypeService.createEnum<SearchFilterTypeEnum>(SearchFilterTypeEnum, 'SearchFilterTypeEnum');
