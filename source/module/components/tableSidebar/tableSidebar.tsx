import { RgReactBaseComponent } from '@romger/react-base-components';
import * as React from 'react';
import { IColumnConfig, IFilterField, RgReactTableConfigItem, RgReactTableConfigTitle } from '../../../interfaces';
// @ts-ignore
import FILTER_ICON from '../../assets/images/svg/ic_filter.svg';
// @ts-ignore
import FILTER_ICON_FILLED from '../../assets/images/svg/ic_filter_filled.svg';
import { BaseDictionaryTableUtils } from '../../utils/baseDictionaryTableUtils';
import { ITitleWidthConfigRule } from '../table/dictionaryListSimpleTable';
import { RgReactTableSidebarDataExport } from '../tableSidebarDataExport/tableSidebarDataExport';
import { RgReactTableSidebarFilters } from '../tableSidebarFilters/tableSidebarFilters';
import { RgReactTableSidebarSettings } from '../tableSidebarSettings/tableSidebarSettings';
import { tableSidebarTemplate } from './tableSidebarTemplate';

interface IRgReactTableSidebarTabConfig {
    title?: string | JSX.Element | null;
    icon?: any;
    content: any;
}

export interface IRgReactTableSidebarState {
    tabs: IRgReactTableSidebarTabConfig[];
    activeTabIndex: number;
    showSidebarContent: boolean;
}

export interface IRgReactTableSidebarProps {
    filterFields: IFilterField[];
    showExportTab: boolean;
    updateFilterAllValue: (changeFilterFields: IFilterField[]) => any;
    titles: RgReactTableConfigTitle[];
    rows: {
        items: RgReactTableConfigItem[];
    }[];
    titleForExportedFile?: string;
    titlesWithConfigRules: ITitleWidthConfigRule[];
    columnsConfig: IColumnConfig[];
    updateColumnsConfig: (newConfig: IColumnConfig[]) => any;
}

export interface IRgReactTableSidebar {
    state: IRgReactTableSidebarState;
    props: IRgReactTableSidebarProps;

    tabIsActive(tabIndex: number): boolean;

    selectTab(tabIndex: number): void;
}

class RgReactTableSidebar extends RgReactBaseComponent<IRgReactTableSidebarProps, IRgReactTableSidebarState> implements IRgReactTableSidebar {
    state: IRgReactTableSidebarState = {
        tabs: [],
        activeTabIndex: -1,
        showSidebarContent: false,
    };

    componentDidMount(): void {
        this.initTabs();
    }

    componentWillReceiveProps(nextProps: Readonly<IRgReactTableSidebarProps>): void {
        this.initTabs(nextProps);
    }

    /**
     * Инициализировать табы
     */
    initTabs = (props: IRgReactTableSidebarProps = this.props) => {
        const tabs: IRgReactTableSidebarTabConfig[] = [
            {
                title: 'Настройки',
                content: <RgReactTableSidebarSettings
                    titlesWithConfigRules={props.titlesWithConfigRules}
                    columnsConfig={props.columnsConfig}
                    updateColumnsConfig={props.updateColumnsConfig}
                />,
            },
        ];
        if (this.props.showExportTab) {
            tabs.unshift({
                title: 'Экспорт данных',
                content: <RgReactTableSidebarDataExport
                    titles={props.titles}
                    rows={props.rows}
                    titleForExportedFile={props.titleForExportedFile}
                />,
            })
        }
        if (!!props.filterFields.length) {
            tabs.unshift({
                icon: BaseDictionaryTableUtils.isFiltersChanged(props.filterFields)
                    ? FILTER_ICON_FILLED
                    : FILTER_ICON,
                content: <RgReactTableSidebarFilters
                    filterFields={props.filterFields}
                    updateFilterAllValue={(changeFilterFields: IFilterField[], notClose?: boolean) => {
                        if (!notClose) {
                            this.setState({
                                showSidebarContent: false,
                            });
                        }
                        this.props.updateFilterAllValue(changeFilterFields);
                    }}
                />,
            });
        }
        this.setState({ tabs });
    };

    /**
     * Активен ли таб
     * @param tabIndex
     */
    tabIsActive = (tabIndex: number) => this.state.activeTabIndex === tabIndex;

    /**
     * Выбрать таб
     * @param tabIndex
     */
    selectTab = (tabIndex: number) => this.setState({
        activeTabIndex: tabIndex,
        showSidebarContent: this.tabIsActive(tabIndex)
            ? !this.state.showSidebarContent
            : true,
    });

    render() {
        return tableSidebarTemplate(this);
    }
}

export { RgReactTableSidebar };
