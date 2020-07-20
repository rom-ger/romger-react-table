import { RgReactBaseComponent } from '@romger/react-base-components';
import classnames from 'classnames';
import * as React from 'react';
import { ExcelFile, ExcelSheet } from './reactExportExcel';

declare type DownloadExcelButtonPropsValuesByItem = string | number;

interface IDownloadExcelButtonProps {
    title: string;
    items: any[];
    columns: string[];
    getValuesByItem: (item: any) => DownloadExcelButtonPropsValuesByItem[];
}

export interface IDownloadExcelButton {
    props: IDownloadExcelButtonProps;
}

export default class DownloadExcelButton extends RgReactBaseComponent<IDownloadExcelButtonProps, {}> implements IDownloadExcelButton {
    render(): false | JSX.Element {
        return !!this.props.items.length &&
            <ExcelFile
                element={
                    <button
                        className={classnames(
                            'click',
                            'download-excel-button',
                        )}
                    >
                        Скачать в Excel
                    </button>
                }
                filename={this.props.title}
            >
                <ExcelSheet
                    dataSet={[
                        {
                            columns: this.props.columns,
                            data: this.props.items.map((el: any) => this.props.getValuesByItem(el)
                                .map((value: string | number) => ({
                                    value,
                                }))),
                        },
                    ]}
                    name={this.props.title}
                />
            </ExcelFile>;
    }
}
