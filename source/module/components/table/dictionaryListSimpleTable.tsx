import { RgReactBaseComponent } from '@romger/react-base-components';
import { IBaseSortDTO, PaginationInterface } from '@romger/react-global-module/lib/interfaces';
import { UtilService } from '@romger/react-global-module/lib/services';
import { debounce } from 'lodash';
import { IChangeFilterField, IColumnConfig, IFilterField, IRangeValue, RgReactTableConfig, RgReactTableConfigItem, RgReactTableConfigTitle } from '../../../interfaces';
import { FilterTypeEnum } from '../../enums/filterType';
import { BaseDictionaryTableUtils } from '../../utils/baseDictionaryTableUtils';
import { dictionaryListSimpleTableTemplate } from './dictionaryListSimpleTableTemplate';

export interface IRgReactTableProps {
    titleForExportedFile?: string;
    pagination?: PaginationInterface;
    config: RgReactTableConfig;
    sort?: IBaseSortDTO;
    filterFields?: IFilterField[];
    loadingProcess?: boolean;
    minHeight?: string;
    maxHeight?: string;
    updatePaginationCallback?: (pagination: PaginationInterface) => any;
    changeFilter?: (changeStateObject: any) => any;
    showSidebar?: boolean;
    showExportTab?: boolean;
    changeColumnConfigCallback?: (columns: IColumnConfig[]) => any;
    id?: string;
    checkSaveColumnConfig?: boolean;
}

export interface IRgReactTableState {
    filterFields: IFilterField[];
    openThIndex: number;
    columnsConfig: IColumnConfig[];
    indexColumnByResize: number;
    minHeight: string;
    maxHeight: string;
}

export interface ITitleWidthConfigRule {
    title: RgReactTableConfigTitle;
    originIndex: number;
    notExport: boolean;
    fix: boolean;
}

export interface IItemWidthConfigRule {
    item: RgReactTableConfigItem;
    originIndex: number;
    notExport: boolean;
    fix: boolean;
}

export interface IRgReactTable {
    [index: string]: any;

    props: IRgReactTableProps;
    state: IRgReactTableState;
    minAvailableWidth: number;
    headRefs: Array<HTMLDivElement | null>;
    thBorderRefs: Array<HTMLDivElement | null>;
    tdRefs: Array<HTMLTableDataCellElement | null>;
    trRefs: Array<HTMLTableRowElement | null>;
    fixRowRefs: Array<HTMLDivElement | null>;
    refWrap: HTMLDivElement | null;
    headWrap: HTMLDivElement | null;
    fixRowWrapRef: HTMLDivElement | null;
    maxWidthColumn: number;
    minWidthColumn: number;
    startMousePosition: number;
    deltaHeadWidth: number;
    timeout: number;
    existFixRightColumn: boolean;
    existFixLeftColumn: boolean;
    widthFixColumn: number;
    maxWidthFixColumn: number;
    verticalScrollTarget: string | null;
    isThHasClick: (item: RgReactTableConfigTitle) => boolean;
    isHideColumn: (orderIndex: number) => boolean;
    isThHasSort: (item: RgReactTableConfigTitle) => boolean;
    isThHasFilter: (item: RgReactTableConfigTitle) => boolean;
    isThHasFilterByType: (item: RgReactTableConfigTitle, type: FilterTypeEnum) => boolean;
    isThHasAnyFilterValue: (item: RgReactTableConfigTitle) => boolean;
    onThClick: (item: RgReactTableConfigTitle, index: number) => any;
    sortTh: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, item: RgReactTableConfigTitle, sortDirection: string) => any;
    updateFilterDictionaryValue: (dictionaryValue: any, checkExistenceValue: boolean | null, field?: string) => any;
    updateFilterStringValue: (stringValue: any, checkExistenceValue: boolean | null, field?: string) => any;
    updateFilterIntRangeValue: (intRangeValue: IRangeValue<number>, checkExistenceValue: boolean | null, field?: string) => any;
    updateFilterDateRangeValue: (dateRangeValue: IRangeValue<Date>, checkExistenceValue: boolean | null, field?: string) => any;
    updateFilterBooleanValue: (booleanValue: boolean | null, field?: string) => any;
    getFilterFieldByThItem: (item: RgReactTableConfigTitle) => (IFilterField | null);
    updateFilterAllValue: (changeFilterFields: IFilterField[]) => any;
    getMaxWidthColumn: (index: number, fix?: boolean) => number;
    getMinWidthColumn: (index: number, fix?: boolean) => number;
    getTitlesWithConfigRules: (titles: RgReactTableConfigTitle[]) => ITitleWidthConfigRule[];
    getItemsWithConfigRules: (items: RgReactTableConfigItem[]) => IItemWidthConfigRule[];
    updateColumnsConfig: (newConfig: IColumnConfig[]) => any;

    fitColumnForContent(columnIndex: number): void;
}

class RgReactTable extends RgReactBaseComponent<IRgReactTableProps, IRgReactTableState> implements IRgReactTable {
    minAvailableWidth: number = 25;
    headRefs: Array<HTMLDivElement | null> = [];
    refWrap: HTMLDivElement | null = null;
    headWrap: HTMLDivElement | null = null;
    fixRowWrapRef: HTMLDivElement | null = null;
    thBorderRefs: Array<HTMLDivElement | null> = [];
    tdRefs: Array<HTMLTableDataCellElement | null> = [];
    fixRowRefs: Array<HTMLDivElement | null> = [];
    trRefs: Array<HTMLTableRowElement | null> = [];
    maxWidthColumn: number = 800;
    minWidthColumn: number = 150;
    timeout: number = 100;
    maxWidthFixColumn: number = 200;
    deltaHeadWidth: number = 5;
    startMousePosition: number = -1;
    verticalScrollTarget: string | null = null;

    initWithDebounce = debounce(this.init, 300);

    constructor(props: IRgReactTableProps) {
        super(props);
        this.state = {
            filterFields: [],
            columnsConfig: [],
            openThIndex: -1,
            indexColumnByResize: -1,
            minHeight: '255px',
            maxHeight: 'calc(100vh - 200px)',
        };
    }

    componentWillUnmount() {
        document.removeEventListener('mouseup', this.checkMouseUp);
        document.removeEventListener('mousemove', this.checkMouseMove);
        if (this.refWrap) {
            this.refWrap.removeEventListener('scroll', this.checkTableScroll);
        }
        if (this.fixRowWrapRef) {
            this.fixRowWrapRef.removeEventListener('scroll', this.checkFixRowWrapScroll);
        }
    }

    componentDidMount() {
        this.initWithDebounce();
        this.checkResizeStart();
    }

    componentWillReceiveProps(newProps: IRgReactTableProps) {
        this.initWithDebounce(newProps);
    }

    get existFixRightColumn(): boolean {
        return this.state.columnsConfig.findIndex((el: IColumnConfig) => !!el.fixRight && !el.hide && !el.hardHide) !== -1;
    }

    get existFixLeftColumn(): boolean {
        return this.state.columnsConfig.findIndex((el: IColumnConfig) => !!el.fixLeft && !el.hide && !el.hardHide) !== -1;
    }

    get widthFixColumn(): number {
        let index: number = this.state.columnsConfig.findIndex((el: IColumnConfig) => !!el.fixRight || !!el.fixLeft);
        if (index === -1) {
            return 0;
        }
        return this.getMaxWidthColumn(index, true);
    }

    init(props: IRgReactTableProps = this.props) {
        let columnConfig: IColumnConfig[] = props.checkSaveColumnConfig && props.id ? BaseDictionaryTableUtils.getColumnConfig(props.id) : [];
        this.setState(
            {
                filterFields: props.filterFields ? props.filterFields : [],
                columnsConfig: props.config.titles.map((title: RgReactTableConfigTitle, index: number) => {
                    let saveIndex: number = columnConfig.findIndex((el: IColumnConfig) => el.index === index);
                    let saveMaxWidth: number = saveIndex !== -1 && !title.fixRight && !title.fixLeft ? columnConfig[saveIndex].size.maxWidth : (title.maxWidth ? title.maxWidth : (!title.fixRight && !title.fixLeft ? this.maxWidthColumn : this.maxWidthFixColumn));
                    let saveMinWidth: number = saveIndex !== -1 && !title.fixRight && !title.fixLeft ? columnConfig[saveIndex].size.minWidth : (title.minWidth ? title.minWidth : (!title.fixRight && !title.fixLeft ? this.minWidthColumn : this.maxWidthFixColumn));
                    return {
                        index,
                        size: {
                            maxWidth: saveMaxWidth,
                            minWidth: saveMinWidth,
                            frozenWidth: saveIndex !== -1 ? (columnConfig[saveIndex].size.frozenWidth ?? undefined) : undefined,
                        },
                        orderIndex: saveIndex !== -1 ? columnConfig[saveIndex].orderIndex : (title.orderIndex !== undefined ? title.orderIndex : index),
                        hide: saveIndex !== -1 ? !!columnConfig[saveIndex].hide : !!title.hide,
                        hardHide: saveIndex !== -1 ? !!columnConfig[saveIndex].hardHide : !!title.hardHide,
                        notExport: !!title.notExport,
                        fixRight: !!title.fixRight,
                        fixLeft: !!title.fixLeft,
                    };
                }),
                minHeight: props.minHeight ? props.minHeight : this.state.minHeight,
                maxHeight: props.maxHeight ? props.maxHeight : this.state.maxHeight,
            },
            () => {
                if (this.fixRowWrapRef) {
                    this.fixRowWrapRef.addEventListener('scroll', this.checkFixRowWrapScroll);
                }
                let check: boolean = this.rewriteColumnsWidth();
                if (!check) {
                    this.initWithDebounce();
                }
            },
        );
    }

    /**
     * Начинаем чекать изменение ширины столбцов
     */
    checkResizeStart = () => {
        this.thBorderRefs.forEach((thBorderRef: HTMLDivElement | null, index: number) => {
            if (!thBorderRef) {
                return;
            }
            thBorderRef.addEventListener('mousedown', (e: MouseEvent) => {
                let columnsConfig: IColumnConfig[] = this.state.columnsConfig;
                let findIndex: number = columnsConfig.findIndex((el: IColumnConfig) => el.index === index);
                let headRef: HTMLDivElement | null | undefined = this.headRefs[index];
                if (!headRef || findIndex === -1) {
                    return;
                }
                columnsConfig[findIndex].size.maxWidth = headRef.clientWidth;
                columnsConfig[findIndex].size.minWidth = headRef.clientWidth;
                this.startMousePosition = e.clientX;
                this.setState(
                    {
                        columnsConfig,
                        indexColumnByResize: index,
                    });
            });
            thBorderRef.addEventListener('click', (e: MouseEvent) => {
                e.stopPropagation();
            });
        });
        document.addEventListener('mouseup', this.checkMouseUp);
        document.addEventListener('mousemove', this.checkMouseMove);
        if (this.refWrap) {
            this.refWrap.addEventListener('scroll', this.checkTableScroll);
        }
    };

    /**
     * Чекаем вертикальный скрол таблицы
     */
    checkTableScroll = () => {
        this.checkFixRowWrapScroll(null, true);
        if (!this.refWrap || !this.headWrap) {
            return;
        }
        this.headWrap.style.left = `-${this.refWrap.scrollLeft}px`;
    }

    /**
     * Чекаем горизонтальный скрол таблицы
     */
    checkFixRowWrapScroll = (e: any, isTableScroll?: boolean) => {
        if (!this.refWrap || !this.fixRowWrapRef) {
            return;
        }
        if (isTableScroll && this.verticalScrollTarget === 'FIX_WRAP') {
            this.verticalScrollTarget = null;
            return;
        }
        if (!isTableScroll && this.verticalScrollTarget === 'TABLE_WRAP') {
            this.verticalScrollTarget = null;
            return;
        }
        this.verticalScrollTarget = isTableScroll ? 'TABLE_WRAP' : 'FIX_WRAP';
        if (!!isTableScroll) {
            this.fixRowWrapRef.scrollTop = this.refWrap.scrollTop;
        } else {
            this.refWrap.scrollTop = this.fixRowWrapRef.scrollTop;
        }
        let minScroll = Math.min(this.refWrap.scrollTop, this.fixRowWrapRef.scrollTop);
        this.fixRowWrapRef.scrollTop = minScroll;
        this.refWrap.scrollTop = minScroll;
    }

    /**
     * Чекаем перемещение мыши для настройки ховера
     */
    checkHover = (evt: MouseEvent) => {
        let findFixRowIndex: number = -1;
        let findTableRowIndex: number = -1;
        this.trRefs.forEach((el: HTMLTableRowElement | null, index: number) => {
            if (!el) {
                return;
            }
            let targetElement: any = evt.target;
            do {
                if (el === targetElement || !targetElement) {
                    findTableRowIndex = targetElement ? index : -1;
                    return;
                }
                targetElement = targetElement.parentNode;
            } while (targetElement);
        });
        this.fixRowRefs.forEach((el: HTMLDivElement | null, index: number) => {
            if (!el) {
                return;
            }
            let targetElement: any = evt.target;
            do {
                if (el === targetElement || !targetElement) {
                    findFixRowIndex = targetElement ? index : -1;
                    return;
                }
                targetElement = targetElement.parentNode;
            } while (targetElement);
        });
        if (findTableRowIndex !== -1) {
            let el: HTMLDivElement | null = this.fixRowRefs[findTableRowIndex];
            if (!el) {
                return;
            }
            this.hoverOnElement(el);
        } else if (findFixRowIndex !== -1) {
            let el: HTMLTableRowElement | null = this.trRefs[findFixRowIndex];
            if (!el) {
                return;
            }
            this.hoverOnElement(el);
        } else {
            this.hoverOnElement(null);
        }
    }

    /**
     * Событие ховер на элементе
     */
    hoverOnElement(el: HTMLDivElement | null) {
        this.fixRowRefs.forEach((fixRowRef: HTMLDivElement | null) => {
            if (!fixRowRef) {
                return;
            }
            fixRowRef.classList.remove('row-hover');
        });
        this.trRefs.forEach((trRef: HTMLTableRowElement | null) => {
            if (!trRef) {
                return;
            }
            trRef.classList.remove('row-hover');
        });
        if (el) {
            el.classList.add('row-hover');
        }
    }

    /**
     * Чекаем перемещение мыши
     */
    checkMouseMove = (e: MouseEvent) => {
        this.checkHover(e);
        let columnsConfig: IColumnConfig[] = this.state.columnsConfig;
        let findIndex: number = columnsConfig.findIndex((el: IColumnConfig) => el.index === this.state.indexColumnByResize);
        if (findIndex === -1) {
            return;
        }
        let positionDelta = this.startMousePosition - e.clientX;
        let newWidth: number = columnsConfig[findIndex].size.maxWidth - positionDelta;
        if (newWidth < this.minAvailableWidth) {
            newWidth = this.minAvailableWidth;
        }
        let orderIndex: number | undefined = columnsConfig[findIndex].orderIndex;
        if (!this.refWrap || orderIndex === undefined) {
            return;
        }
        let tbody: any = this.refWrap.getElementsByTagName('tbody');
        if (!tbody || !tbody.length || !tbody[0]) {
            return;
        }
        let tr: any = tbody[0].getElementsByTagName('tr');
        if (!tr || !tr.length || !tr[0]) {
            return;
        }
        let headItem: HTMLDivElement | null | undefined = this.headRefs[this.state.indexColumnByResize];
        if (!!headItem) {
            headItem.style.maxWidth = `${newWidth}px`;
            headItem.style.minWidth = `${newWidth}px`;
        }
        for (let i = 0; i < tr.length; i++) {
            let tdArrays = tr[i].getElementsByTagName('td');
            if (!tdArrays || !tdArrays.length || !tdArrays[orderIndex] || !!tdArrays[orderIndex].classList.contains('row-hide')) {
                return;
            }
            let td = tdArrays[orderIndex];
            td.style.maxWidth = `${newWidth}px`;
            td.style.minWidth = `${newWidth}px`;
        }
    };

    /**
     * Чекаем отпускание мыши
     */
    checkMouseUp = (e: MouseEvent) => {
        e.stopPropagation();
        if (this.state.indexColumnByResize === -1 || !this.refWrap) {
            return;
        }

        // проставляем всем ячейкам в стили их реальную ширину
        let tbody: any = this.refWrap.getElementsByTagName('tbody');
        if (!tbody || !tbody.length || !tbody[0]) {
            return;
        }
        let allTdArrays = tbody[0].getElementsByTagName('td');
        for (let i = 0; i < allTdArrays.length; i++) {
            allTdArrays[i].style.maxWidth = `${allTdArrays[i].clientWidth}px`;
            allTdArrays[i].style.minWidth = `${allTdArrays[i].clientWidth}px`;
        }

        this.rewriteColumnsWidth();

        this.setState(
            {
                indexColumnByResize: -1,
            },
            () => this.sendUpdateConfigColumns(),
        );
    };

    /**
     * Пересчитываем высоту столбцов
     */
    rewriteRowHeight = () => {
        if (!this.existFixLeftColumn && !this.existFixRightColumn) {
            return;
        }
        this.trRefs.forEach((trRef: HTMLTableRowElement | null, index: number) => {
            let fixRowRef: HTMLDivElement | null = this.fixRowRefs[index];
            if (!trRef || !fixRowRef) {
                return;
            }
            let maxHeight = Math.max(trRef.clientHeight, fixRowRef.clientHeight);
            fixRowRef.style.maxHeight = `${maxHeight + 1}px`;
            fixRowRef.style.minHeight = `${maxHeight + 1}px`;
            let tds = trRef.getElementsByTagName('td');
            for (let i = 0; i < tds.length; i++) {
                if (!tds[i]) {
                    continue;
                }
                tds[i].style.maxHeight = `${maxHeight}px`;
                tds[i].style.minHeight = `${maxHeight}px`;
            }
        });
    }

    /**
     * Записываем в конфиг всех столбцов их реальную ширину
     */
    rewriteColumnsWidth = (): boolean => {
        this.rewriteRowHeight();
        let columnsConfig: IColumnConfig[] = this.state.columnsConfig;
        let countCheck: number = 0;
        this.tdRefs.forEach((td: HTMLTableDataCellElement, originIndex: number) => {
            let findIndex: number = columnsConfig.findIndex((el: IColumnConfig) => el.index === originIndex);
            if (findIndex === -1 || !td || (!td.classList.contains('row-hide') && td.clientWidth < this.minAvailableWidth)) {
                countCheck++;
                return;
            }
            if (columnsConfig[findIndex].fixRight || columnsConfig[findIndex].fixLeft) {
                return;
            }
            let columnWidth: number = td.clientWidth;
            let headWidth: number = this.getWidthHeadItem(this.headRefs[originIndex]);
            let maxWidth: number = headWidth > columnWidth ? headWidth + this.deltaHeadWidth : columnWidth;
            let minWidth: number = headWidth > columnWidth ? headWidth + this.deltaHeadWidth : columnWidth;
            columnsConfig[findIndex].size.maxWidth = maxWidth;
            columnsConfig[findIndex].size.minWidth = minWidth;
        });
        if (countCheck) {
            return false;
        }
        this.setState(
            {
                columnsConfig,
            },
            () => this.rewriteHeadWidth(),
        );
        return true;
    };

    /**
     * Даём всем заголовкам ширину их столбцов
     */
    rewriteHeadWidth = () => {
        if (!this.tdRefs.length) {
            return;
        }
        let columnsConfig: IColumnConfig[] = this.state.columnsConfig;
        this.headRefs.forEach((headRef: HTMLDivElement | null, originIndex: number) => {
            let findIndex: number = columnsConfig.findIndex((el: IColumnConfig) => el.index === originIndex);
            if (findIndex === -1) {
                return;
            }
            let td: HTMLTableDataCellElement | null = this.tdRefs[originIndex];
            if (!headRef || !td || !td.clientWidth || !!columnsConfig[findIndex].fixRight || !!columnsConfig[findIndex].fixLeft) {
                return;
            }
            let columnWidth: number = td.clientWidth;
            let headWidth: number = this.getWidthHeadItem(headRef);
            headRef.style.maxWidth = `${headWidth > columnWidth ? headWidth + this.deltaHeadWidth : columnWidth}px`;
            headRef.style.minWidth = `${headWidth > columnWidth ? headWidth + this.deltaHeadWidth : columnWidth}px`;
        });
    };

    /**
     * Получить ширину заголовка
     */
    getWidthHeadItem = (item: HTMLDivElement | null | undefined): number => {
        if (!item) {
            return 0;
        }
        return item.children[0].clientWidth;
    }

    /**
     * Отправляем наружу информацию о изменении конфигурации столбцов
     */
    sendUpdateConfigColumns = (columnsConfig: IColumnConfig[] = this.state.columnsConfig) => {
        if (this.props.checkSaveColumnConfig && this.props.id) {
            BaseDictionaryTableUtils.setColumnConfig(this.props.id, columnsConfig);
        }
        if (!this.props.changeColumnConfigCallback) {
            return;
        }
        this.props.changeColumnConfigCallback(this.state.columnsConfig);
    };

    /**
     * Получить максимальную ширину столбца
     */
    getMaxWidthColumn = (index: number, fix?: boolean): number => {
        let findIndex: number = this.state.columnsConfig.findIndex((el: IColumnConfig) => el.index === index);
        return findIndex !== -1 && this.state.columnsConfig[findIndex] ? this.state.columnsConfig[findIndex].size.maxWidth : (fix ? this.maxWidthFixColumn : this.maxWidthColumn);
    };

    /**
     * Получить минимальную ширину столбца
     */
    getMinWidthColumn = (index: number, fix?: boolean): number => {
        let findIndex: number = this.state.columnsConfig.findIndex((el: IColumnConfig) => el.index === index);
        return findIndex !== -1 && this.state.columnsConfig[findIndex] ? this.state.columnsConfig[findIndex].size.minWidth : (fix ? this.maxWidthFixColumn : this.minWidthColumn);
    };

    /**
     * Этот элемент в заголовке можно сортировать
     */
    isThHasSort = (item: RgReactTableConfigTitle): boolean => {
        return !!item.sortField;
    };

    /**
     * Эта колонка скрыта
     */
    isHideColumn = (originIndex: number): boolean => {
        let findIndex: number = this.state.columnsConfig.findIndex((el: IColumnConfig) => el.index === originIndex);
        if (findIndex === -1) {
            return true;
        }
        return !!this.state.columnsConfig[findIndex].hide || !!this.state.columnsConfig[findIndex].hardHide || !!this.state.columnsConfig[findIndex].fixRight || !!this.state.columnsConfig[findIndex].fixLeft;
    };

    /**
     * Этот элемент в заголовке можно фильтровать
     */
    isThHasFilter = (item: RgReactTableConfigTitle): boolean => {
        if (this.state.filterFields && this.state.filterFields.findIndex((filterField: IFilterField) => !!item.filterField && filterField.field === item.filterField) !== -1) {
            return true;
        }
        return false;
    };

    /**
     * Этот элемент в заголовке можно фильтровать по сущностям
     */
    isThHasFilterByType = (item: RgReactTableConfigTitle, type: FilterTypeEnum): boolean => {
        if (!this.state.filterFields) {
            return false;
        }
        let index: number = this.state.filterFields.findIndex((filterField: IFilterField) => !!item.filterField && filterField.field === item.filterField);
        if (index === -1) {
            return false;
        }
        return this.state.filterFields[index].type === type;
    };

    /**
     * Этот элемент в заголовке имеет применённый фильтр
     */
    isThHasAnyFilterValue = (item: RgReactTableConfigTitle): boolean => {
        if (!this.state.filterFields) {
            return false;
        }
        let index: number = this.state.filterFields.findIndex((filterField: IFilterField) => filterField.field === item.filterField);
        if (index === -1) {
            return false;
        }
        return !!this.state.filterFields[index].dateRangeValue?.from ||
            !!this.state.filterFields[index].dateRangeValue?.to ||
            (
                !!this.state.filterFields[index].intRangeValue &&
                (
                    this.state.filterFields[index].intRangeValue?.from !== null ||
                    this.state.filterFields[index].intRangeValue?.to !== null
                )
            ) ||
            (!this.state.filterFields[index].dictionaryMultiSelect && !!this.state.filterFields[index].dictionaryValue) ||
            (this.state.filterFields[index].booleanValue !== null && this.state.filterFields[index].booleanValue !== undefined) ||
            (!!this.state.filterFields[index].withCheckExistence && this.state.filterFields[index].checkExistenceValue !== undefined && this.state.filterFields[index].checkExistenceValue !== null) ||
            (!!this.state.filterFields[index].dictionaryMultiSelect && !!this.state.filterFields[index].dictionaryValue && !!this.state.filterFields[index].dictionaryValue.length) ||
            !!this.state.filterFields[index].stringValue;
    };

    /**
     * Этот элемент в заголовке можно кликнуть
     */
    isThHasClick = (item: RgReactTableConfigTitle): boolean => {
        if (!!item.onClick) {
            return true;
        }
        return !!this.isThHasSort(item) || !!this.isThHasFilter(item);
    };

    /**
     * Клик по ячейке из заголовков
     */
    onThClick = (item: RgReactTableConfigTitle, index: number) => {
        if (!!item.onClick) {
            return item.onClick();
        }
        if (!this.isThHasClick(item)) {
            return;
        }
        if (this.state.openThIndex === index) {
            return this.setState({ openThIndex: -1 });
        }
        this.setState(
            {
                openThIndex: index,
            },
            () => {
                let th: HTMLDivElement | null | undefined = this.headRefs[index];
                if (!th) {
                    return;
                }
                this.checkPositionFilter(th);
                UtilService.handlerOutsideClick([th], () => this.setState({ openThIndex: -1 }));
            },
        );
    };

    /**
     * Применяем сортировку
     */
    sortTh = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, item: RgReactTableConfigTitle, sortDirection: string) => {
        if (!this.props.sort || !item.sortField || !this.props.changeFilter) {
            return;
        }
        e.stopPropagation();
        let sort: IBaseSortDTO = { ...this.props.sort };
        sort.direction = sortDirection;
        sort.field = item.sortField;
        this.props.changeFilter(this.createChangeStateObject(sort, this.state.filterFields ? this.createChangeFiltersArray(this.state.filterFields) : []));
        this.setState(
            {
                openThIndex: -1,
            },
        );
    };

    /**
     * Создаём объект для обновления стейта в родительском контейнере
     */
    createChangeStateObject = (sort: IBaseSortDTO | undefined, filterFields: IChangeFilterField[]): any => {
        let updateState: any = {};
        if (sort) {
            updateState.sort = sort;
        }
        if (filterFields) {
            filterFields.forEach((filterField: IChangeFilterField) => {
                if (filterField.type === FilterTypeEnum.DICTIONARY) {
                    updateState[filterField.field] = filterField.dictionaryValue;
                }
                if (filterField.type === FilterTypeEnum.STRING) {
                    updateState[filterField.field] = filterField.stringValue;
                }
                if (filterField.type === FilterTypeEnum.INT_RANGE) {
                    updateState[filterField.field] = filterField.intRangeValue;
                }
                if (filterField.type === FilterTypeEnum.BOOLEAN) {
                    updateState[filterField.field] = filterField.booleanValue;
                }
                if (filterField.type === FilterTypeEnum.DATE_RANGE || filterField.type === FilterTypeEnum.DATE_TIME_RANGE) {
                    updateState[filterField.field] = filterField.dateRangeValue;
                }
                if (filterField.withCheckExistence) {
                    updateState[`${filterField.field}CheckExistence`] = filterField.checkExistenceValue;
                }
            });
        }
        return updateState;
    };

    /**
     * Проверяем правильность расположения панельки фильтоов
     */
    checkPositionFilter = (th: HTMLDivElement) => {
        if (!this.refWrap) {
            return;
        }
        let filterWrapArray: HTMLCollectionOf<Element> = th.getElementsByClassName('dictionary-list__filter-wrap');
        if (!filterWrapArray.length) {
            return;
        }
        let filterWrap: any = filterWrapArray[0];
        if (!filterWrap) {
            return;
        }
        let currentDelta: number = 22;
        let clientRectWrap: DOMRect = this.refWrap.getBoundingClientRect();
        let clientRectFilterWrap: DOMRect = filterWrap.getBoundingClientRect();
        if ((clientRectWrap.x + clientRectWrap.width) < (clientRectFilterWrap.x + clientRectFilterWrap.width + currentDelta)) {
            let delta: number = (clientRectFilterWrap.x + clientRectFilterWrap.width + currentDelta) - (clientRectWrap.x + clientRectWrap.width);
            filterWrap.style.left = `-${delta}px`;
        }
    };

    /**
     * Создаём массив изменённых фильтров
     */
    createChangeFiltersArray = (filterFields: IFilterField[]): IChangeFilterField[] => {
        let changeFilters: IChangeFilterField[] = [];
        filterFields.forEach((filterField: IFilterField) => {
            let changeFilter: IChangeFilterField = {
                field: filterField.field,
                type: filterField.type,
                withCheckExistence: filterField.withCheckExistence,
            };
            if (filterField.type === FilterTypeEnum.DICTIONARY) {
                changeFilter.dictionaryValue = filterField.dictionaryValue;
            }
            if (filterField.type === FilterTypeEnum.DATE_RANGE) {
                changeFilter.dateRangeValue = filterField.dateRangeValue;
            }
            if (filterField.type === FilterTypeEnum.DATE_TIME_RANGE) {
                changeFilter.dateRangeValue = filterField.dateRangeValue;
            }
            if (filterField.type === FilterTypeEnum.STRING) {
                changeFilter.stringValue = filterField.stringValue;
            }
            if (filterField.type === FilterTypeEnum.INT_RANGE) {
                changeFilter.intRangeValue = filterField.intRangeValue;
            }
            if (filterField.type === FilterTypeEnum.BOOLEAN) {
                changeFilter.booleanValue = filterField.booleanValue;
            }
            if (filterField.withCheckExistence) {
                changeFilter.checkExistenceValue = filterField.checkExistenceValue;
            }
            changeFilters.push(changeFilter);
        });
        return changeFilters;
    };

    /**
     * Применяем сразу все фильтры
     */
    updateFilterAllValue = (changeFilterFields: IFilterField[]) => {
        if (!this.props.changeFilter) {
            return;
        }
        this.props.changeFilter(this.createChangeStateObject(this.props.sort, this.createChangeFiltersArray(changeFilterFields)));
        this.setState(
            {
                filterFields: changeFilterFields,
            },
            () => this.rewriteColumnsWidth(),
        );
    };

    /**
     * Применяем фильтр по сущносятм
     */
    updateFilterDictionaryValue = (dictionaryValue: any, checkExistenceValue: boolean | null, field?: string) => {
        let filterFields: IFilterField[] | undefined = this.state.filterFields;
        if (!filterFields) {
            return;
        }
        let index: number = filterFields.findIndex((filterField: IFilterField) => filterField.field === field);
        if (index === -1 || !this.props.changeFilter) {
            return;
        }
        filterFields[index].dictionaryValue = dictionaryValue;
        let changeCheckExistence: boolean = false;
        if (filterFields[index].withCheckExistence) {
            changeCheckExistence = filterFields[index].checkExistenceValue !== checkExistenceValue;
            filterFields[index].checkExistenceValue = checkExistenceValue;
        }
        this.props.changeFilter(this.createChangeStateObject(this.props.sort, this.createChangeFiltersArray(filterFields)));
        this.setState(
            {
                filterFields,
                openThIndex: filterFields[index].dictionaryMultiSelect && !changeCheckExistence ? this.state.openThIndex : -1,
            });
    };

    /**
     * Применяем фильтр по строке
     */
    updateFilterStringValue = (stringValue: string | null, checkExistenceValue: boolean | null, field?: string) => {
        let filterFields: IFilterField[] | undefined = this.state.filterFields;
        if (!filterFields) {
            return;
        }
        let index: number = filterFields.findIndex((filterField: IFilterField) => filterField.field === field);
        if (index === -1 || !this.props.changeFilter) {
            return;
        }
        filterFields[index].stringValue = stringValue;
        if (filterFields[index].withCheckExistence) {
            filterFields[index].checkExistenceValue = checkExistenceValue;
        }
        this.props.changeFilter(this.createChangeStateObject(this.props.sort, this.createChangeFiltersArray(filterFields)));
        this.setState(
            {
                filterFields,
                openThIndex: -1,
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
        if (index === -1 || !this.props.changeFilter) {
            return;
        }
        filterFields[index].intRangeValue = intRangeValue;
        if (filterFields[index].withCheckExistence) {
            filterFields[index].checkExistenceValue = checkExistenceValue;
        }
        this.props.changeFilter(this.createChangeStateObject(this.props.sort, this.createChangeFiltersArray(filterFields)));
        this.setState(
            {
                filterFields,
                openThIndex: -1,
            });
    };

    /**
     * Применяем фильтр по диапазону дат
     */
    updateFilterDateRangeValue = (dateRangeValue: IRangeValue<Date>, checkExistenceValue: boolean | null, field?: string) => {
        let filterFields: IFilterField[] | undefined = this.state.filterFields;
        if (!filterFields) {
            return;
        }
        let index: number = filterFields.findIndex((filterField: IFilterField) => filterField.field === field);
        if (index === -1 || !this.props.changeFilter) {
            return;
        }
        filterFields[index].dateRangeValue = dateRangeValue;
        if (filterFields[index].withCheckExistence) {
            filterFields[index].checkExistenceValue = checkExistenceValue;
        }
        this.props.changeFilter(this.createChangeStateObject(this.props.sort, this.createChangeFiltersArray(filterFields)));
        this.setState(
            {
                filterFields,
                openThIndex: -1,
            });
    };

    /**
     * Применяем буленовский фильтр
     */
    updateFilterBooleanValue = (booleanValue: boolean | null, field?: string) => {
        let filterFields: IFilterField[] | undefined = this.state.filterFields;
        if (!filterFields) {
            return;
        }
        let index: number = filterFields.findIndex((filterField: IFilterField) => filterField.field === field);
        if (index === -1 || !this.props.changeFilter) {
            return;
        }
        filterFields[index].booleanValue = booleanValue;
        this.props.changeFilter(this.createChangeStateObject(this.props.sort, this.createChangeFiltersArray(filterFields)));
        this.setState(
            {
                filterFields,
                openThIndex: -1,
            });
    };

    /**
     * Ищем конфиг фильтра по ячейке из заголовков
     */
    getFilterFieldByThItem = (item: RgReactTableConfigTitle): (IFilterField | null) => {
        let filterFields: IFilterField[] | undefined = this.state.filterFields;
        if (!filterFields) {
            return null;
        }
        let index: number = filterFields.findIndex((filterField: IFilterField) => filterField.field === item.filterField);
        if (index === -1) {
            return null;
        }
        return filterFields[index];
    };

    /**
     * Изменить ширину столбца под контент в ячейках
     * @param columnIndex
     */
    fitColumnForContent = (columnIndex: number) => {
        if (!this.refWrap) return;

        let columnsConfig: IColumnConfig[] = [
            ...this.state.columnsConfig.map(columnSize => ({ ...columnSize })),
        ];
        let findIndex: number = this.state.columnsConfig.findIndex((el: IColumnConfig) => el.index === columnIndex);
        let orderIndex: number | undefined = this.state.columnsConfig[findIndex].orderIndex;
        if (findIndex === -1 || orderIndex === undefined) {
            return;
        }

        const tdOfColumn = Array.from(this.refWrap.getElementsByTagName('tr'))
            .map(trEl => orderIndex === undefined ? null : trEl.getElementsByTagName('td')[orderIndex])
            .slice(1)
            .filter((td): td is HTMLTableDataCellElement => !!td);

        if (!tdOfColumn.length) return;

        const maxScrollWidth = Math.max(...tdOfColumn.map(tdEl => tdEl.scrollWidth));

        /**
         * У всех элементов одинаковый scrollWidth => или элементы растянуты
         * по ширине контента, или по ширине они занимают больше места,
         * чем контент внутри
         */
        const allCellsContentWidthSameScrollWidth = tdOfColumn
            .map(tdEl => tdEl.scrollWidth)
            .every(width => width === maxScrollWidth);

        if (allCellsContentWidthSameScrollWidth) {
            const maxChildOffsetWidth = Math.max(
                ...tdOfColumn.map((tdEl) => {
                    const tdChildren = tdEl.children[0] as HTMLElement;
                    return tdChildren?.offsetWidth ?? 0;
                }),
            );

            const newTdWidth = maxChildOffsetWidth;

            tdOfColumn.forEach((tdEl) => {
                tdEl.style.maxWidth = `${newTdWidth}px`;
                tdEl.style.minWidth = `${newTdWidth}px`;
            });

            columnsConfig[findIndex].size.maxWidth = newTdWidth;
            columnsConfig[findIndex].size.minWidth = newTdWidth;

            this.setState({ columnsConfig }, () => this.sendUpdateConfigColumns());

            return;
        }

        tdOfColumn.forEach((tdEl) => {
            tdEl.style.maxWidth = `${maxScrollWidth}px`;
            tdEl.style.minWidth = `${maxScrollWidth}px`;
        });

        columnsConfig[findIndex].size.maxWidth = maxScrollWidth;
        columnsConfig[findIndex].size.minWidth = maxScrollWidth;

        this.setState({ columnsConfig }, () => this.sendUpdateConfigColumns());
    };

    /**
     * Получить заголовки после применённого конфига
     */
    getTitlesWithConfigRules = (titles: RgReactTableConfigTitle[]): ITitleWidthConfigRule[] => {
        let draft: any[] = titles
            .map((title: RgReactTableConfigTitle, originIndex: number) => {
                let findIndex: number = this.state.columnsConfig.findIndex((el: IColumnConfig) => el.index === originIndex);
                return {
                    originIndex,
                    title,
                    orderIndex: findIndex === -1 ? originIndex : this.state.columnsConfig[findIndex].orderIndex,
                    notExport: title.notExport,
                    fix: title.fixRight || title.fixLeft,
                };
            })
            .sort((a: any, b: any) => a.orderIndex - b.orderIndex);
        return draft.map((el: any) => ({
            title: el.title,
            originIndex: el.originIndex,
            notExport: el.notExport,
            fix: el.fix,
        }));
    }

    /**
     * Получить ячейки после применённого конфига
     */
    getItemsWithConfigRules = (items: RgReactTableConfigItem[]): IItemWidthConfigRule[] => {
        let draft: any[] = items
            .map((item: RgReactTableConfigItem, originIndex: number) => {
                let findIndex: number = this.state.columnsConfig.findIndex((el: IColumnConfig) => el.index === originIndex);
                return {
                    originIndex,
                    item,
                    orderIndex: findIndex === -1 ? originIndex : this.state.columnsConfig[findIndex].orderIndex,
                    notExport: findIndex === -1 ? false : this.state.columnsConfig[findIndex].notExport,
                    fix: findIndex === -1 ? false : (this.state.columnsConfig[findIndex].fixRight || this.state.columnsConfig[findIndex].fixLeft),
                };
            })
            .sort((a: any, b: any) => a.orderIndex - b.orderIndex);
        return draft.map((el: any) => ({
            item: el.item,
            originIndex: el.originIndex,
            notExport: el.notExport,
            fix: el.fix,
        }));
    }

    /**
     * Обновляем конфиг извне
     */
    updateColumnsConfig = (newConfig: IColumnConfig[]) => {
        if (this.props.checkSaveColumnConfig && this.props.id) {
            BaseDictionaryTableUtils.setColumnConfig(this.props.id, newConfig);
        }
        this.setState(
            {
                columnsConfig: newConfig,
            },
            () => {
                window.setTimeout(
                    () => {
                        this.rewriteColumnsWidth();
                        this.sendUpdateConfigColumns();
                    },
                    this.timeout * 4,
                );
            },
        );
    }

    render() {
        return dictionaryListSimpleTableTemplate(this);
    }
}

export { RgReactTable };
