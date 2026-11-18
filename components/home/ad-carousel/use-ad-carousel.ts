'use client';

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';

const AUTOPLAY_INTERVAL_MS = 5000;

interface IGestureStart {
  id: number;
  x: number;
  y: number;
}

export function useAdCarousel(count: number) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isHovered, setHovered] = useState(false);
  const [isFocused, setFocused] = useState(false);
  const [isDragging, setDragging] = useState(false);
  const gesture = useRef<IGestureStart | null>(null);
  const suppressClick = useRef(false);
  const isAutoPlaying = count > 1 && !isHovered && !isFocused && !isDragging;

  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = window.setTimeout(() => {
      setSelectedIndex((current) => (current + 1) % count);
    }, AUTOPLAY_INTERVAL_MS);

    return () => window.clearTimeout(timer);
  }, [count, selectedIndex, isAutoPlaying]);

  const move = (direction: number): void => {
    if (count > 1) setSelectedIndex((current) => (current + direction + count) % count);
  };

  const onPointerDown = (event: PointerEvent<HTMLButtonElement>): void => {
    if (!event.isPrimary || event.button !== 0) return;
    setDragging(true);
    suppressClick.current = false;
    gesture.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerUp = (event: PointerEvent<HTMLButtonElement>): void => {
    const start = gesture.current;
    gesture.current = null;
    setDragging(false);
    if (!start || start.id !== event.pointerId) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    suppressClick.current = Math.abs(dx) > 12 || Math.abs(dy) > 12;
    if (Math.abs(dx) >= 40 && Math.abs(dx) > Math.abs(dy)) {
      move(dx < 0 ? 1 : -1);
    }
  };

  const onPointerCancel = (): void => {
    if (!gesture.current) return;
    setDragging(false);
    gesture.current = null;
    suppressClick.current = true;
  };

  const selectFromPreview = (index: number, isKeyboardClick: boolean): void => {
    // A drag also emits a click; do not let that click undo the selected slide.
    if (!suppressClick.current || isKeyboardClick) setSelectedIndex(index);
    suppressClick.current = false;
  };

  const onKeyDown = (event: KeyboardEvent<HTMLElement>): void => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      move(event.key === 'ArrowLeft' ? -1 : 1);
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      setSelectedIndex(event.key === 'Home' ? 0 : count - 1);
    }
  };

  return {
    selectedIndex, select: setSelectedIndex, move, selectFromPreview,
    isAutoPlaying, setHovered, setFocused,
    onPointerDown, onPointerUp, onPointerCancel, onKeyDown,
  };
}
