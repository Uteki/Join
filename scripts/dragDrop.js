let longTouchTimeout;
let isDragging = false;
let startX = 0;
let startY = 0;
let draggedEl = null;
let origStyles = {};
let currentHoveredDropArea = null;

const scrollThreshold = 100;
const scrollSpeed = 20;

const DRAG_THRESHOLD = 10;

/**
 * Set the ID of the currently dragged element.
 * @param {string} id - The ID of the dragged task.
 */
function startDragging(id) {
    currentDraggedElement = id;
}

/**
 * Allow an element to be a valid drop target.
 * @param {DragEvent} event - The drag event.
 */
function allowDrop(event) {
    event.preventDefault();
}

/**
 * Handle the drop event and move the task to the target column.
 * @param {DragEvent} event - The drag event.
 * @param {number} targetColumnIndex - The index of the column to move the task to.
 */
function dropHandler(event, targetColumnIndex) {
    event.preventDefault();
    moveTaskToColumn(currentDraggedElement, targetColumnIndex);
}

/**
 * Move the task to a new column and update the UI.
 * @async
 * @param {string} taskId - The ID of the task to move.
 * @param {number} targetColumnIndex - The index of the destination column.
 */
async function moveTaskToColumn(taskId, targetColumnIndex) {
    let taskToMove = null;
    taskList.forEach((column, colIndex) => {
        if (column.tasks) {
            const taskIndex = column.tasks.findIndex(task => task.id === taskId);
            if (taskIndex !== -1) {
                sourceColumnIndex = colIndex;
                taskToMove = column.tasks.splice(taskIndex, 1)[0];
            }
        }
    });
    taskList[targetColumnIndex].tasks ? taskList[targetColumnIndex].tasks.push(taskToMove) : taskList[targetColumnIndex].tasks = [taskToMove]
    await updateTaskList(null); 
    await renderTasks();
}

/**
 * Highlight the drop area visually during drag.
 * @param {string} id - The DOM ID of the drop area.
 */
function highlightDropArea(id) {
    document.getElementById(`${id}`).classList.add('drag-area-highlight')
}

/**
 * Remove highlight from a previously highlighted drop area.
 * @param {string} id - The DOM ID of the drop area.
 */
function removeHighlightDropArea(id) {
    document.getElementById(`${id}`).classList.remove('drag-area-highlight')
}

/**
 * Handle the touch start event to initialize dragging.
 * @param {TouchEvent} e - The touch start event.
 * @param {string} taskId - The ID of the task being touched.
 * @param {number} columnIndex - The column index of the task.
 */
function handleTouchStart(e, taskId, columnIndex) {
    draggedEl = e.currentTarget;
    saveOgStyling();
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    longTouchTimeout = setTimeout(() => {
        isDragging = true;
        startDragging(taskId);
        draggedEl.style.position = 'fixed';
        draggedEl.style.top = startY + 'px';
        draggedEl.style.left = startX + 'px';
        draggedEl.style.zIndex = '9999';
    }, 800);
}

/**
 * Handle the touch move event during a drag operation.
 * @param {TouchEvent} e - The touch move event.
 * @param {string} taskId - The ID of the task being dragged.
 * @param {number} columnIndex - The column index of the task.
 */
function handleTouchMove(e, taskId, columnIndex) {
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    cancelTimeoutIfMovement(currentX, currentY)

    if (isDragging && draggedEl) {
        e.preventDefault();
        draggedEl.style.top = currentY + 'px';
        draggedEl.style.left = currentX + 'px';
        findDropSectionOnTouchDrag(currentX, currentY)
        scrollScreenWhileDrag(e)
    }
}

/**
 * Handle the touch end event, finalize drag or open overlay.
 * @param {TouchEvent} e - The touch end event.
 * @param {string} taskId - The ID of the task.
 * @param {number} columnIndex - The column index of the task.
 */
function handleTouchEnd(e, taskId, columnIndex) {
    clearTimeout(longTouchTimeout);
    if (isDragging) {
        const touchX = e.changedTouches[0].clientX;
        const touchY = e.changedTouches[0].clientY;
        let dropTarget = document.elementFromPoint(touchX, touchY);
        dropTaskafterTouchEnd(e, dropTarget);
        returnOgStylingAfterouchEnd();
        isDragging = false;
        draggedEl = null;
    } else {
        openTaskOverlay(taskId, columnIndex);
    }
}

/**
 * Save the original styles of the dragged element.
 */
function saveOgStyling() {
    origStyles = {
        position: draggedEl.style.position,
        top: draggedEl.style.top,
        left: draggedEl.style.left,
        width: draggedEl.style.width,
        zIndex: draggedEl.style.zIndex,
    };
}

/**
 * Cancel the long touch timeout if a movement is detected.
 * @param {number} currentX - Current X coordinate of the touch.
 * @param {number} currentY - Current Y coordinate of the touch.
 */
function cancelTimeoutIfMovement(currentX, currentY) {
    if (!isDragging) {
        if (Math.abs(currentX - startX) > DRAG_THRESHOLD || Math.abs(currentY - startY) > DRAG_THRESHOLD) {
            clearTimeout(longTouchTimeout);
        }
    }
}

/**
 * Detect and highlight the drop area under the current touch position.
 * @param {number} currentX - Current X coordinate.
 * @param {number} currentY - Current Y coordinate.
 */
function findDropSectionOnTouchDrag(currentX, currentY) {
    let hoveredEl = document.elementFromPoint(currentX, currentY);
    while (hoveredEl && !hoveredEl.classList.contains('board-column-tasks')) {
        hoveredEl = hoveredEl.parentElement;
    }
    if (hoveredEl !== currentHoveredDropArea) {
        if (currentHoveredDropArea) {
            currentHoveredDropArea.classList.remove('drag-area-highlight');
        }
        if (hoveredEl) {
            hoveredEl.classList.add('drag-area-highlight');
        }
        currentHoveredDropArea = hoveredEl;
    }
}

/**
 * Scroll the board container when dragging near the screen edges.
 * @param {TouchEvent} e - The touch event.
 */
function scrollScreenWhileDrag(e) {
    const touch = e.touches[0];
    const container = document.getElementById('boardContent')
    if (touch.clientY < scrollThreshold) {
        container.scrollBy(0, -scrollSpeed);
    } else if (touch.clientY > (window.innerHeight - scrollThreshold)) {
        container.scrollBy(0, scrollSpeed);
    }
}

/**
 * Restore the original styles after the drag ends.
 */
function returnOgStylingAfterouchEnd() {
    if (draggedEl) {
        draggedEl.style.position = origStyles.position;
        draggedEl.style.top = origStyles.top;
        draggedEl.style.left = origStyles.left;
        draggedEl.style.width = origStyles.width;
        draggedEl.style.zIndex = origStyles.zIndex;
    }
}

/**
 * Handle dropping a task after the touch ends and determine the target column.
 * @param {TouchEvent} e - The touch end event.
 * @param {Element} dropTarget - The element under the touch point.
 */
function dropTaskafterTouchEnd(e, dropTarget) {
    while (dropTarget && !dropTarget.classList.contains('board-column-tasks')) {
        dropTarget = dropTarget.parentElement;
    }
    if (dropTarget) {
        const targetId = dropTarget.id;
        const targetIndex = parseInt(targetId.replace('boardColumnTasks', ''), 10);
        dropHandler(e, targetIndex);
    }
    if (currentHoveredDropArea) {
        currentHoveredDropArea.classList.remove('drag-area-highlight');
        currentHoveredDropArea = null;
    }
}
