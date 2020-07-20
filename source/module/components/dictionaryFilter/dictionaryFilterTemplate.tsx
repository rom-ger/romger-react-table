import { RgReactCheckbox } from '@romger/react-checkbox';
import { FlexBox } from '@romger/react-flex-layout';
import { RgReactInput } from '@romger/react-input';
import classnames from 'classnames';
import * as React from 'react';
import { BaseDictionaryTableUtils } from '../../utils/baseDictionaryTableUtils';
import { CheckExistenceFilter } from '../checkExistenceFilter/checkExistenceFilter';
import { IDictionaryFilter } from './dictionaryFilter';

export const dictionaryFilterTemplate = (context: IDictionaryFilter) => (
    <React.Fragment>
        {
            context.props.filterField?.withCheckExistence &&
            <CheckExistenceFilter
                checkExistenceValue={context.props.filterField.checkExistenceValue ?? null}
                changeFilter={(checkExistenceValue: boolean | null) => context.apply(checkExistenceValue)}
            />
        }
        {
            (context.props.filterField?.checkExistenceValue === null || context.props.filterField?.checkExistenceValue === undefined) &&
            <FlexBox
                className={classnames(
                    'dictionary-list-filter-wrap',
                    'dictionary-list-filter-wrap--without-padding',
                )}
            >
                {
                    !context.props.filterField?.dictionaryWithoutSearch &&
                    <RgReactInput
                        value={context.state.searchString ? context.state.searchString : ''}
                        searchMode
                        placeholder=""
                        topLabel
                        updateCallback={(e: any) => context.updateState(e?.target?.value ?? '', 'searchString', () => context.updateContent())}
                    />
                }
                <FlexBox
                    className={classnames(
                        'dictionary-list-filter-wrap__items-wrap',
                    )}
                >
                    {
                        context.state.items.map((item: any, index: number) =>
                            <FlexBox
                                key={index}
                                className={classnames(
                                    'dictionary-list-filter-wrap__item',
                                    {
                                        'dictionary-list-filter-wrap__item--selected': context.itemIsSelect(item),
                                    },
                                )}
                                row="start center"
                                onClick={() => context.toggleSelectItem(item)}
                            >
                                {
                                    !!context.props.filterField?.dictionaryMultiSelect &&
                                    <RgReactCheckbox
                                        checked={context.itemIsSelect(item)}
                                    />
                                }
                                <FlexBox
                                    flex
                                    className={classnames(
                                        {
                                            'dictionary-list-filter-wrap__item-title--multi-select': !!context.props.filterField?.dictionaryMultiSelect,
                                        },
                                    )}
                                >
                                    {
                                        BaseDictionaryTableUtils.getVisibleValue(item, context.props.filterField?.dictionaryVisibleField)
                                    }
                                </FlexBox>
                            </FlexBox>,
                        )
                    }
                </FlexBox>
            </FlexBox>
        }
    </React.Fragment>
);
