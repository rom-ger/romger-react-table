import { FlexBox } from '@romger/react-flex-layout';
import { RgReactInput } from '@romger/react-input';
import classnames from 'classnames';
import * as React from 'react';
// @ts-ignore
import CLOSE from '../../assets/images/svg/close-24px.svg';
import { CheckExistenceFilter } from '../checkExistenceFilter/checkExistenceFilter';
import { IIntRangeFilter } from './intRangeFilter';

export const intRangeFilterTemplate = (context: IIntRangeFilter) => (
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
                <FlexBox
                    row="start center"
                    className={classnames(
                        'dictionary-list-filter-wrap__range-line',
                    )}
                >
                    <span
                        className={classnames(
                            'dictionary-list-filter-wrap__range-line-label',
                        )}
                    >
                        С
                    </span>
                    <FlexBox
                        flex
                        className={classnames(
                            'dictionary-list-filter-wrap__range-line-input',
                        )}
                    >
                        <RgReactInput
                            value={context.state.from !== null ? `${context.state.from}` : ''}
                            type="number"
                            topLabel
                            onEnter={context.props.fastUpdate ? undefined : () => context.apply()}
                            updateCallback={(e: any) => context.updateState(e?.target?.value ?? '', 'from', () => !context.props.fastUpdate ? null : context.apply(), 0)}
                        />
                    </FlexBox>
                    <div
                        className={classnames(
                            'dictionary-list-filter-wrap__range-line-clear',
                        )}
                        onClick={() => context.updateState(null, 'from', () => !context.props.fastUpdate ? null : context.apply(), 0)}
                        dangerouslySetInnerHTML={{ __html: context.state.from ? CLOSE : '' }}
                    />
                </FlexBox>
                <FlexBox
                    row="start center"
                    className={classnames(
                        'dictionary-list-filter-wrap__range-line',
                    )}
                >
                    <span
                        className={classnames(
                            'dictionary-list-filter-wrap__range-line-label',
                        )}
                    >
                        По
                    </span>
                    <FlexBox
                        flex
                        className={classnames(
                            'dictionary-list-filter-wrap__range-line-input',
                        )}
                    >
                        <RgReactInput
                            value={context.state.to !== null ? `${context.state.to}` : ''}
                            type="number"
                            onEnter={context.props.fastUpdate ? undefined : () => context.apply()}
                            topLabel
                            updateCallback={(e: any) => context.updateState(e?.target?.value ?? '', 'to', () => !context.props.fastUpdate ? null : context.apply(), 0)}
                        />
                    </FlexBox>
                    <div
                        className={classnames(
                            'dictionary-list-filter-wrap__range-line-clear',
                        )}
                        onClick={() => context.updateState(null, 'to', () => !context.props.fastUpdate ? null : context.apply(), 0)}
                        dangerouslySetInnerHTML={{ __html: context.state.to ? CLOSE : '' }}
                    />
                </FlexBox>
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
