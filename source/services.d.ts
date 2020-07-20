import { IColumnConfig, IFilterField, ISearchFilter, RgReactTableConfigItem } from './interfaces';

interface IBaseDictionaryTableUtils {
    defaultModelField: string;
    defaultVisibleField: string;
    getValueForTd: (item: RgReactTableConfigItem) => string | null;
    getModelValue: (entity: any, dictionaryModelField?: string | null) => string;
    getVisibleValue: (entity: any, dictionaryVisibleField?: string | null) => string;
    getColumnConfig: (tableId: string) => IColumnConfig[];
    setColumnConfig: (tableId: string, config: IColumnConfig[]) => void;
    getMaxWidthColumn: (config: IColumnConfig[], index: number) => number | undefined;
    getMinWidthColumn: (config: IColumnConfig[], index: number) => number | undefined;
    isFiltersChanged: (filterFields: IFilterField[]) => boolean;
}

declare const BaseDictionaryTableUtils: IBaseDictionaryTableUtils;

interface ISearchFilterService {
    buildFilters: (filtersConfig: IFilterField[], notCalcTimeSet?: boolean) => ISearchFilter[];
}

declare const SearchFilterService: ISearchFilterService;

export {
    BaseDictionaryTableUtils,
    SearchFilterService,
};
