import { RgReactBaseComponent } from '@romger/react-base-components';
import { RgReactTableConfigTitle } from '../../../interfaces';
import { sortTemplate } from './sortTemplate';

export interface ISortProps {
    item: RgReactTableConfigTitle;
    selectedDirection: string | null;
    sortTh: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, item: RgReactTableConfigTitle, sortDirection: string) => any;
}

export interface ISort {
    props: ISortProps;
}

class Sort extends RgReactBaseComponent<ISortProps, {}> implements ISort {
    constructor(props: ISortProps) {
        super(props);
    }

    render() {
        return sortTemplate(this);
    }
}

export { Sort };
