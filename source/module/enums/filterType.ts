import { TypeService } from '@romger/react-global-module/lib/services';
import { IFilterType } from '../../interfaces';

export enum FilterTypeEnum {
    STRING = 'STRING',
    INT_RANGE = 'INT_RANGE',
    DATE_RANGE = 'DATE_RANGE',
    DATE_TIME_RANGE = 'DATE_TIME_RANGE',
    DICTIONARY = 'DICTIONARY',
    BOOLEAN = 'BOOLEAN',
    GROUP_TITLE = 'GROUP_TITLE',
    CHECK_EXISTENCE = 'CHECK_EXISTENCE',
}

const FILTER_TYPE: IFilterType = {
    STRING: 'STRING',
    INT_RANGE: 'INT_RANGE',
    DATE_RANGE: 'DATE_RANGE',
    DATE_TIME_RANGE: 'DATE_TIME_RANGE',
    DICTIONARY: 'DICTIONARY',
    BOOLEAN: 'BOOLEAN',
    GROUP_TITLE: 'GROUP_TITLE',
    CHECK_EXISTENCE: 'CHECK_EXISTENCE',
};

export default FILTER_TYPE;

export const FilterTypeEnumType = TypeService.createEnum<FilterTypeEnum>(FilterTypeEnum, 'FilterTypeEnum');
