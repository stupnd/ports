// TO ADD YOUR PHOTOS:
// 1. Drop image files into /public/photos/
// 2. Pass the path as the src prop: src="/photos/filename.jpg"
// 3. Recommended: digicam exports at original resolution, JPG
// 4. Aspect ratio 3:4 works best (portrait orientation)

export default function Polaroid({
  src,
  caption,
  rotation = 0,
  alt,
  width,
  aspectRatio = '3 / 4',
  captionColor = '#555550',
  className = '',
  style,
  ...rest
}) {
  const photoStyle = {
    aspectRatio: aspectRatio === 'auto' ? undefined : aspectRatio,
    borderRadius: '2px',
  }

  return (
    <figure
      {...rest}
      className={`bg-white ${className}`}
      style={{
        padding: '10px 10px 36px 10px',
        borderRadius: '4px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
        transform: `rotate(${rotation}deg)`,
        width,
        ...style,
      }}
    >
      {src ? (
        <img
          src={src}
          alt={alt || caption || ''}
          className="block w-full object-cover"
          style={photoStyle}
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div
          role="img"
          aria-label={alt || caption || 'photo placeholder'}
          className="w-full"
          style={{ ...photoStyle, backgroundColor: '#D9D4C7' }}
        />
      )}
      {caption && (
        <figcaption
          className="f-hand mt-2 text-center"
          style={{ fontSize: '18px', color: captionColor, lineHeight: 1.1 }}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
