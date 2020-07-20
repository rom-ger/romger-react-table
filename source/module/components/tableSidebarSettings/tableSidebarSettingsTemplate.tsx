import { RgReactCheckbox } from '@romger/react-checkbox';
import { FlexBox } from '@romger/react-flex-layout';
import classnames from 'classnames';
import * as React from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { ITitleWidthConfigRule } from '../table/dictionaryListSimpleTable';
import { IRgReactTableSidebarSettings } from './tableSidebarSettings';

export const tableSidebarSettingsTemplate = (context: IRgReactTableSidebarSettings) => (
    <FlexBox
        column={'start stretch'}
        className={classnames(
            'dictionary-list-table-sidebar-settings',
        )}
    >
        <DragDropContext
            onDragEnd={context.onDragEnd}
        >
            <Droppable
                droppableId="droppable"
            >
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                    >
                        {
                            context.props.titlesWithConfigRules.map((el: ITitleWidthConfigRule, index: number) =>
                                <Draggable
                                    key={index}
                                    draggableId={`${index}`}
                                    index={index}
                                >
                                    {(providedChild, snapshotChild) => (
                                        <div
                                            ref={providedChild.innerRef}
                                            {...providedChild.draggableProps}
                                            {...providedChild.dragHandleProps}
                                            className={classnames(
                                                'dictionary-list-table-sidebar-settings__element',
                                                {
                                                    'dictionary-list-table-sidebar-settings__hide-column': context.isHardHideColumn(el.originIndex),
                                                },
                                            )}
                                        >
                                            <FlexBox
                                                flex
                                            >
                                                {el.title.title || '...'}
                                            </FlexBox>
                                            <RgReactCheckbox
                                                checked={context.isShowColumn(el.originIndex)}
                                                onClick={() => context.toggleColumn(el.originIndex)}
                                            />
                                        </div>
                                    )}
                                </Draggable>,
                            )
                        }
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    </FlexBox>
);
