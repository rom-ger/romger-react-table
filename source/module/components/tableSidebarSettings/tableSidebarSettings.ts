import { RgReactBaseComponent } from '@romger/react-base-components';
import { DropResult, ResponderProvided } from 'react-beautiful-dnd';
import { IColumnConfig } from '../../../interfaces';
import { ITitleWidthConfigRule } from '../table/dictionaryListSimpleTable';
import { tableSidebarSettingsTemplate } from './tableSidebarSettingsTemplate';

export interface IRgReactTableSidebarSettingsProps {
    updateColumnsConfig: (newConfig: IColumnConfig[]) => any;
    titlesWithConfigRules: ITitleWidthConfigRule[];
    columnsConfig: IColumnConfig[];
}

export interface IRgReactTableSidebarSettingsState {
    items: any[];
}

export interface IRgReactTableSidebarSettings {
    props: IRgReactTableSidebarSettingsProps;
    state: IRgReactTableSidebarSettingsState;
    isHardHideColumn: (orderIndex: number) => boolean;
    isShowColumn: (orderIndex: number) => boolean;
    toggleColumn: (orderIndex: number) => any;
    onDragEnd: (result: DropResult, provided: ResponderProvided) => any;
}

class RgReactTableSidebarSettings extends RgReactBaseComponent<IRgReactTableSidebarSettingsProps, IRgReactTableSidebarSettingsState> implements IRgReactTableSidebarSettings {
    state: IRgReactTableSidebarSettingsState = {
        items: [],
    };

    /**
     * Эта колонка скрыта
     */
    isHardHideColumn = (originIndex: number): boolean => {
        let findIndex: number = this.props.columnsConfig.findIndex((el: IColumnConfig) => el.index === originIndex);
        if (findIndex === -1) {
            return true;
        }
        return !!this.props.columnsConfig[findIndex].hardHide || !!this.props.columnsConfig[findIndex].fixLeft || !!this.props.columnsConfig[findIndex].fixRight;
    };

    /**
     * Эта колонка не выключена
     */
    isShowColumn = (originIndex: number): boolean => {
        let findIndex: number = this.props.columnsConfig.findIndex((el: IColumnConfig) => el.index === originIndex);
        if (findIndex === -1) {
            return false;
        }
        return !this.props.columnsConfig[findIndex].hide;
    };

    /**
     * Показать/Скрыть колонку
     */
    toggleColumn = (originIndex: number) => {
        let columnsConfig: IColumnConfig[] = this.props.columnsConfig
            .map((el: IColumnConfig) => ({ ...el }));
        let findIndex: number = columnsConfig.findIndex((el: IColumnConfig) => el.index === originIndex);
        if (findIndex === -1) {
            return;
        }
        columnsConfig[findIndex].hide = !columnsConfig[findIndex].hide;
        if (columnsConfig[findIndex].hide) {
            columnsConfig[findIndex].size.frozenWidth = columnsConfig[findIndex].size.maxWidth;
        } else if (columnsConfig[findIndex].size.frozenWidth) {
            columnsConfig[findIndex].size.maxWidth = columnsConfig[findIndex].size.frozenWidth ?? columnsConfig[findIndex].size.maxWidth;
            columnsConfig[findIndex].size.minWidth = columnsConfig[findIndex].size.frozenWidth ?? columnsConfig[findIndex].size.minWidth;
        }
        this.props.updateColumnsConfig(columnsConfig);
    };

    /**
     * Закончили перетягивать. и что?
     */
    onDragEnd = (result: DropResult, provided: ResponderProvided) => {
        if (!result.destination) {
            return;
        }
        let columnsConfig: IColumnConfig[] = this.props.columnsConfig
            .map((el: IColumnConfig) => ({ ...el }))
            .sort((a: any, b: any) => a.orderIndex - b.orderIndex);
        let dropElement: IColumnConfig = { ...columnsConfig[result.source.index] };
        columnsConfig.splice(result.source.index, 1);
        columnsConfig.splice(result.destination.index, 0, dropElement);
        this.props.updateColumnsConfig(columnsConfig.map((el: IColumnConfig, index: number) => {
            el.orderIndex = index;
            return el;
        }));
    }

    render() {
        return tableSidebarSettingsTemplate(this);
    }
}

export { RgReactTableSidebarSettings };
