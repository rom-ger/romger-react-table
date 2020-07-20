import { RgReactBaseComponent, RgReactBaseComponentInterface } from '@romger/react-base-components';
import { IFilterField } from '../../../interfaces';
import { booleanFilterTemplate } from './booleanFilterTemplate';

export interface IBooleanFilterProps {
    filterField: IFilterField | null;
    fastUpdate?: boolean;
    changeFilter: (booleanValue: boolean | null) => any;
}

export interface IBooleanFilterState {
    booleanValue: boolean | null;
}

export interface IBooleanFilter extends RgReactBaseComponentInterface {
    props: IBooleanFilterProps;
    state: IBooleanFilterState;
    apply: () => any;
}

class BooleanFilter extends RgReactBaseComponent<IBooleanFilterProps, IBooleanFilterState> implements IBooleanFilter {
    constructor(props: IBooleanFilterProps) {
        super(props);
        this.state = {
            booleanValue: null,
        };
    }

    componentDidMount() {
        this.setState({
            booleanValue: this.props.filterField?.booleanValue ?? null,
        });
    }

    componentWillReceiveProps(nextProps: IBooleanFilterProps) {
        if (!this.props.fastUpdate) {
            return;
        }
        this.setState({
            booleanValue: nextProps.filterField?.booleanValue ?? null,
        });
    }

    /**
     * Применяем фильтр
     */
    apply = () => {
        this.props.changeFilter(this.state.booleanValue);
    }

    render(): JSX.Element | false {
        return !!this.props.filterField && booleanFilterTemplate(this);
    }
}

export { BooleanFilter };
