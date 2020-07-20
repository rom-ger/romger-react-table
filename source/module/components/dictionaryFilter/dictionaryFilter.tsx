import { RgReactBaseComponent, RgReactBaseComponentInterface } from '@romger/react-base-components';
import { IFilterField } from '../../../interfaces';
import { BaseDictionaryTableUtils } from '../../utils/baseDictionaryTableUtils';
import { dictionaryFilterTemplate } from './dictionaryFilterTemplate';

export interface IDictionaryFilterProps {
    filterField: IFilterField | null;
    fastUpdate?: boolean;
    changeFilter: (dictionaryValue: any, checkExistenceValue: boolean | null) => any;
}

export interface IDictionaryFilterState {
    items: any[];
    searchString: string | null;
    selectItem: any;
    selectItems: any[];
}

export interface IDictionaryFilter extends RgReactBaseComponentInterface {
    props: IDictionaryFilterProps;
    state: IDictionaryFilterState;
    updateContent: () => any;
    apply: (checkExistenceValue?: boolean | null) => any;
    itemIsSelect: (element: any) => boolean;
    toggleSelectItem: (element: any) => any;
}

class DictionaryFilter extends RgReactBaseComponent<IDictionaryFilterProps, IDictionaryFilterState> implements IDictionaryFilter {
    constructor(props: IDictionaryFilterProps) {
        super(props);
        this.state = {
            items: [],
            searchString: null,
            selectItem: null,
            selectItems: [],
        };
    }

    componentDidMount() {
        this.setState({
            selectItem: this.props.filterField?.dictionaryMultiSelect ? null : this.props.filterField?.dictionaryValue,
            selectItems: this.props.filterField?.dictionaryMultiSelect ? this.props.filterField?.dictionaryValue : [],
        });
        this.updateContent();
    }

    componentWillReceiveProps(nextProps: IDictionaryFilterProps) {
        if (!this.props.fastUpdate) {
            return;
        }
        this.setState({
            selectItem: nextProps.filterField?.dictionaryMultiSelect ? null : nextProps.filterField?.dictionaryValue,
            selectItems: nextProps.filterField?.dictionaryMultiSelect ? nextProps.filterField?.dictionaryValue : [],
        });
    }

    /**
     * Подгружаем значения сущностей
     */
    updateContent = () => {
        if (!this.props.filterField?.dictionaryItems) {
            return;
        }
        let result: any = this.props.filterField?.dictionaryItems(this.state.searchString);
        if (!!result.then) {
            result.then((res: any[]) => this.setState({ items: res }));
        } else {
            this.setState({ items: result });
        }
    }

    /**
     * Применяем фильтр
     */
    apply = (checkExistenceValue?: boolean | null) => {
        this.props.changeFilter(this.props.filterField?.dictionaryMultiSelect ? this.state.selectItems : this.state.selectItem, checkExistenceValue ?? null);
    }

    /**
     * Этот элемент выбран
     */
    itemIsSelect = (element: any): boolean => {
        let modelValue: string = BaseDictionaryTableUtils.getModelValue(element, this.props.filterField?.dictionaryModelField);
        if (this.props.filterField?.dictionaryMultiSelect) {
            return !!this.state.selectItems && this.state.selectItems.some((el: any) => el && BaseDictionaryTableUtils.getModelValue(el, this.props.filterField?.dictionaryModelField) === modelValue);
        } else {
            return this.state.selectItem && BaseDictionaryTableUtils.getModelValue(this.state.selectItem, this.props.filterField?.dictionaryModelField) === modelValue;
        }
    }

    /**
     * Выбрать/Развыбрать элемент
     */
    toggleSelectItem = (element: any) => {
        let selectItems: any[] = this.state.selectItems ? this.state.selectItems : [];
        if (this.itemIsSelect(element)) {
            if (this.props.filterField?.dictionaryMultiSelect) {
                let index: number = selectItems.findIndex((el: any) => el && BaseDictionaryTableUtils.getModelValue(el, this.props.filterField?.dictionaryModelField) === BaseDictionaryTableUtils.getModelValue(element, this.props.filterField?.dictionaryModelField));
                selectItems.splice(index, 1);
                this.setState(
                    {
                        selectItems,
                    },
                    () => this.apply(),
                );
            } else {
                this.setState(
                    {
                        selectItem: null,
                    },
                    () => this.apply(),
                );
            }
        } else {
            if (this.props.filterField?.dictionaryMultiSelect) {
                selectItems.push(element);
                this.setState(
                    {
                        selectItems,
                    },
                    () => this.apply(),
                );
            } else {
                this.setState(
                    {
                        selectItem: element,
                    },
                    () => this.apply(),
                );
            }
        }
    }

    render(): JSX.Element | false {
        return !!this.props.filterField && dictionaryFilterTemplate(this);
    }
}

export { DictionaryFilter };
