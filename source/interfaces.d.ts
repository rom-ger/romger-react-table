import { IBaseSortDTO } from '@romger/react-global-module/lib/interfaces';
import { FilterTypeEnum } from './enums';

interface RgReactTableConfigItem { // интерфейс одного элемента строки таблицы
    value?: any;
    visibleField?: string;
    isDate?: boolean;
    dateFormat?: string;
    onClickItem?: (item?: any) => any;
    href?: string;
    customHTML?: any;
    className?: string;
}

interface RgReactTableConfigTitle { // интерфейс одного элемента заголовка таблицы
    hardHide?: boolean;
    hide?: boolean;
    orderIndex?: number;
    isCheckbox?: boolean;
    sortDirection?: boolean;
    sort?: boolean;
    onClick?: any;
    allSelect?: any;
    title?: string | null;
    sortField?: string;
    filterField?: string;
    minWidth?: number;
    maxWidth?: number;
    notExport?: boolean;
    fixRight?: boolean;
    fixLeft?: boolean;
}

interface RgReactTableConfig { // интерфейс конфига таблицы
    titles: RgReactTableConfigTitle[];
    rows: Array<{
        items: RgReactTableConfigItem[];
    }>;
    onClickRow?: (row?: any) => any;
    selectRow?: (row?: any) => any;
    onDoubleClickRow?: (row?: any) => any;
    applyFilter?: boolean;
    emptyMessage?: string;
    withoutPagination?: boolean;
    showChangePageSize?: boolean;
}

interface IFilterType {
    [value: string]: string;

    STRING: string;
    INT_RANGE: string;
    DATE_RANGE: string;
    DATE_TIME_RANGE: string;
    DICTIONARY: string;
    BOOLEAN: string;
    CHECK_EXISTENCE: string;
}

interface IRangeValue<T> {
    from: T | null;
    to: T | null;
}

interface IChangeFilter {
    sort?: IBaseSortDTO;
    filterFields?: IChangeFilterField[];
}

interface IChangeFilterField {
    type: FilterTypeEnum;
    field: string;
    fields?: string[];
    stringValue?: string | null;
    booleanValue?: boolean | null;
    intRangeValue?: IRangeValue<number> | null;
    dateRangeValue?: IRangeValue<Date> | null;
    dictionaryValue?: any;
    withCheckExistence?: boolean;
    checkExistenceValue?: boolean | null;
}

interface IFilterField extends IChangeFilterField {
    filterTitle?: string;
    dictionaryMultiSelect?: boolean;
    dictionaryItems?: (searchString?: string | null) => (Promise<any[]> | any[]);
    dictionaryModelField?: string;
    dictionaryVisibleField?: string;
    dictionaryWithoutSearch?: boolean;
    exclude?: boolean;
    booleanAllTitle?: string;
    booleanTrueTitle?: string;
    booleanFalseTitle?: string;
}

interface IColumnConfig {
    index: number;
    size: IColumnSize;
    orderIndex: number;
    hardHide: boolean;
    hide: boolean;
    notExport?: boolean;
    fixRight?: boolean;
    fixLeft?: boolean;
}

interface IColumnSize {
    maxWidth: number;
    minWidth: number;
    frozenWidth?: number;
}

declare type SearchFilterValue = string | boolean;

interface ISearchFilter {
    fieldNames?: string[];
    type: string;
    values?: SearchFilterValue[];
    valueFrom?: string | number | null;
    valueTo?: string | number |  null;
    exclude?: boolean;
}

interface ISearchFilterType {
    [index: string]: string;
    EXACT_STRING: string;
    DATE_RANGE: string;
    DATE_TIME_RANGE: string;
    INT_RANGE: string;
    DOUBLE_RANGE: string;
    SEARCH_STRING: string;
    CHECK_EXISTENCE: string;
}

export {
    RgReactTableConfigItem,
    RgReactTableConfigTitle,
    RgReactTableConfig,
    IFilterType,
    IRangeValue,
    IChangeFilter,
    IChangeFilterField,
    IFilterField,
    IColumnSize,
    IColumnConfig,
    ISearchFilter,
    ISearchFilterType,
};
