import { FlexBox } from '@romger/react-flex-layout';
import { RgReactInput } from '@romger/react-input';
import classnames from 'classnames';
import * as React from 'react';
import { CheckExistenceFilter } from '../checkExistenceFilter/checkExistenceFilter';
import { IStringFilter } from './stringFilter';

export const stringFilterTemplate = (context: IStringFilter) => (
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
                )}
            >
                <RgReactInput
                    value={context.state.searchString ? context.state.searchString : ''}
                    searchMode
                    placeholder="Введите текст для поиска"
                    topLabel
                    onEnter={context.props.fastUpdate ? undefined : () => context.apply()}
                    updateCallback={(e: any) => context.updateState(e?.target?.value ?? '', 'searchString', () => !context.props.fastUpdate ? null : context.apply(), 0)}
                />
                {
                    !context.props.fastUpdate &&
                    <FlexBox
                        row="center center"
                        className={classnames(
                            'dictionary-list-filter-wrap__apply-action',
                        )}
                        onClick={() => context.apply()}
                    >
                        Применить
                    </FlexBox>
                }
            </FlexBox>
        }
    </React.Fragment>
);
