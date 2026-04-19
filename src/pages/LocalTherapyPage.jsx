import { useMemo, useState } from "react";
import { localTherapyServices, zipCodeCoordinates } from "../data/appData";

const nearbyRadiusMiles = 50;

function toRadians(value) {
  return (value * Math.PI) / 180;
}

function getDistanceMiles(left, right) {
  const earthRadiusMiles = 3958.8;
  const latitudeDelta = toRadians(right.latitude - left.latitude);
  const longitudeDelta = toRadians(right.longitude - left.longitude);
  const a =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(toRadians(left.latitude)) *
      Math.cos(toRadians(right.latitude)) *
      Math.sin(longitudeDelta / 2) ** 2;

  return earthRadiusMiles * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatDistance(distanceMiles) {
  return `${distanceMiles.toFixed(1)} mi away`;
}

function LocalTherapyPage({ onBackHome, onLogout }) {
  const [zipCode, setZipCode] = useState("");
  const [searchOrigin, setSearchOrigin] = useState(null);
  const [statusMessage, setStatusMessage] = useState(
    "Enter a ZIP code or use your current location to find nearby in-person therapy."
  );
  const [isFindingLocation, setIsFindingLocation] = useState(false);

  const nearbyServices = useMemo(() => {
    if (!searchOrigin) {
      return [];
    }

    return localTherapyServices
      .map((service) => ({
        ...service,
        distanceMiles: getDistanceMiles(searchOrigin, {
          latitude: service.latitude,
          longitude: service.longitude,
        }),
      }))
      .filter((service) => service.distanceMiles <= nearbyRadiusMiles)
      .sort((left, right) => left.distanceMiles - right.distanceMiles);
  }, [searchOrigin]);

  const handleZipSearch = (event) => {
    event.preventDefault();
    const normalizedZipCode = zipCode.trim();

    if (!/^\d{5}$/.test(normalizedZipCode)) {
      setStatusMessage("Please enter a valid 5-digit ZIP code.");
      return;
    }

    const coordinates = zipCodeCoordinates[normalizedZipCode];

    if (!coordinates) {
      setSearchOrigin(null);
      setStatusMessage("That ZIP code is not in the demo lookup yet. Try 60601, 73301, 80202, 90012, or 94103.");
      return;
    }

    setSearchOrigin({
      ...coordinates,
      source: "zip",
    });
    setStatusMessage(`Showing in-person therapy services near ${coordinates.city}.`);
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setStatusMessage("Geolocation is not supported in this browser.");
      return;
    }

    setIsFindingLocation(true);
    setStatusMessage("Finding your current location...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setSearchOrigin({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          city: "your current location",
          source: "geolocation",
        });
        setStatusMessage("Showing in-person therapy services near your current location.");
        setIsFindingLocation(false);
      },
      () => {
        setStatusMessage("We could not access your location. You can still search by ZIP code.");
        setIsFindingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  };

  return (
    <main className="app-shell">
      <section className="therapy-viewport">
        <div className="home-overlay" />
        <section className="therapy-surface">
          <div className="home-topbar">
            <div>
              <p className="eyebrow">Local Therapy</p>
              <h1>Find nearby in-person therapy support.</h1>
            </div>

            <div className="button-row">
              <button type="button" className="secondary-button" onClick={onBackHome}>
                Back home
              </button>
              <button type="button" onClick={onLogout}>
                Log out
              </button>
            </div>
          </div>

          <section className="therapy-layout">
            <article className="therapy-search glass-card">
              <div className="panel-heading">
                <h2>Search nearby services</h2>
                <p>Use a ZIP code or the browser geolocation API to look for in-person therapy options.</p>
              </div>

              <form className="therapy-form" onSubmit={handleZipSearch}>
                <label className="therapy-zip-field">
                  ZIP code
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength="5"
                    value={zipCode}
                    onChange={(event) => setZipCode(event.target.value.replace(/[^\d]/g, ""))}
                    placeholder="Enter 5-digit ZIP code"
                  />
                </label>

                <div className="button-row">
                  <button type="submit">Find nearby care</button>
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={handleUseMyLocation}
                    disabled={isFindingLocation}
                  >
                    {isFindingLocation ? "Locating..." : "Use my location"}
                  </button>
                </div>
              </form>

              <p className="small-note therapy-status">{statusMessage}</p>

              {searchOrigin ? (
                <div className="therapy-origin-card">
                  <span>Search origin</span>
                  <strong>{searchOrigin.city}</strong>
                  <p>{searchOrigin.source === "geolocation" ? "Detected from browser location access." : "Matched from ZIP code lookup."}</p>
                </div>
              ) : null}
            </article>

            <aside className="therapy-results glass-card">
              <div className="panel-heading">
                <h2>Nearby services</h2>
                <p>{nearbyServices.length} in-person option{nearbyServices.length === 1 ? "" : "s"} within {nearbyRadiusMiles} miles.</p>
              </div>

              <div className="therapy-service-list">
                {searchOrigin && nearbyServices.length === 0 ? (
                  <div className="therapy-service-card">
                    <p className="small-note">No nearby services from the demo list were found in that radius yet.</p>
                  </div>
                ) : null}

                {!searchOrigin ? (
                  <div className="therapy-service-card">
                    <p className="small-note">Start with a ZIP code or your current location to load local therapy options.</p>
                  </div>
                ) : null}

                {nearbyServices.map((service) => (
                  <article key={service.id} className="therapy-service-card">
                    <div className="therapy-service-topline">
                      <div>
                        <p className="therapy-distance">{formatDistance(service.distanceMiles)}</p>
                        <h3>{service.name}</h3>
                      </div>
                      <span className="therapy-availability">{service.availability}</span>
                    </div>

                    <p className="therapy-address">{service.address}</p>
                    <p className="therapy-phone">{service.phone}</p>

                    <div className="therapy-specialty-row">
                      {service.specialties.map((specialty) => (
                        <span key={specialty} className="therapy-specialty-pill">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </aside>
          </section>
        </section>
      </section>
    </main>
  );
}

export default LocalTherapyPage;
