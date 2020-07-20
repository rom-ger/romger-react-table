import { IBaseSortDTO, PaginationInterface } from '@romger/react-global-module/lib/interfaces';
import * as React from 'react';
import { IColumnConfig, IFilterField, RgReactTableConfig, RgReactTableConfigItem, RgReactTableConfigTitle } from './interfaces'

interface IRgReactTableProps {
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

declare class RgReactTable extends React.Component<IRgReactTableProps, any> {
}

declare class TableLoadingSpinner extends React.Component<any, any> {
}

interface IRgReactTableSidebarProps {
    filterFields: IFilterField[];
    updateFilterAllValue: (changeFilterFields: IFilterField[]) => any;
    titles: RgReactTableConfigTitle[];
    rows: Array<{
        items: RgReactTableConfigItem[];
    }>;
    titleForExportedFile?: string;
}

declare class RgReactTableSidebar extends React.Component<IRgReactTableSidebarProps, any> {
}

interface IRgReactTableSidebarDataExportProps {
    titles: RgReactTableConfigTitle[];
    rows: Array<{
        items: RgReactTableConfigItem[];
    }>;
    titleForExportedFile?: string;
}

declare class RgReactTableSidebarDataExport extends React.Component<IRgReactTableSidebarDataExportProps, any> {
}

interface ICollapsibleSidebarFilterBlockProps {
    children?: any;
    title?: string;
    scrollable?: boolean;
    shortContent?: string | null;
    flex?: boolean;
    collapsedByDefault?: boolean
    clearOneFilter: () => any;
}

declare class CollapsibleDataBlock extends React.Component<ICollapsibleSidebarFilterBlockProps, any> {
}

export {
    RgReactTable,
    TableLoadingSpinner,
    RgReactTableSidebar,
    RgReactTableSidebarDataExport,
    CollapsibleDataBlock,
};
