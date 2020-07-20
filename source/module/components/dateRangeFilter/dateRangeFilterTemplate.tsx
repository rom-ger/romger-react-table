import { RgReactDatepicker } from '@romger/react-datepicker';
import { FlexBox } from '@romger/react-flex-layout';
import { RgReactInput } from '@romger/react-input';
import classnames from 'classnames';
import * as React from 'react';
// @ts-ignore
import CLOSE from '../../assets/images/svg/close-24px.svg';
import { CheckExistenceFilter } from '../checkExistenceFilter/checkExistenceFilter';
import { IDateRangeFilter } from './dateRangeFilter';

export const dateRangeFilterTemplate = (context: IDateRangeFilter) => (
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
                    rowWrap="start center"
                    className={classnames(
                        'dictionary-list-filter-wrap__range-example-wrap',
                    )}
                >
                    <span
                        className={classnames(
                            'dictionary-list-filter-wrap__range-example-item',
                        )}
                        onClick={context.setRangeAsToday}
                    >
                        Сегодня
                    </span>
                    <span
                        className={classnames(
                            'dictionary-list-filter-wrap__range-example-item',
                        )}
                        onClick={context.setRangeAsYesterday}
                    >
                        Вчера
                    </span>
                    <span
                        className={classnames(
                            'dictionary-list-filter-wrap__range-example-item',
                        )}
                        onClick={context.setRangeAsWeek}
                    >
                        Неделя
                    </span>
                    <span
                        className={classnames(
                            'dictionary-list-filter-wrap__range-example-item',
                        )}
                        onClick={context.setRangeAsMonth}
                    >
                        Месяц
                    </span>
                    <span
                        className={classnames(
                            'dictionary-list-filter-wrap__range-example-item',
                        )}
                        onClick={context.setRangeAsYear}
                    >
                        Год
                    </span>
                </FlexBox>
                <FlexBox
                    row="start center"
                    className={classnames(
                        'dictionary-list-filter-wrap__range-line',
                    )}
                >
                    <FlexBox
                        shrink="0"
                        className={classnames(
                            'dictionary-list-filter-wrap__range-line-label',
                        )}
                    >
                        С
                    </FlexBox>
                    <FlexBox
                        flex
                        shrink="0"
                        className={classnames(
                            'dictionary-list-filter-wrap__range-line-input',
                            {
                                'dictionary-list-filter-wrap__range-line-input--with-time': !!context.props.withTime,
                            },
                        )}
                    >
                        <RgReactDatepicker
                            value={context.state.from}
                            topLabel
                            updateCallback={(from: Date | null) => context.updateState(from, 'from', () => !context.props.fastUpdate ? null : context.apply(), 0)}
                        />
                    </FlexBox>
                    {
                        !!context.props.withTime &&
                        <FlexBox
                            shrink="0"
                            row="start center"
                            className={classnames(
                                'dictionary-list-filter-wrap__range-line-input',
                                'dictionary-list-filter-wrap__range-line-input-time-wrap',
                            )}
                        >
                            <RgReactInput
                                value={context.state.fromHour !== null ? `${context.state.fromHour}` : ''}
                                type="number"
                                maxNumber={23}
                                minNumber={0}
                                topLabel
                                disabled={!context.state.from}
                                placeholder="чч"
                                updateCallback={(e: any) => context.updateState(e?.target?.value ?? '', 'fromHour', () => !context.props.fastUpdate ? null : context.apply(), 0)}
                            />
                            <RgReactInput
                                value={context.state.fromMinutes !== null ? `${context.state.fromMinutes}` : ''}
                                type="number"
                                maxNumber={59}
                                minNumber={0}
                                topLabel
                                disabled={!context.state.from}
                                placeholder="мм"
                                updateCallback={(e: any) => context.updateState(e?.target?.value ?? '', 'fromMinutes', () => !context.props.fastUpdate ? null : context.apply(), 0)}
                            />
                        </FlexBox>
                    }
                    <div
                        className={classnames(
                            'dictionary-list-filter-wrap__range-line-clear',
                        )}
                        onClick={() => {
                            context.updateState(null, 'from', () => !context.props.fastUpdate ? null : context.apply(), 0);
                            context.updateState(null, 'fromHour', () => !context.props.fastUpdate ? null : context.apply(), 0);
                            context.updateState(null, 'fromMinutes', () => !context.props.fastUpdate ? null : context.apply(), 0);
                        }}
                        dangerouslySetInnerHTML={{ __html: context.state.from ? CLOSE : '' }}
                    />
                </FlexBox>
                <FlexBox
                    row="start center"
                    className={classnames(
                        'dictionary-list-filter-wrap__range-line',
                    )}
                >
                    <FlexBox
                        shrink="0"
                        className={classnames(
                            'dictionary-list-filter-wrap__range-line-label',
                        )}
                    >
                        По
                    </FlexBox>
                    <FlexBox
                        flex
                        shrink="0"
                        className={classnames(
                            'dictionary-list-filter-wrap__range-line-input',
                            {
                                'dictionary-list-filter-wrap__range-line-input--with-time': !!context.props.withTime,
                            },
                        )}
                    >
                        <RgReactDatepicker
                            value={context.state.to}
                            topLabel
                            updateCallback={(to: Date | null) => context.updateState(to, 'to', () => !context.props.fastUpdate ? null : context.apply(), 0)}
                        />
                    </FlexBox>
                    {
                        !!context.props.withTime &&
                        <FlexBox
                            shrink="0"
                            row="start center"
                            className={classnames(
                                'dictionary-list-filter-wrap__range-line-input',
                                'dictionary-list-filter-wrap__range-line-input-time-wrap',
                            )}
                        >
                            <RgReactInput
                                value={context.state.toHour !== null ? `${context.state.toHour}` : ''}
                                type="number"
                                maxNumber={23}
                                minNumber={0}
                                topLabel
                                disabled={!context.state.to}
                                placeholder="чч"
                                updateCallback={(e: any) => context.updateState(e?.target?.value ?? '', 'toHour', () => !context.props.fastUpdate ? null : context.apply(), 0)}
                            />
                            <RgReactInput
                                value={context.state.toMinutes !== null ? `${context.state.toMinutes}` : ''}
                                type="number"
                                maxNumber={59}
                                minNumber={0}
                                topLabel
                                disabled={!context.state.to}
                                placeholder="мм"
                                updateCallback={(e: any) => context.updateState(e?.target?.value ?? '', 'toMinutes', () => !context.props.fastUpdate ? null : context.apply(), 0)}
                            />
                        </FlexBox>
                    }
                    <div
                        className={classnames(
                            'dictionary-list-filter-wrap__range-line-clear',
                        )}
                        onClick={() => {
                            context.updateState(null, 'to', () => !context.props.fastUpdate ? null : context.apply(), 0);
                            context.updateState(null, 'toHour', () => !context.props.fastUpdate ? null : context.apply(), 0);
                            context.updateState(null, 'toMinutes', () => !context.props.fastUpdate ? null : context.apply(), 0);
                        }}
                        dangerouslySetInnerHTML={{ __html: context.state.to ? CLOSE : '' }}
                    />
                </FlexBox>
                {
                    !context.isNotValidData
                    ?
                    <>
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
                    </>
                    :
                    <>
                        {
                            !context.props.fastUpdate &&
                            <div
                                className={classnames(
                                    'dictionary-list-filter-wrap__error',
                                )}
                            >
                                Данные введены некорректно
                            </div>
                        }
                    </>
                }
            </FlexBox>
        }
    </React.Fragment>
);
