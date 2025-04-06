function SpotifyWidget({ songId }: { songId: string }) {
  return (
    <div className="relative">
      <iframe // this iframe is used just for the background color using blur
        className="absolute translate-y-full overflow-hidden blur-3xl -z-10 scale-y-[3] saturate-50 opacity-30"
        src={`https://open.spotify.com/embed/track/${songId.replace("spotify:track:", "")}?utm_source=generator`}
        width="100%"
        height="160"
        frameBorder="0"
        allowFullScreen={false}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      ></iframe>
      <iframe // this is the actual iframe that will show up
        className="rounded-xl"
        src={`https://open.spotify.com/embed/track/${songId.replace("spotify:track:", "")}?utm_source=generator`}
        width="100%"
        height="160"
        frameBorder="0"
        allowFullScreen={false}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      ></iframe>
    </div>
  );
}

export default SpotifyWidget;
