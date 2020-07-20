import { FlexBox } from '@romger/react-flex-layout';
import classnames from 'classnames';
import * as React from 'react';
import { RgReactTableConfigItem } from '../../../interfaces';
import { BaseDictionaryTableUtils } from '../../utils/baseDictionaryTableUtils';
import DownloadExcelButton from '../downloadExcelButton/downloadExcelButton';
import { IRgReactTableSidebarDataExport } from './tableSidebarDataExport';

export const tableSidebarDataExportTemplate = (context: IRgReactTableSidebarDataExport) => (
    <FlexBox
        column={'start ctr'}
        className={classnames(
            'dictionary-list-table-sidebar-data-export',
        )}
    >
        <DownloadExcelButton
            title={context.props.titleForExportedFile ?? 'Таблица'}
            items={context.props.rows}
            columns={context.props.titles.map(title => title.title ?? '')}
            getValuesByItem={row => row.items.map((item: RgReactTableConfigItem) => BaseDictionaryTableUtils.getValueForTd(item))}
        />
    </FlexBox>
);
