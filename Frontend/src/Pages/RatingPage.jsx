import React, { useState } from 'react';

export function StarRating ({ rating, onRatingChange, readonly = false }){
  const [hover, setHover] = useState(0);

  return (
    <div className="d-flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`btn p-0 me-1 ${readonly ? '' : 'btn-outline-warning'}`}
          style={{ border: 'none', fontSize: '1.2rem' }}
          onClick={() => !readonly && onRatingChange(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          disabled={readonly}
        >
          <span className={star <= (hover || rating) ? 'text-warning' : 'text-muted'}>
            ★
          </span>
        </button>
      ))}
      <span className="ms-2 text-muted">({rating}/5)</span>
    </div>
  );
};