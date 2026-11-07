const publicArtists = ['지민경', '이상용', '이소정'];
// Fictional visual placeholders; no real private artist data is published.
const privatePlaceholders = ['윤서현', '강도윤', '한유림', '정서우', '백지호'];

export default function ArtistsPage({ language }: { language: 'ko' | 'en' }) {
  const ko = language === 'ko';
  return (
    <section className="artists-directory" aria-labelledby="artists-heading">
      <h1 id="artists-heading">{ko ? '아티스트' : 'Artists'}</h1>
      <ul
        className="public-artists"
        aria-label={ko ? '공개 아티스트' : 'Public artists'}
      >
        {publicArtists.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
      <div className="private-artists">
        <p className="private-artists-label">
          {ko ? '프라이빗 아티스트' : 'Private artists'}
        </p>
        <ul aria-label={ko ? '비공개 아티스트' : 'Private artists'}>
          {privatePlaceholders.map((name, index) => (
            <li key={name}>
              <span className="private-artist-name" aria-hidden="true">
                {name}
              </span>
              <span className="sr-only">
                {ko
                  ? `비공개 아티스트 ${index + 1}`
                  : `Private artist ${index + 1}`}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
