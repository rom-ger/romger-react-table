import { FlexBox } from '@romger/react-flex-layout';
import classnames from 'classnames';
import * as React from 'react';
// @ts-ignore
import CLOSE from '../../assets/images/svg/close-24px.svg';
import { ICollapsibleSidebarFilterBlock } from './collapsibleSidebarFilterBlockComponent';

const collapsibleSidebarFilterBlockTemplate = (context: ICollapsibleSidebarFilterBlock) => (
    <FlexBox
        column={'stretch'}
        shrink={'0'}
        className={classnames(
            'collapsible-sidebar-filter-block',
            {
                'collapsible-sidebar-filter-block--scrollable': context.props.scrollable,
                'collapsible-sidebar-filter-block--flex': context.props.flex,
                'collapsible-sidebar-filter-block--not-collapsed': !context.state.collapsed,
            },
        )}
    >
        <FlexBox
            row={'start center'}
            shrink={'0'}
            className={classnames(
                'collapsible-sidebar-filter-block__header',
                {
                    'collapsible-sidebar-filter-block__header--without-margin': context.state.collapsed,
                },
            )}
            onClick={() => context.updateState(!context.state.collapsed, 'collapsed')}
        >
            <FlexBox
                className={classnames(
                    'subheader-1-primary',
                    'collapsible-sidebar-filter-block__title',
                )}
            >
                {context.props.title}
            </FlexBox>
            <div
                className={classnames(
                    'collapsible-sidebar-filter-block__short-content',
                )}
                title={!!context.state.collapsed && context.props.shortContent ? context.props.shortContent : ''}
            >
                {!!context.state.collapsed ? context.props.shortContent : ''}
            </div>
            <FlexBox
                shrink="0"
                row={'end ctr'}
                className={classnames(
                    'collapsible-sidebar-filter-block__header-buttons',
                )}
            >
                {
                    !!context.state.collapsed && !!context.props.shortContent &&
                    <FlexBox
                        row={'ctr'}
                        className={classnames(
                            'collapsible-sidebar-filter-block__header-button',
                        )}
                        onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                            e.stopPropagation();
                            context.props.clearOneFilter();
                        }}
                    >
                        <div
                            className={classnames(
                                'collapsible-sidebar-filter-block__header-button-icon',
                            )}
                            dangerouslySetInnerHTML={{ __html: CLOSE }}
                        />
                    </FlexBox>
                }
            </FlexBox>
        </FlexBox>
        {
            !context.state.collapsed &&
            <FlexBox
                flex
                column={'start'}
                shrink={'0'}
                className={classnames(
                    'collapsible-sidebar-filter-block__content',
                )}
            >
                {context.props.children}
            </FlexBox>
        }
    </FlexBox>
);

export default collapsibleSidebarFilterBlockTemplate;
