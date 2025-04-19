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

function startDragging(id) {
    currentDraggedElement = id;
}

function allowDrop(event) {
    event.preventDefault();
}

function dropHandler(event, targetColumnIndex) {
    event.preventDefault();
    moveTaskToColumn(currentDraggedElement, targetColumnIndex);
}

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
    await updateTaskList(null); await renderTasks();
}

function highlightDropArea(id) {
    document.getElementById(`${id}`).classList.add('drag-area-highlight')
}

function removeHighlightDropArea(id) {
    document.getElementById(`${id}`).classList.remove('drag-area-highlight')
}

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

function saveOgStyling() {
    origStyles = {
        position: draggedEl.style.position,
        top: draggedEl.style.top,
        left: draggedEl.style.left,
        width: draggedEl.style.width,
        zIndex: draggedEl.style.zIndex,
    };
}

function cancelTimeoutIfMovement(currentX, currentY) {
    if (!isDragging) {
        if (Math.abs(currentX - startX) > DRAG_THRESHOLD || Math.abs(currentY - startY) > DRAG_THRESHOLD) {
            clearTimeout(longTouchTimeout);
        }
    }
}

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

function scrollScreenWhileDrag(e) {
    const touch = e.touches[0];
    const container = document.getElementById('boardContent')
    if (touch.clientY < scrollThreshold) {
        container.scrollBy(0, -scrollSpeed);
    } else if (touch.clientY > (window.innerHeight - scrollThreshold)) {
        container.scrollBy(0, scrollSpeed);
    }
}

function returnOgStylingAfterouchEnd() {
    if (draggedEl) {
        draggedEl.style.position = origStyles.position;
        draggedEl.style.top = origStyles.top;
        draggedEl.style.left = origStyles.left;
        draggedEl.style.width = origStyles.width;
        draggedEl.style.zIndex = origStyles.zIndex;
    }
}

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