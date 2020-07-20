import { RgReactBaseComponent, RgReactBaseComponentInterface } from '@romger/react-base-components';
import { checkExistenceFilterTemplate } from './checkExistenceFilterTemplate';

export interface ICheckExistenceFilterProps {
    checkExistenceValue: boolean | null;
    changeFilter: (checkExistenceValue: boolean | null) => any;
}

export interface ICheckExistenceFilter extends RgReactBaseComponentInterface {
    props: ICheckExistenceFilterProps;
}

class CheckExistenceFilter extends RgReactBaseComponent<ICheckExistenceFilterProps, {}> implements ICheckExistenceFilter {
    constructor(props: ICheckExistenceFilterProps) {
        super(props);
    }

    render(): JSX.Element | false {
        return checkExistenceFilterTemplate(this);
    }
}

export { CheckExistenceFilter };
