const TITLE = 'Products'
const REST = TITLE.slice(1)

export function CatalogTitle() {
  return (
    <div className="catalog-title">
      <h1>
        <span className="visually-hidden">{TITLE}</span>
        <span className="catalog-title__word" aria-hidden="true">
          <span className="catalog-title__letter catalog-title__letter--mark">{TITLE[0]}</span>
          {REST.split('').map((letter, index) => (
            <span
              key={`${letter}-${index}`}
              className="catalog-title__letter"
              style={{ animationDelay: `${120 + index * 40}ms` }}
            >
              {letter}
            </span>
          ))}
        </span>
      </h1>
    </div>
  )
}
