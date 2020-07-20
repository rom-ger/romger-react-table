import { FlexBox } from '@romger/react-flex-layout';
import classnames from 'classnames';
import * as React from 'react';
import { ICheckExistenceFilter } from './checkExistenceFilter';

export const checkExistenceFilterTemplate = (context: ICheckExistenceFilter) => (
    <FlexBox
        className={classnames(
            'check-existence-filter',
        )}
        row="start center"
    >
        <FlexBox
            row="center center"
            className={classnames(
                'check-existence-filter__item',
                {
                    'check-existence-filter__item--selected': context.props.checkExistenceValue === false,
                },
            )}
            onClick={() => context.props.changeFilter(context.props.checkExistenceValue === false ? null : false)}
        >
            Пустые
        </FlexBox>
        <FlexBox
            row="center center"
            className={classnames(
                'check-existence-filter__item',
                'check-existence-filter__item--right',
                {
                    'check-existence-filter__item--selected': context.props.checkExistenceValue === true,
                },
            )}
            onClick={() => context.props.changeFilter(context.props.checkExistenceValue === true ? null : true)}
        >
            Не пустые
        </FlexBox>
    </FlexBox>
);
