import { RgReactBaseComponent, RgReactBaseComponentInterface } from '@romger/react-base-components';
import { IFilterField } from '../../../interfaces';
import { stringFilterTemplate } from './stringFilterTemplate';

export interface IStringFilterProps {
    filterField: IFilterField | null;
    fastUpdate?: boolean;
    changeFilter: (stringValue: string | null, checkExistenceValue: boolean | null) => any;
}

export interface IStringFilterState {
    searchString: string | null;
}

export interface IStringFilter extends RgReactBaseComponentInterface {
    props: IStringFilterProps;
    state: IStringFilterState;
    apply: (checkExistenceValue?: boolean | null) => any;
}

class StringFilter extends RgReactBaseComponent<IStringFilterProps, IStringFilterState> implements IStringFilter {
    constructor(props: IStringFilterProps) {
        super(props);
        this.state = {
            searchString: null,
        };
    }

    componentDidMount() {
        this.setState({
            searchString: this.props.filterField?.stringValue ?? null,
        });
    }

    componentWillReceiveProps(nextProps: IStringFilterProps) {
        if (!this.props.fastUpdate) {
            return;
        }
        this.setState({
            searchString: nextProps.filterField?.stringValue ?? null,
        });
    }

    /**
     * Применяем фильтр
     */
    apply = (checkExistenceValue?: boolean | null) => {
        this.props.changeFilter(this.state.searchString, checkExistenceValue ?? null);
    }

    render(): JSX.Element | false {
        return !!this.props.filterField && stringFilterTemplate(this);
    }
}

export { StringFilter };
