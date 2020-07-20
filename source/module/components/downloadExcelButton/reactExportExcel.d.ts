import * as React from 'react';
/* index.d.ts (C) react-data- */

// TypeScript Version: 2.2

export interface ExcelFileProps {
    filename?: string;
    fileExtension?: string;
    element?: any;
    children?: any;
}

export interface ExcelSheetProps {
    name: string;
    data?: object[];
    dataSet?: ExcelSheetData[];
    value?: string[] | (() => any);
    children?: ExcelColumnProps[]
}

export interface ExcelSheetData {
    xSteps?: number;
    ySteps?: number;
    columns: string[];
    data: ExcelCell[][];
}

export interface ExcelCell {
    value: string | number | Date | boolean;
    style?: ExcelStyle;
}

export interface ExcelColumnProps {
    label: string;
    value: number | boolean | string | (() => any);
}

export interface ExcelStyle {
    fill?: ExcelCellFillType;
    font?: ExcelFont;
    numFmt?: ExcelNumFormat;
    alignment?: ExcelAlignment;
    border?: ExcelBorder;
}

/* ExcelCell Fill Type */
type ExcelCellPatternType = 'solid' | 'none';

export interface ExcelColorSpec {
    auto?: number; // default 1
    rgb?: string; // hex ARGB color
    theme?: ExcelTheme;
    indexed?: number;
}

export interface ExcelTheme {
    theme: string;
    tint: string;
}

export interface ExcelCellFillType {
    patternType?: ExcelCellPatternType;
    fgColor?: ExcelColorSpec;
    bgColor?: ExcelColorSpec;
}

/* Excel Font */
export interface ExcelFont {
    name?: string;          // default `'Calibri'`
    sz?: number;             // font size in points default 11
    color?: ExcelColorSpec;
    bold?: boolean;
    underline?: boolean;
    italic?: boolean;
    strike?: boolean;
    outline?: boolean;
    shadow?: boolean;
    vertAlign?: boolean;
}

/* ExcelNumFormat */
type ExcelNumFormat = '0' | '0.00%' | '0.0%' | '0.00%;\\(0.00%\\);\\-;@' | 'm/dd/yy' | string;

/* ExcelAlignment */
export interface ExcelAlignment {
    vertical?: ExcelAlignmentType;
    horizontal?: ExcelAlignmentType;
    wrapText?: boolean;
    readingOrder?: ExcelReadingOrder;
    textRotation?: ExcelTextRotation;
}

type ExcelTextRotation = 0 | 45 | 90 | 135 | 180 | 255;

declare enum ExcelReadingOrder { LeftToRight = 1, RightToLeft}

type ExcelAlignmentType = 'bottom' | 'center' | 'top';

/* ExcelBorder */
export interface ExcelBorder {
    style: ExcelBorderStyle;
    color: ExcelColorSpec;
}

type ExcelBorderStyle = 'thin' | 'medium' | 'thick' | 'dotted' | 'hair' | 'dashed' | 'mediumDashed' | 'dashDot' | 'mediumDashDot' | 'dashDotDot' | 'mediumDashDotDot' | 'slantDashDot';

declare class ExcelFile extends React.Component<ExcelFileProps, any> {
}

// tslint:disable-next-line:max-classes-per-file
declare class ExcelSheet extends React.Component<ExcelSheetProps, any> {
}

// tslint:disable-next-line:max-classes-per-file
declare class ExcelColumn extends React.Component<ExcelColumnProps, any> {
}

export {
    ExcelFile,
    ExcelSheet,
    ExcelColumn,
};
