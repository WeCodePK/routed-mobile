import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Tooltip,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import axios from "axios";

function RouteInfo({
  viewRouteModalOpen,
  singleRouteData,
  setViewRouteModalOpen,
  startJourney,
  setStartJourney,
}) {
  const [points, setPoints] = useState([]);
  const [routePath, setRoutePath] = useState([]);
  const [totalDistance, setTotalDistance] = useState("");
  const [followUser, setFollowUser] = useState(true);

  // Icons
  const currentLocationIcon = L.divIcon({
    className: "custom-div-icon",
    html: `<div style="color: green; font-size: 24px;"><i class="fas fa-location-arrow"></i></div>`,
    iconSize: [30, 42],
    iconAnchor: [15, 42],
  });
  const customIcon = L.divIcon({
    className: "custom-div-icon",
    html: `<div style="color: red; font-size: 24px;"><i class="fas fa-map-marker-alt"></i></div>`,
    iconSize: [30, 42],
    iconAnchor: [15, 42],
  });

  function ClickHandler({ addPoint }) {
    useMapEvents({
      click(e) {
        addPoint(e.latlng);
      },
    });
    return null;
  }

  const center =
    points.length > 0
      ? points[Math.floor(points.length / 2)].coords
      : [33.6844, 73.0479];

  // Watch user location during journey
  useEffect(() => {
    if (!viewRouteModalOpen && !startJourney) return;

    if (startJourney) {
      if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
      }

      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;

          const updatedPoints = [
            { name: "Your Location", coords: [userLat, userLng] },
            ...(singleRouteData.points || []),
          ];
          setPoints(updatedPoints);
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert("Unable to fetch location: " + error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [viewRouteModalOpen, startJourney, singleRouteData]);

  // Fetch route path
  useEffect(() => {
    if ((!viewRouteModalOpen && !startJourney) || points.length < 2) return;

    const coords = points.map((p) => `${p.coords[1]},${p.coords[0]}`).join(";");
    const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`;

    axios
      .get(url)
      .then((res) => {
        const geo = res.data.routes[0].geometry.coordinates;
        const formatted = geo.map(([lng, lat]) => [lat, lng]);
        setRoutePath(formatted);

        const distanceInMeter = res.data.routes[0].distance;
        const distanceInKm = (distanceInMeter / 1000).toFixed(2);
        setTotalDistance(distanceInKm);
      })
      .catch((err) => console.error("OSRM error:", err));
  }, [viewRouteModalOpen, startJourney, points]);

  // Reset when opened
  useEffect(() => {
    if (viewRouteModalOpen || startJourney) {
      setPoints(singleRouteData.points || []);
      setTotalDistance(singleRouteData.totalDistance || "0 km");
      setRoutePath([]);
    }
  }, [viewRouteModalOpen, startJourney]);

  function MapUpdater({ center, followUser }) {
    const map = useMap();

    useEffect(() => {
      if (center && followUser) {
        map.setView(center, 13);
      }
    }, [center, followUser]);

    return null;
  }
  function MapEventHandler({ setFollowUser }) {
    useMapEvents({
      dragstart: () => setFollowUser(false),
    });
    return null;
  }

  const modalClosed = () => {
    setStartJourney(false);
    setViewRouteModalOpen(false);
  };

  // === Full Page Journey View ===
  if (startJourney) {
    return (
      <div className="vh-100 d-flex flex-column">
        {/* Header with Back Button */}
        <div
          className="d-flex align-items-center justify-content-between p-3 shadow-sm"
          style={{ backgroundColor: "#034078", color: "#fefcfb" }}
        >
          <button
            className="btn btn-light btn-sm"
            onClick={() => setStartJourney(false)}
          >
            <i className="fa-solid fa-arrow-left me-2"></i> Back
          </button>
          <h5 className="mb-0 fw-bold">Journey in Progress</h5>
          <div></div>
        </div>

        {/* Map Fullscreen */}
        <div style={{ flex: 1 }}>
          <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ClickHandler addPoint={() => {}} />
            <MapUpdater center={center} followUser={followUser} />
            <MapEventHandler setFollowUser={setFollowUser} />

            {routePath.length > 0 && (
              <Polyline positions={routePath} color="blue" />
            )}

            {points.map((point, index) => (
              <Marker
                key={point.name + index}
                position={point.coords}
                icon={
                  startJourney && index === 0
                    ? currentLocationIcon
                    : customIcon
                }
              >
                <Tooltip permanent>
                  {startJourney && index === 0
                    ? "Current Location"
                    : point.name}
                </Tooltip>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Footer */}
        <div
          className="p-3 text-center"
          style={{ backgroundColor: "#001f54", color: "#fefcfb" }}
        >
          <button
            className="btn btn-light fw-semibold"
            onClick={() => setFollowUser(true)}
          >
            Recenter on Me
          </button>
        </div>
      </div>
    );
  }

  // === Modal View (Default) ===
  return (
    <div>
      <div
        className="modal show d-block"
        tabIndex="-1"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">View Route</h5>
              <button
                type="button"
                className="btn-close"
                onClick={modalClosed}
              ></button>
            </div>
            <div className="modal-body">
              {/* Route Info */}
              <h3 className="text-center fw-bold">
                <i className="fa-solid fa-route me-2"></i>Route Details
              </h3>
              <div className="row mt-4">
                <div className="col-md-3">
                  <p>
                    <b>Route Name:</b> {singleRouteData.name}
                  </p>
                </div>
                <div className="col-md-3">
                  <p>
                    <b>Description:</b> {singleRouteData.description}
                  </p>
                </div>
                <div className="col-md-3">
                  <p>
                    <b>Total Distance:</b>{" "}
                    {totalDistance || singleRouteData.totalDistance} km
                  </p>
                </div>
                <div className="col-md-3">
                  <p>
                    <b>Created On:</b>{" "}
                    {new Date(singleRouteData.createdAt).toLocaleDateString("en-GB")}
                  </p>
                </div>
              </div>

              <div style={{ height: "400px" }} className="mt-3">
                <MapContainer
                  center={center}
                  zoom={13}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <ClickHandler addPoint={() => {}} />
                  <MapUpdater center={center} followUser={followUser} />
                  <MapEventHandler setFollowUser={setFollowUser} />

                  {routePath.length > 0 && (
                    <Polyline positions={routePath} color="blue" />
                  )}

                  {points.map((point, index) => (
                    <Marker
                      key={point.name + index}
                      position={point.coords}
                      icon={customIcon}
                    >
                      <Tooltip permanent>{point.name}</Tooltip>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={modalClosed}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RouteInfo;
