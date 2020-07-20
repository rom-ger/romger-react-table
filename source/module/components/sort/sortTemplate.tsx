import { FlexBox } from '@romger/react-flex-layout';
import { SORT_DIRECTION } from '@romger/react-global-module/lib/enums';
import classnames from 'classnames';
import * as React from 'react';
// @ts-ignore
import ARROW_DOWNWARD_NEW from '../../assets/images/svg/sort_down_new.svg';
// @ts-ignore
import ARROW_UPWARD_NEW from '../../assets/images/svg/sort_up_new.svg';
import { ISort } from './sort';

export const sortTemplate = (context: ISort) => (
    <div
        className={classnames(
            'dictionary-list-sort-wrap__wrap',
        )}
    >
        <FlexBox
            row="start center"
            className={classnames(
                'dictionary-list-sort-wrap__item',
                {
                    'dictionary-list-sort-wrap__item--selected': context.props.selectedDirection && context.props.selectedDirection === SORT_DIRECTION.ASC.value,
                },
            )}
            onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => context.props.sortTh(e, context.props.item, SORT_DIRECTION.ASC.value)}
        >
            <span
                className={classnames(
                    'dictionary-list-sort-wrap__item-icon',
                )}
                dangerouslySetInnerHTML={{ __html: ARROW_DOWNWARD_NEW }}
            />
            <span
                className={classnames(
                    'dictionary-list-sort-wrap__item-title',
                )}
            >
                По возрастанию
            </span>
        </FlexBox>
        <FlexBox
            row="start center"
            className={classnames(
                'dictionary-list-sort-wrap__item',
                {
                    'dictionary-list-sort-wrap__item--selected': context.props.selectedDirection && context.props.selectedDirection === SORT_DIRECTION.DESC.value,
                },
            )}
            onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => context.props.sortTh(e, context.props.item, SORT_DIRECTION.DESC.value)}
        >
            <span
                className={classnames(
                    'dictionary-list-sort-wrap__item-icon',
                )}
                dangerouslySetInnerHTML={{ __html: ARROW_UPWARD_NEW }}
            />
            <span
                className={classnames(
                    'dictionary-list-sort-wrap__item-title',
                )}
            >
                По убыванию
            </span>
        </FlexBox>
    </div>
);
