import { FlexBox } from '@romger/react-flex-layout';
import classnames from 'classnames';
import * as React from 'react';
import { IRgReactTableSidebar } from './tableSidebar';

export const tableSidebarTemplate = (context: IRgReactTableSidebar) => (
    <FlexBox
        shrink={'0'}
        row={'start stretch'}
        className={classnames(
            'dictionary-list-table-sidebar',
            {
                'dictionary-list-table-sidebar--hidden': !context.state.showSidebarContent,
            },
        )}
    >
        <FlexBox
            shrink={'0'}
            column={'start'}
            className={classnames(
                'dictionary-list-table-sidebar__toggle-buttons',
                {
                    'dictionary-list-table-sidebar__toggle-buttons--without-right-border': !context.state.showSidebarContent,
                },
            )}
        >
            {
                context.state.tabs.map((tab, index) => (
                    <FlexBox
                        key={index}
                        row={'ctr'}
                        className={classnames(
                            'dictionary-list-table-sidebar__toggle-button',
                            {
                                'dictionary-list-table-sidebar__toggle-button--selected': context.tabIsActive(index),
                            },
                        )}
                        onClick={() => context.selectTab(index)}
                    >
                        {
                            !!tab.icon &&
                            <div
                                className={classnames(
                                    'dictionary-list-table-sidebar__toggle-button-icon',
                                )}
                                dangerouslySetInnerHTML={{ __html: tab.icon }}
                            />
                        }
                        {
                            tab.title &&
                            <div
                                className={classnames(
                                    'dictionary-list-table-sidebar__toggle-button-title',
                                    {
                                        'dictionary-list-table-sidebar__toggle-button-title--without-top-margin': !tab.icon,
                                    },
                                )}
                            >
                                {tab.title}
                            </div>
                        }
                    </FlexBox>
                ))
            }
        </FlexBox>
        {
            context.state.tabs.map((tab, index) => (
                context.tabIsActive(index) &&
                <FlexBox
                    key={index}
                    shrink={'0'}
                    column={'start'}
                    className={classnames(
                        'dictionary-list-table-sidebar__content',
                    )}
                >
                    {tab.content}
                </FlexBox>
            ))
        }
    </FlexBox>
);
