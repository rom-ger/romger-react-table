import { FlexBox } from '@romger/react-flex-layout';
import classnames from 'classnames';
import * as React from 'react';
import { IRangeValue } from '../../../interfaces';
import { FilterTypeEnum } from '../../enums/filterType';
import { BooleanFilter } from '../booleanFilter/booleanFilter';
import CollapsibleDataBlock from '../collapsibleSidebarFilterBlock/collapsibleSidebarFilterBlockComponent';
import { DateRangeFilter } from '../dateRangeFilter/dateRangeFilter';
import { DictionaryFilter } from '../dictionaryFilter/dictionaryFilter';
import { IntRangeFilter } from '../intRangeFilter/intRangeFilter';
import { StringFilter } from '../stringFilter/stringFilter';
import { IRgReactTableSidebarFilters } from './tableSidebarFilters';

export const tableSidebarFiltersTemplate = (context: IRgReactTableSidebarFilters) => (
    <FlexBox
        column={'start stretch'}
        className={classnames(
            'dictionary-list-table-sidebar-filters',
        )}
    >
        <FlexBox
            shrink="0"
            row="space-between center"
            className={classnames(
                'dictionary-list-table-sidebar-filters__header',
            )}
        >
            <FlexBox
                row="center center"
                className={classnames(
                    'dictionary-list-filter-wrap__apply-action',
                )}
                onClick={() => context.apply()}
            >
                Применить
            </FlexBox>
            <FlexBox
                row="center center"
                className={classnames(
                    'dictionary-list-filter-wrap__apply-action',
                    'dictionary-list-filter-wrap__apply-action--default',
                )}
                onClick={context.clearAll}
            >
                Очистить
            </FlexBox>
        </FlexBox>
        <FlexBox
            flex
            className={classnames(
                'dictionary-list-table-sidebar-filters__filter-wrap',
            )}
        >
            {
                context.state.filterFields.map(filterField => (
                    filterField.type === FilterTypeEnum.GROUP_TITLE
                    ?
                    <div
                        key={filterField.field}
                        className={classnames(
                            'dictionary-list-table-sidebar-filters__filter-group-title',
                        )}
                    >
                        {filterField.field}
                    </div>
                    :
                    <CollapsibleDataBlock
                        collapsedByDefault
                        key={filterField.field}
                        title={filterField.filterTitle}
                        shortContent={context.getShortContentByFilter(filterField)}
                        clearOneFilter={() => context.clearOneFilter(filterField)}
                    >
                        {
                            filterField.type === FilterTypeEnum.DICTIONARY &&
                            <DictionaryFilter
                                filterField={filterField}
                                fastUpdate
                                changeFilter={(dictionaryValue: any, checkExistenceValue: boolean | null) => context.updateFilterDictionaryValue(dictionaryValue, checkExistenceValue, filterField.field)}
                            />
                        }
                        {
                            filterField.type === FilterTypeEnum.STRING &&
                            <StringFilter
                                filterField={filterField}
                                fastUpdate
                                changeFilter={(stringValue: string | null, checkExistenceValue: boolean | null) => context.updateFilterStringValue(stringValue, checkExistenceValue, filterField.field)}
                            />
                        }
                        {
                            filterField.type === FilterTypeEnum.INT_RANGE &&
                            <IntRangeFilter
                                filterField={filterField}
                                fastUpdate
                                changeFilter={(intRangeValue: IRangeValue<number>, checkExistenceValue: boolean | null) => context.updateFilterIntRangeValue(intRangeValue, checkExistenceValue, filterField.field)}
                            />
                        }
                        {
                            !!(filterField.type === FilterTypeEnum.DATE_RANGE || filterField.type === FilterTypeEnum.DATE_TIME_RANGE) &&
                            <DateRangeFilter
                                filterField={filterField}
                                fastUpdate
                                withTime={filterField.type === FilterTypeEnum.DATE_TIME_RANGE}
                                changeFilter={(dateRangeValue: IRangeValue<Date>, checkExistenceValue: boolean | null) => context.updateFilterDateRangeValue(dateRangeValue, checkExistenceValue, filterField.field)}
                            />
                        }
                        {
                            filterField.type === FilterTypeEnum.BOOLEAN &&
                            <BooleanFilter
                                filterField={filterField}
                                fastUpdate
                                changeFilter={(booleanValue: boolean | null) => context.updateFilterBooleanValue(booleanValue, filterField.field)}
                            />
                        }
                    </CollapsibleDataBlock>
                ))
            }
        </FlexBox>
    </FlexBox>
);
