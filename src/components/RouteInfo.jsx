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
}) {
  const [points, setPoints] = useState([]);
  const [routePath, setRoutePath] = useState([]);
  const [totalDistance, setTotalDistance] = useState("");

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
  const customIcon = L.divIcon({
    className: "custom-div-icon",
    html: `<div style="color: red; font-size: 24px;"><i class="fas fa-map-marker-alt"></i></div>`,
    iconSize: [30, 42],
    iconAnchor: [15, 42],
  });
  useEffect(() => {
    if (!viewRouteModalOpen || points.length < 2) return;

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
  }, [viewRouteModalOpen, points]);

  useEffect(() => {
    if (viewRouteModalOpen) {
      setPoints(singleRouteData.points || []);
      setTotalDistance(singleRouteData.totalDistance || "0 km");
      setRoutePath([]);
    }
  }, [viewRouteModalOpen]);

  function MapUpdater({ center }) {
    const map = useMap();
    useEffect(() => {
      if (center) {
        map.setView(center, 13);
      }
    }, [center]);
    return null;
  }
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
                onClick={() => setViewRouteModalOpen(false)}
              ></button>
            </div>
            <div className="modal-body">
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
                    <b>Route Description:</b> {singleRouteData.description}
                  </p>
                </div>
                <div className="col-md-3">
                  <p>
                    <b>Route Total Distance:</b>{" "}
                    {totalDistance || singleRouteData.totalDistance} km
                  </p>
                </div>
                <div className="col-md-3">
                  <p>
                    <b>Route Creation:</b>{" "}
                    {new Date(singleRouteData.createdAt).toLocaleDateString(
                      "en-GB"
                    )}
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
                  <MapUpdater center={center} />

                  {routePath.length > 0 && (
                    <Polyline positions={routePath} color="blue" />
                  )}
                  {points.map((point) => (
                    <Marker
                      key={point.name}
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
              <button
                className="btn btn-secondary"
                onClick={() => setViewRouteModalOpen(false)}
              >
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
