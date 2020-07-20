import { RgReactBaseComponent, RgReactBaseComponentInterface } from '@romger/react-base-components';
import { IFilterField, IRangeValue } from '../../../interfaces';
import { intRangeFilterTemplate } from './intRangeFilterTemplate';

export interface IIntRangeFilterProps {
    filterField: IFilterField | null;
    fastUpdate?: boolean;
    changeFilter: (intRange: IRangeValue<number>, checkExistenceValue: boolean | null) => any;
}

export interface IIntRangeFilterState {
    from: number | null;
    to: number | null;
}

export interface IIntRangeFilter extends RgReactBaseComponentInterface {
    props: IIntRangeFilterProps;
    state: IIntRangeFilterState;
    apply: (checkExistenceValue?: boolean | null) => any;
}

class IntRangeFilter extends RgReactBaseComponent<IIntRangeFilterProps, IIntRangeFilterState> implements IIntRangeFilter {
    constructor(props: IIntRangeFilterProps) {
        super(props);
        this.state = {
            from: null,
            to: null,
        };
    }

    componentDidMount() {
        this.setState({
            from: this.props.filterField?.intRangeValue?.from ?? null,
            to: this.props.filterField?.intRangeValue?.to ?? null,
        });
    }

    componentWillReceiveProps(nextProps: IIntRangeFilterProps) {
        if (!this.props.fastUpdate) {
            return;
        }
        this.setState({
            from: nextProps.filterField?.intRangeValue?.from ?? null,
            to: nextProps.filterField?.intRangeValue?.to ?? null,
        });
    }

    /**
     * Применяем фильтр
     */
    apply = (checkExistenceValue?: boolean | null) => {
        this.props.changeFilter(
            {
                from: this.state.from ? parseFloat(`${this.state.from}`) : null,
                to: this.state.to ? parseFloat(`${this.state.to}`) : null,
            },
            checkExistenceValue ?? null,
        );
    }

    render(): JSX.Element | false {
        return !!this.props.filterField && intRangeFilterTemplate(this);
    }
}

export { IntRangeFilter };
