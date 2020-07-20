import { RgReactCheckbox } from '@romger/react-checkbox';
import { FlexBox } from '@romger/react-flex-layout';
import { SORT_DIRECTION } from '@romger/react-global-module/lib/enums';
import { RgReactPagination } from '@romger/react-pagination';
import classnames from 'classnames';
import * as React from 'react';
import { IRangeValue } from '../../../interfaces';
// @ts-ignore
import ARROW_DOWNWARD from '../../assets/images/svg/arrow_downward-24px.svg';
// @ts-ignore
import ARROW_UPWARD from '../../assets/images/svg/arrow_upward-24px.svg';
// @ts-ignore
import FILTER_LIST from '../../assets/images/svg/filter_list-24px.svg';
// @ts-ignore
import FILTER_LIST_NEW from '../../assets/images/svg/filter_new.svg';
// @ts-ignore
import ARROW_DOWNWARD_NEW from '../../assets/images/svg/sort_down_new.svg';
// @ts-ignore
import ARROW_UPWARD_NEW from '../../assets/images/svg/sort_up_new.svg';
import { FilterTypeEnum } from '../../enums/filterType';
import { BaseDictionaryTableUtils } from '../../utils/baseDictionaryTableUtils';
import { BooleanFilter } from '../booleanFilter/booleanFilter';
import { DateRangeFilter } from '../dateRangeFilter/dateRangeFilter';
import { DictionaryFilter } from '../dictionaryFilter/dictionaryFilter';
import { IntRangeFilter } from '../intRangeFilter/intRangeFilter';
import { Sort } from '../sort/sort';
import { StringFilter } from '../stringFilter/stringFilter';
import { TableLoadingSpinner } from '../tableLoadingSpinner/tableLoadingSpinner';
import { RgReactTableSidebar } from '../tableSidebar/tableSidebar';
import { IItemWidthConfigRule, IRgReactTable, ITitleWidthConfigRule } from './dictionaryListSimpleTable';

export const fixWrapTemplate = (context: IRgReactTable) => (
    <div
        className={classnames(
            'dictionary-list__fix-column',
        )}
    >
        {
            headItemTemplate(
                context,
                context.getTitlesWithConfigRules(context.props.config.titles)
                        .filter((item: ITitleWidthConfigRule) => !!item.fix)[0],
                true,
            )
        }
        <div
            className={classnames(
                'dictionary-list__fix-row-wrap',
            )}
            style={{
                maxWidth: `${context.widthFixColumn}px`,
                width: `${context.widthFixColumn}px`,
                minWidth: `${context.widthFixColumn}px`,
            }}
            ref={(node: HTMLDivElement | null) => context.fixRowWrapRef = node}
        >
            {
                context.props.config.rows
                    .map((row: any, index: number) => context.getItemsWithConfigRules(row.items)
                                            .filter((item: IItemWidthConfigRule) => !!item.fix)
                                            .map((item: IItemWidthConfigRule, key: number) =>
                                                <div
                                                    key={key}
                                                    className={classnames(
                                                        'dictionary-list__fix-row-item',
                                                    )}
                                                    ref={(node: HTMLDivElement | null) => context.fixRowRefs[index] = node}
                                                    title={BaseDictionaryTableUtils.getValueForTd(item.item) ?? ''}
                                                >
                                                    {rowItemTemplate(context, item)}
                                                </div>,
                                            ))
            }
        </div>
    </div>
);

export const rowItemTemplate = (context: IRgReactTable, item: IItemWidthConfigRule, fix?: boolean) => (
    <>
        {
            item.item.customHTML
                ?
                item.item.customHTML
                :
                (
                    item.item.href
                        ?
                        <a
                            className={classnames(
                                {
                                    'dictionary-list__href': !!item.item.href,
                                },
                            )}
                            href={item.item.href}
                        >
                            {
                                BaseDictionaryTableUtils.getValueForTd(item.item)
                            }
                        </a>
                        :
                        <span
                            className={classnames(
                                {
                                    'dictionary-list__href': !!item.item.onClickItem,
                                },
                            )}
                            onClick={() => item.item.onClickItem ? item.item.onClickItem(item.item) : null}
                        >
                            {
                                BaseDictionaryTableUtils.getValueForTd(item.item)
                            }
                        </span>
                )
        }
    </>
);

export const headItemTemplate = (context: IRgReactTable, item: ITitleWidthConfigRule, fix?: boolean) => (
    <div
        key={item.originIndex}
        className={classnames(
            'dictionary-list__head-item',
            {
                'dictionary-list__head-item-hover': context.isThHasClick(item.title),
                'not-select': context.state.indexColumnByResize !== -1,
                'dictionary-list__head-item--hide': context.isHideColumn(item.originIndex) && !fix,
            },
        )}
        style={{
            maxWidth: `${context.getMaxWidthColumn(item.originIndex, fix)}px`,
            width: `${context.getMinWidthColumn(item.originIndex, fix)}px`,
            minWidth: `${context.getMinWidthColumn(item.originIndex, fix)}px`,
        }}
        onClick={() => context.isThHasClick(item.title) ? context.onThClick(item.title, item.originIndex) : null}
        ref={(node: HTMLDivElement | null) => context.headRefs[item.originIndex] = node}
    >
        <span
            className={classnames(
                'dictionary-list__head-item-wrap',
            )}
        >
            {
                !!item.title.isCheckbox
                    ?
                    <RgReactCheckbox
                        checked={item.title.allSelect ? item.title.allSelect() : false}
                    />
                    :
                    <>
                        <span
                            className={classnames(
                                'dictionary-list__head-item-title',
                            )}
                            title={item.title.title ?? ''}
                        >
                            {item.title.title}
                        </span>
                    </>
            }
        </span>
        {
            !!item.title.sortField && item.title.sortField === context.props.sort?.field &&
            <span
                className={classnames(
                    'dictionary-list__head-item-icon',
                    'dictionary-list__head-item-icon--sort',
                )}
                dangerouslySetInnerHTML={{ __html: context.props.sort && context.props.sort.direction === SORT_DIRECTION.ASC.value ? ARROW_DOWNWARD_NEW : ARROW_UPWARD_NEW }}
            />
        }
        {
            context.isThHasAnyFilterValue(item.title) &&
            <span
                className={classnames(
                    'dictionary-list__head-item-icon',
                    'dictionary-list__head-item-icon--filter',
                )}
                dangerouslySetInnerHTML={{ __html: FILTER_LIST_NEW }}
            />
        }
        {
            context.state.openThIndex === item.originIndex &&
            <div
                className={classnames(
                    'dictionary-list__filter-wrap',
                )}
                onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => e.stopPropagation()}
            >
                {
                    context.isThHasSort(item.title) &&
                    <Sort
                        item={item.title}
                        sortTh={context.sortTh}
                        selectedDirection={!!item.title.sortField && item.title.sortField === context.props.sort?.field ? (context.props.sort ? context.props.sort.direction : SORT_DIRECTION.ASC.value) : null}
                    />
                }
                {
                    context.isThHasFilter(item.title) &&
                    <>
                        {
                            context.isThHasFilterByType(item.title, FilterTypeEnum.DICTIONARY) &&
                            <DictionaryFilter
                                filterField={context.getFilterFieldByThItem(item.title)}
                                changeFilter={(dictionaryValue: any, checkExistenceValue: boolean | null) => context.updateFilterDictionaryValue(dictionaryValue, checkExistenceValue, item.title.filterField)}
                            />
                        }
                        {
                            context.isThHasFilterByType(item.title, FilterTypeEnum.STRING) &&
                            <StringFilter
                                filterField={context.getFilterFieldByThItem(item.title)}
                                changeFilter={(stringValue: string | null, checkExistenceValue: boolean | null) => context.updateFilterStringValue(stringValue, checkExistenceValue, item.title.filterField)}
                            />
                        }
                        {
                            context.isThHasFilterByType(item.title, FilterTypeEnum.INT_RANGE) &&
                            <IntRangeFilter
                                filterField={context.getFilterFieldByThItem(item.title)}
                                changeFilter={(intRangeValue: IRangeValue<number>, checkExistenceValue: boolean | null) => context.updateFilterIntRangeValue(intRangeValue, checkExistenceValue, item.title.filterField)}
                            />
                        }
                        {
                            !!(context.isThHasFilterByType(item.title, FilterTypeEnum.DATE_RANGE) || context.isThHasFilterByType(item.title, FilterTypeEnum.DATE_TIME_RANGE)) &&
                            <DateRangeFilter
                                filterField={context.getFilterFieldByThItem(item.title)}
                                withTime={context.isThHasFilterByType(item.title, FilterTypeEnum.DATE_TIME_RANGE)}
                                changeFilter={(dateRangeValue: IRangeValue<Date>, checkExistenceValue: boolean | null) => context.updateFilterDateRangeValue(dateRangeValue, checkExistenceValue, item.title.filterField)}
                            />
                        }
                        {
                            !!(context.isThHasFilterByType(item.title, FilterTypeEnum.BOOLEAN) || context.isThHasFilterByType(item.title, FilterTypeEnum.BOOLEAN)) &&
                            <BooleanFilter
                                filterField={context.getFilterFieldByThItem(item.title)}
                                changeFilter={(booleanValue: boolean | null) => context.updateFilterBooleanValue(booleanValue, item.title.filterField)}
                            />
                        }
                    </>
                }
            </div>
        }
        <div
            className={classnames(
                'dictionary-list__head-item-border',
            )}
            ref={(node: HTMLDivElement | null) => context.thBorderRefs[item.originIndex] = node}
            onDoubleClick={() => context.fitColumnForContent(item.originIndex)}
        />
    </div>
);

export const dictionaryListSimpleTableTemplate = (context: IRgReactTable) => (
    <div
        className={classnames(
            'dictionary-list',
        )}
    >
        <div
            className={classnames(
                'dictionary-list__main-wrap',
            )}
            style={{
                minHeight: `${context.state.minHeight}`,
                maxHeight: `${context.state.maxHeight}`,
            }}
        >
            {
                !!context.existFixLeftColumn && fixWrapTemplate(context)
            }
            <div
                className={classnames(
                    'dictionary-list__table-wrap',
                )}
            >
                <div
                    className={classnames(
                        'dictionary-list__head',
                    )}
                    ref={(node: HTMLDivElement | null) => context.headWrap = node}
                >
                    {
                        context.getTitlesWithConfigRules(context.props.config.titles)
                               .map((item: ITitleWidthConfigRule, index: number) => headItemTemplate(context, item))
                    }
                </div>
                <div
                    className={classnames(
                        'dictionary-list__table-block',
                        {
                            'dictionary-list__table-block--loading': context.props.loadingProcess,
                        },
                    )}
                    ref={(node: HTMLDivElement | null) => context.refWrap = node}
                >
                    <table
                        className={classnames(
                            'dictionary-list__table',
                        )}
                    >
                        <tbody>
                            {
                                !context.props.config.rows.length &&
                                <tr>
                                    {
                                        context.getTitlesWithConfigRules(context.props.config.titles)
                                               .map((item: ITitleWidthConfigRule, index: number) =>
                                            <td
                                                key={index}
                                                className={classnames(
                                                    {
                                                        'not-select': context.state.indexColumnByResize !== -1,
                                                        'row-hide': context.isHideColumn(item.originIndex),
                                                    },
                                                )}
                                                style={{
                                                    maxWidth: `${context.getMaxWidthColumn(item.originIndex)}px`,
                                                    minWidth: `${context.getMinWidthColumn(item.originIndex)}px`,
                                                }}
                                                ref={(node: HTMLTableDataCellElement | null) => context.tdRefs[item.originIndex] = node}
                                            >
                                                {
                                                    index === 0 &&
                                                    <FlexBox
                                                        row="center center"
                                                        className={classnames(
                                                            'dictionary-list__action-wrap',
                                                        )}
                                                    >
                                                        {context.props.config.applyFilter ? 'По вашему запросу ничего не найдено' : context.props.config.emptyMessage ? context.props.config.emptyMessage : 'Элементов нет'}
                                                    </FlexBox>
                                                }
                                            </td>,
                                        )
                                    }
                                </tr>
                            }
                            {
                                context.props.config.rows.map((row: any, index: number) =>
                                    <tr
                                        key={index}
                                        className={classnames({
                                            'dictionary-list__select-row': context.props.config.selectRow ? context.props.config.selectRow(row) : false,
                                            [row.className]: !!row.className,
                                        })}
                                        onDoubleClick={() => context.props.config.onDoubleClickRow ? context.props.config.onDoubleClickRow(row) : null}
                                        onClick={() => context.props.config.onClickRow ? context.props.config.onClickRow(row) : null}
                                        ref={(node: HTMLTableRowElement | null) => context.trRefs[index] = node}
                                    >
                                        {
                                            context.getItemsWithConfigRules(row.items)
                                                   .map((item: IItemWidthConfigRule, key: number) =>
                                                <td
                                                    key={item.originIndex}
                                                    className={classnames(
                                                        item.item.className ?? '',
                                                        {
                                                            'not-select': context.state.indexColumnByResize !== -1,
                                                            'row-hide': context.isHideColumn(item.originIndex),
                                                        },
                                                    )}
                                                    title={BaseDictionaryTableUtils.getValueForTd(item.item) ?? ''}
                                                    style={{
                                                        maxWidth: `${context.getMaxWidthColumn(item.originIndex)}px`,
                                                        minWidth: `${context.getMinWidthColumn(item.originIndex)}px`,
                                                    }}
                                                    ref={(node: HTMLTableDataCellElement | null) => context.tdRefs[item.originIndex] = node}
                                                >
                                                    {rowItemTemplate(context, item)}
                                                </td>,
                                            )
                                        }
                                    </tr>,
                                )
                            }
                        </tbody>
                    </table>
                </div>
                {
                    context.props.loadingProcess &&
                    <FlexBox
                        row={'ctr'}
                        className={classnames(
                            'dictionary-list__loading-overlay',
                        )}
                    >
                        <FlexBox
                            column={'ctr'}
                            className={classnames(
                                'dictionary-list__loading-spinner',
                            )}
                        >
                            <TableLoadingSpinner/>
                            <div
                                className={classnames(
                                    'table-loading-spinner__message',
                                )}
                            >
                                Выполняется загрузка данных. Пожалуйста, подождите.
                            </div>
                        </FlexBox>
                    </FlexBox>
                }
            </div>
            {
                !!context.existFixRightColumn && fixWrapTemplate(context)
            }
            {
                !!context.props.showSidebar &&
                <RgReactTableSidebar
                    filterFields={context.state.filterFields}
                    showExportTab={!!context.props.showExportTab}
                    updateFilterAllValue={context.updateFilterAllValue}
                    titles={
                        context.getTitlesWithConfigRules(context.props.config.titles)
                               .filter((item: ITitleWidthConfigRule) => !context.isHideColumn(item.originIndex) && !item.notExport)
                               .map((item: ITitleWidthConfigRule) => item.title)
                    }
                    rows={
                        context.props.config.rows
                            .map((row: any) => ({
                                items: context.getItemsWithConfigRules(row.items)
                                              .filter((item: IItemWidthConfigRule) => !context.isHideColumn(item.originIndex) && !item.notExport)
                                              .map((item: IItemWidthConfigRule, key: number) => item.item),
                            }))
                    }
                    titleForExportedFile={context.props.titleForExportedFile}
                    titlesWithConfigRules={context.getTitlesWithConfigRules(context.props.config.titles)}
                    columnsConfig={context.state.columnsConfig}
                    updateColumnsConfig={context.updateColumnsConfig}
                />
            }
        </div>
        {
            !context.props.config.withoutPagination &&
            !!context.props.pagination &&
            !!context.props.pagination.totalCount &&
            context.props.updatePaginationCallback &&
            <RgReactPagination
                onChangeHandler={context.props.updatePaginationCallback}
                pageNo={context.props.pagination.pageNo}
                totalSize={context.props.pagination.totalCount}
                pageSize={context.props.pagination.pageSize}
                showChangePageSize={context.props.config.showChangePageSize}
            />
        }
    </div>
);
