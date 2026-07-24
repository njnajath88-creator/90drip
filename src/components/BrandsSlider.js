export default function BrandsSlider() {
  const brands = [
    {
      src: "https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg",
      alt: "Real Madrid",
    },
    {
      src: "https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg",
      alt: "Barcelona",
    },
    {
      src: "https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg",
      alt: "Manchester United",
    },
    {
      src: "https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg",
      alt: "Bayern Munich",
    },
    {
      src: "https://upload.wikimedia.org/wikipedia/commons/e/ed/Juventus_FC_-_logo_black_(Italy%2C_2020).svg",
      alt: "Juventus",
    },
    {
      src: "https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_F.C..svg",
      alt: "PSG",
    },
    {
      src: "https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg",
      alt: "Arsenal",
    },
    {
      src: "https://upload.wikimedia.org/wikipedia/commons/d/d0/Logo_of_AC_Milan.svg",
      alt: "AC Milan",
    },
  ];

  return (
    <div className="brands-slider">
      <div className="brands-track">
        {[...Array(2)].map((_, i) => (
          <div key={i} style={{ display: "contents" }}>
            {brands.map((brand) => (
              <img
                key={brand.alt}
                src={brand.src}
                alt={brand.alt}
                className="brand-logo"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
