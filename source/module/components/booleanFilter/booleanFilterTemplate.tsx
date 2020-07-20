import { FlexBox } from '@romger/react-flex-layout';
import classnames from 'classnames';
import * as React from 'react';
import { IBooleanFilter } from './booleanFilter';

export const booleanFilterTemplate = (context: IBooleanFilter) => (
    <FlexBox
        className={classnames(
            'dictionary-list-filter-wrap',
        )}
    >
        <FlexBox
            row="start center"
            className={classnames(
                'dictionary-list-filter-wrap__bool-item',
                {
                    'dictionary-list-filter-wrap__bool-item--selected': context.state.booleanValue === null || context.state.booleanValue === undefined,
                },
            )}
            onClick={() => context.updateState(null, 'booleanValue', context.apply, 0)}
        >
            <span>{context.props.filterField?.booleanAllTitle ? context.props.filterField?.booleanAllTitle : 'Все'}</span>
        </FlexBox>
        <FlexBox
            row="start center"
            className={classnames(
                'dictionary-list-filter-wrap__bool-item',
                {
                    'dictionary-list-filter-wrap__bool-item--selected': context.state.booleanValue === true,
                },
            )}
            onClick={() => context.updateState(true, 'booleanValue', context.apply, 0)}
        >
            <span>{context.props.filterField?.booleanTrueTitle ? context.props.filterField?.booleanTrueTitle : 'Да'}</span>
        </FlexBox>
        <FlexBox
            row="start center"
            className={classnames(
                'dictionary-list-filter-wrap__bool-item',
                {
                    'dictionary-list-filter-wrap__bool-item--selected': context.state.booleanValue === false,
                },
            )}
            onClick={() => context.updateState(false, 'booleanValue', context.apply, 0)}
        >
            <span>{context.props.filterField?.booleanFalseTitle ? context.props.filterField?.booleanFalseTitle : 'Нет'}</span>
        </FlexBox>
    </FlexBox>
);
