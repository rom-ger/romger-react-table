import * as moment from 'moment';
import { IColumnConfig, IFilterField, RgReactTableConfigItem } from '../../interfaces';
import { FilterTypeEnum } from '../enums/filterType';

export class BaseDictionaryTableUtils {
    static defaultModelField: string = 'id';
    static defaultVisibleField: string = 'name';

    /**
     * Получаем значение для ячейки
     */
    static getValueForTd = (item: RgReactTableConfigItem): string | null => {
        if (!item.isDate && item.value && (!item.visibleField || !!item.visibleField && item.value[item.visibleField])) {
            return item.visibleField ? item.value[item.visibleField] : item.value;
        }
        if (!!item.isDate && item.value && (!item.visibleField || !!item.visibleField && item.value[item.visibleField])) {
            return moment(item.visibleField ? item.value[item.visibleField] : item.value)
                .format(item.dateFormat ? item.dateFormat : 'DD.MM.YYYY');
        }
        return '';
    };

    /**
     * Получить значение по которому сравниваем сущности
     */
    static getModelValue = (entity: any, dictionaryModelField?: string | null): string => {
        if (typeof entity === 'string') {
            return entity;
        }
        if (!dictionaryModelField) {
            return entity[BaseDictionaryTableUtils.defaultModelField] ? entity[BaseDictionaryTableUtils.defaultModelField] : `${entity}`;
        }
        return entity[dictionaryModelField];
    };

    /**
     * Получить значение которое отображаем
     */
    static getVisibleValue = (entity: any, dictionaryVisibleField?: string | null): string => {
        if (typeof entity === 'string') {
            return entity;
        }
        if (!dictionaryVisibleField) {
            return entity[BaseDictionaryTableUtils.defaultVisibleField] ? entity[BaseDictionaryTableUtils.defaultVisibleField] : `${entity}`;
        }
        return entity[dictionaryVisibleField];
    };

    /**
     * Изменен ли фильтр
     * @param filterField
     */
    static isFilterChanged = (filterField: IFilterField) => {
        return (filterField.type === FilterTypeEnum.STRING && !!filterField.stringValue)
            || (filterField.type === FilterTypeEnum.INT_RANGE && !!filterField.intRangeValue)
            || (filterField.type === FilterTypeEnum.DATE_RANGE && (!!filterField?.dateRangeValue?.from || !!filterField?.dateRangeValue?.to))
            || (filterField.type === FilterTypeEnum.BOOLEAN && (filterField?.booleanValue !== null && filterField?.booleanValue !== undefined))
            || (filterField.type === FilterTypeEnum.DATE_TIME_RANGE && (!!filterField?.dateRangeValue?.from || !!filterField?.dateRangeValue?.to))
            || (filterField.type === FilterTypeEnum.DICTIONARY && !filterField.dictionaryMultiSelect && !!filterField.dictionaryValue)
            || (!!filterField.withCheckExistence && filterField.checkExistenceValue !== undefined && filterField.checkExistenceValue !== null)
            || (filterField.type === FilterTypeEnum.DICTIONARY && !!filterField.dictionaryMultiSelect && !!filterField.dictionaryValue && !!filterField.dictionaryValue.length);
    };

    /**
     * Изменены ли фильтры
     * @param filterFields
     */
    static isFiltersChanged = (filterFields: IFilterField[]): boolean => {
        return filterFields.some(filterField => BaseDictionaryTableUtils.isFilterChanged(filterField));
    };

    /**
     * Получаем информацию о сохранённом конфиге таблице
     */
    static getColumnConfig = (tableId: string): IColumnConfig[] => {
        try {
            let item = window.localStorage.getItem(`ws-table-save-config-${tableId}`);
            if (!item) {
                return [];
            }
            return JSON.parse(item);
        } catch (ex) {
            return [];
        }
    }

    /**
     * Запишем информацию о сохранённом конфиге таблице
     */
    static setColumnConfig = (tableId: string, config: IColumnConfig[]): void => {
        window.localStorage.setItem(`ws-table-save-config-${tableId}`, JSON.stringify(config));
    }

    /**
     * Получить максимальную ширину для колонки
     */
    static getMaxWidthColumn = (config: IColumnConfig[], index: number): number | undefined => {
        if (!config[index] || !config[index].size.maxWidth) {
            return undefined;
        }
        return config[index].size.maxWidth;
    }

    /**
     * Получить минимальную ширину для колонки
     */
    static getMinWidthColumn = (config: IColumnConfig[], index: number): number | undefined => {
        if (!config[index] || !config[index].size.minWidth) {
            return undefined;
        }
        return config[index].size.minWidth;
    }
}
