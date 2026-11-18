'use client';

import { useId } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/lib/contexts/language-context';
import type { IAdSlide } from '@/types/ad-slide.interface';
import { useAdCarousel } from './use-ad-carousel';
import styles from './ad-carousel.module.css';

interface IAdCarouselProps {
  slides: IAdSlide[];
}

export function AdCarousel({ slides }: IAdCarouselProps) {
  const { t } = useLanguage();
  const id = useId();
  const carousel = useAdCarousel(slides.length);
  const activeIndex = Math.min(carousel.selectedIndex, slides.length - 1);
  const activeSlide = slides[activeIndex];

  if (!activeSlide) return null;

  return (
    <section
      className={styles.section}
      aria-label={t('home.ads.label')}
      aria-roledescription={t('home.ads.carousel')}
      onKeyDown={carousel.onKeyDown}
      onPointerEnter={(event) => {
        if (event.pointerType === 'mouse') carousel.setHovered(true);
      }}
      onPointerLeave={() => carousel.setHovered(false)}
      onFocusCapture={() => carousel.setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) carousel.setFocused(false);
      }}
    >
      <div className={styles.inner}>
        <div className={styles.track} id={`${id}-slides`}>
          {slides.map((slide, index) => {
            const active = index === activeIndex;
            const neighbor = Math.abs(index - activeIndex) === 1;

            return (
              <button
                key={slide.id}
                type="button"
                className={styles.slide}
                data-active={active}
                data-neighbor={neighbor}
                aria-label={`${t('home.ads.show')} ${index + 1}`}
                aria-pressed={active}
                onClick={(event) => carousel.selectFromPreview(index, event.detail === 0)}
                onPointerDown={carousel.onPointerDown}
                onPointerUp={carousel.onPointerUp}
                onPointerCancel={carousel.onPointerCancel}
                onLostPointerCapture={carousel.onPointerCancel}
              >
                <Image
                  src={slide.src}
                  alt={`${t('home.ads.label')} ${index + 1}`}
                  fill
                  sizes={active ? '(max-width: 640px) 80vw, 65vw' : '8vw'}
                  className={styles.image}
                  draggable={false}
                />
                {!active && <span className={styles.previewNumber} aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>}
              </button>
            );
          })}
        </div>

        <div className={styles.footer}>
          <p className="sr-only" aria-live={carousel.isAutoPlaying ? 'off' : 'polite'} aria-atomic="true">
            {t('home.ads.label')}: {activeIndex + 1} / {slides.length}
          </p>
          {slides.length > 1 && (
            <div className={styles.controls}>
              <button type="button" className={styles.arrow} onClick={() => carousel.move(-1)} aria-label={t('home.ads.previous')} title={t('home.ads.previous')} aria-controls={`${id}-slides`}>
                <ArrowLeft size={18} aria-hidden="true" />
              </button>
              <div className={styles.dots} role="group" aria-label={t('home.ads.choose')}>
                {slides.map((slide, index) => (
                  <button
                    key={slide.id}
                    type="button"
                    className={styles.dot}
                    aria-label={`${t('home.ads.show')} ${index + 1}`}
                    aria-current={index === activeIndex ? 'true' : undefined}
                    aria-controls={`${id}-slides`}
                    onClick={() => carousel.select(index)}
                  ><span /></button>
                ))}
              </div>
              <button type="button" className={styles.arrow} onClick={() => carousel.move(1)} aria-label={t('home.ads.next')} title={t('home.ads.next')} aria-controls={`${id}-slides`}>
                <ArrowRight size={18} aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
