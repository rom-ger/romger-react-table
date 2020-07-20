import { RgReactBaseComponent } from '@romger/react-base-components';
import { RgReactTableConfigItem, RgReactTableConfigTitle } from '../../../interfaces';
import { tableSidebarDataExportTemplate } from './tableSidebarDataExportTemplate';

export interface IRgReactTableSidebarDataExportProps {
    titles: RgReactTableConfigTitle[];
    rows: {
        items: RgReactTableConfigItem[];
    }[];
    titleForExportedFile?: string;
}

export interface IRgReactTableSidebarDataExport {
    props: IRgReactTableSidebarDataExportProps;
}

class RgReactTableSidebarDataExport extends RgReactBaseComponent<IRgReactTableSidebarDataExportProps, {}> implements IRgReactTableSidebarDataExport {
    render() {
        return tableSidebarDataExportTemplate(this);
    }
}

export { RgReactTableSidebarDataExport };
