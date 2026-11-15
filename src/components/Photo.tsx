import { photo, srcSet } from '../data/content'

type Props = {
  id: string
  alt: string
  sizes?: string
  priority?: boolean
  className?: string
  style?: React.CSSProperties
  position?: string
}

/** Graded editorial photograph: responsive srcset, lazy by default, priority for the hero. */
export function Photo({ id, alt, sizes = '100vw', priority, className = '', style, position }: Props) {
  return (
    <img
      className={`photo ${className}`}
      src={photo(id, 1600)}
      srcSet={srcSet(id)}
      sizes={sizes}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      // @ts-expect-error — fetchpriority is valid HTML, typed in newer React only
      fetchpriority={priority ? 'high' : 'auto'}
      draggable={false}
      style={{ objectPosition: position, ...style }}
    />
  )
}
