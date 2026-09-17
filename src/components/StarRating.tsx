const STAR_PATH =
  'M10 1.6l2.47 5 5.53.8-4 3.9.94 5.5L10 14.2l-4.94 2.6.94-5.5-4-3.9 5.53-.8L10 1.6z'

function fillForStar(rating: number, index: number) {
  return Math.min(1, Math.max(0, rating - index))
}

type StarRatingProps = {
  value: number
  size?: 'sm' | 'md'
}

export function StarRating({ value, size = 'sm' }: StarRatingProps) {
  const rating = Math.min(5, Math.max(0, value))

  return (
    <p className={`star-rating star-rating--${size}`} aria-label={`Rating ${rating.toFixed(1)} out of 5`}>
      <span className="star-rating__stars" aria-hidden="true">
        {Array.from({ length: 5 }, (_, index) => (
          <span key={index} className="star-rating__star">
            <svg viewBox="0 0 20 20" className="star-rating__bg">
              <path d={STAR_PATH} />
            </svg>
            <span className="star-rating__fill" style={{ width: `${fillForStar(rating, index) * 100}%` }}>
              <svg viewBox="0 0 20 20">
                <path d={STAR_PATH} />
              </svg>
            </span>
          </span>
        ))}
      </span>
      <span className="star-rating__value">{rating.toFixed(1)}</span>
    </p>
  )
}
