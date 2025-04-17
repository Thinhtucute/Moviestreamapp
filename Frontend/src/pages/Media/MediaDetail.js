import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import classNames from 'classnames/bind';
import styles from './MediaDetail.module.scss';
import { FaPlay, FaPlus, FaStar, FaCalendarAlt, FaClock, FaGlobe, FaExclamationCircle } from 'react-icons/fa';

const cx = classNames.bind(styles);

function MediaDetail() {
  const { mediaId } = useParams();
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMediaDetails = async () => {
      try {
        setLoading(true);
        // Use environment variable or fallback to localhost
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';
        const response = await axios.get(`${apiUrl}/api/media/${mediaId}`);
        
        if (response.data && response.data.result) {
          setMedia(response.data.result);
        } else {
          throw new Error('Invalid response format');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching media details:', err);
        setError('Failed to load media details. Please try again later.');
        setLoading(false);
      }
    };

    fetchMediaDetails();
  }, [mediaId]);

  // Function to create YouTube embed URL from trailer link
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    
    // Extract video ID from different YouTube URL formats
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    
    return match && match[2].length === 11
      ? `https://www.youtube.com/embed/${match[2]}`
      : null;
  };

  if (loading) {
    return (
      <div className={cx('loading-container')}>
        <div className={cx('loader')}></div>
        <p>Loading media details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cx('error-container')}>
        <FaExclamationCircle size={48} />
        <h2>Something went wrong</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  if (!media) {
    return (
      <div className={cx('not-found-container')}>
        <h2>Media Not Found</h2>
        <p>The requested media item could not be found.</p>
      </div>
    );
  }

  const youtubeEmbedUrl = getYouTubeEmbedUrl(media.trailerURL);

  return (
      <div className={cx('media-detail-container')}>
          {/* Hero section with backdrop */}
          <div className={cx('backdrop')} style={{ backgroundImage: `url(${media.posterURL})` }}>
              <div className={cx('backdrop-overlay')}></div>

              <div className={cx('hero-content')}>
                  <div className={cx('poster')}>
                      <img src={media.posterURL} alt={media.title} />
                  </div>

                  <div className={cx('info')}>
                      <h1>{media.title}</h1>

                      <div className={cx('meta')}>
                          <span className={cx('year')}>
                              <FaCalendarAlt /> {media.releaseYear}
                          </span>

                          <span className={cx('duration')}>
                              <FaClock /> {media.duration} min
                          </span>

                          <span className={cx('language')}>
                              <FaGlobe /> {media.language.toUpperCase()}
                          </span>

                          <span className={cx('rating')}>{media.ageRating}</span>
                      </div>

                      <div className={cx('genres')}>
                          {media.genres &&
                              media.genres.map((genre) => (
                                  <span key={genre.genreId} className={cx('genre-tag')}>
                                      {genre.genreName}
                                  </span>
                              ))}
                      </div>

                      <div className={cx('actions')}>
                          <button className={cx('play-btn')}>
                              <FaPlay /> Watch Now
                          </button>

                          <button className={cx('add-btn')}>
                              <FaPlus /> Add to List
                          </button>
                      </div>

                      <div className={cx('description')}>
                          <h3>Overview</h3>
                          <p>{media.description}</p>
                      </div>
                  </div>
              </div>
          </div>

          {/* Trailer section */}
          {youtubeEmbedUrl && (
              <section className={cx('trailer-section')}>
                  <h2>Trailer</h2>
                  <div className={cx('trailer-container')}>
                      <iframe
                          src={youtubeEmbedUrl}
                          title="Trailer"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                      ></iframe>
                  </div>
              </section>
          )}

          {/* Cast section */}
          {media.actors && media.actors.length > 0 && (
              <section className={cx('cast-section')}>
                  <h2>Cast</h2>
                  <div className={cx('cast-grid')}>
                      {media.actors.map((actor) => (
                          <div key={actor.actorId} className={cx('cast-card')}>
                              <div className={cx('actor-image')}>
                                  {/* Use a placeholder if no image */}
                                  <img
                                      src={actor.profileImageURL || 'https://via.placeholder.com/150?text=No+Image'}
                                      alt={actor.actorName}
                                  />
                              </div>
                              <div className={cx('actor-info')}>
                                  <h4>{actor.actorName}</h4>
                                  {actor.character && <p className={cx('character')}>{actor.character}</p>}
                              </div>
                          </div>
                      ))}
                  </div>
              </section>
          )}

          {/* Directors section */}
          {media.directors && media.directors.length > 0 && (
              <section className={cx('directors-section')}>
                  <h2>Director{media.directors.length > 1 ? 's' : ''}</h2>
                  <div className={cx('directors-grid')}>
                      {media.directors.map((director) => (
                          <div key={director.directorId} className={cx('director-card')}>
                              <h4>{director.directorName}</h4>
                          </div>
                      ))}
                  </div>
              </section>
          )}

          {/* Episodes section for TV Shows */}
          {media.mediaType === 'TV_SHOW' && media.seasons && media.seasons.length > 0 && (
              <section className={cx('episodes-section')}>
                  <h2>Episodes</h2>
                  {media.seasons.map((season) => (
                      <div key={season.seasonId} className={cx('season')}>
                          <h3>Season {season.seasonNumber}</h3>
                          <div className={cx('episodes-list')}>
                              {season.episodes.map((episode) => (
                                  <div key={episode.episodeId} className={cx('episode-card')}>
                                      <div className={cx('episode-number')}>{episode.episodeNumber}</div>
                                      <div className={cx('episode-info')}>
                                          <h4>{episode.title}</h4>
                                          <p>{episode.description}</p>
                                          <div className={cx('episode-meta')}>
                                              <span>{episode.duration} min</span>
                                          </div>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                  ))}
              </section>
          )}

          {/* Access level info */}
          <div className={cx('access-level')}>
              <p>
                  Access level: <strong>{media.accessLevel}</strong>
              </p>
          </div>
      </div>
  );
}

export default MediaDetail;