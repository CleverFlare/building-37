import React, { type TouchEvent } from "react";

type LongTapOptions<Args = void> = {
  threshold?: number;
  moveThreshold?: number; // max movement allowed before cancelling
  onStart?: (event: TouchEvent<HTMLElement>, args?: Args) => void;
  onFinish?: (event: TouchEvent<HTMLElement>, args?: Args) => void;
  onCancel?: (event: TouchEvent<HTMLElement>, args?: Args) => void;
};

/**
 * A React hook that triggers a callback when a user performs a long tap (without moving).
 * @param callback - Function invoked on long tap.
 * @param options - Long tap behavior options.
 * @returns A function that accepts custom arguments and returns event handlers.
 */
export function useLongTap<Args = void>(
  callback: (event: TouchEvent<HTMLElement>, args?: Args) => void,
  options: LongTapOptions<Args> = {},
) {
  const {
    threshold = 400,
    moveThreshold = 10,
    onStart,
    onFinish,
    onCancel,
  } = options;

  const isLongTapActive = React.useRef(false);
  const isPressed = React.useRef(false);
  const timerId = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const startPosition = React.useRef<{ x: number; y: number } | null>(null);

  return React.useCallback(
    (args?: Args) => {
      const start = (event: TouchEvent<HTMLElement>) => {
        event.stopPropagation();

        if (event.touches.length !== 1) return;

        const touch = event.touches[0];
        startPosition.current = { x: touch!.clientX, y: touch!.clientY };
        onStart?.(event, args);

        isPressed.current = true;

        timerId.current = setTimeout(() => {
          callback(event, args);
          isLongTapActive.current = true;
        }, threshold);
      };

      const move = (event: TouchEvent<HTMLElement>) => {
        event.stopPropagation();
        if (!isPressed.current || !startPosition.current) return;

        const touch = event.touches[0];
        const dx = Math.abs(touch!.clientX - startPosition.current.x);
        const dy = Math.abs(touch!.clientY - startPosition.current.y);

        // If the user moves beyond allowed threshold, cancel the long tap
        if (dx > moveThreshold || dy > moveThreshold) {
          cancel(event);
        }
      };

      const cancel = (event: TouchEvent<HTMLElement>) => {
        event.stopPropagation();
        if (!isPressed.current) return;

        if (isLongTapActive.current) {
          onFinish?.(event, args);
        } else {
          onCancel?.(event, args);
        }

        isLongTapActive.current = false;
        isPressed.current = false;

        if (timerId.current) {
          clearTimeout(timerId.current);
          timerId.current = null;
        }

        startPosition.current = null;
      };

      return {
        onTouchStart: start,
        onTouchMove: move,
        onTouchEnd: cancel,
        onTouchCancel: cancel,
      };
    },
    [callback, threshold, moveThreshold, onCancel, onFinish, onStart],
  );
}
