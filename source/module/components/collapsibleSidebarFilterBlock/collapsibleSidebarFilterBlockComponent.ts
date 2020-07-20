import { RgReactBaseComponentInterface, RgReactBaseContainer } from '@romger/react-base-components';
import collapsibleSidebarFilterBlockTemplate from './collapsibleSidebarFilterBlockTemplate';

interface ICollapsibleSidebarFilterBlockProps {
    children?: any;
    title?: string;
    scrollable?: boolean;
    shortContent?: string | null;
    flex?: boolean;
    collapsedByDefault?: boolean
    clearOneFilter: () => any;
}

interface ICollapsibleSidebarFilterBlockState {
    collapsed: boolean;
}

export interface ICollapsibleSidebarFilterBlock extends RgReactBaseComponentInterface {
    props: ICollapsibleSidebarFilterBlockProps;
    state: ICollapsibleSidebarFilterBlockState;
}

export default class CollapsibleSidebarFilterBlock extends RgReactBaseContainer<ICollapsibleSidebarFilterBlockProps, ICollapsibleSidebarFilterBlockState> implements ICollapsibleSidebarFilterBlock {
    state: ICollapsibleSidebarFilterBlockState = {
        collapsed: this.props.collapsedByDefault
            ? this.props.collapsedByDefault
            : false,
    };

    render(): false | JSX.Element {
        return collapsibleSidebarFilterBlockTemplate(this);
    }
}
