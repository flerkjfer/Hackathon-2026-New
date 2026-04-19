import { useEffect, useMemo, useRef, useState } from "react";
import { mindMapsKeyPrefix } from "../data/appData";

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 800;

function getMindMapsKey(email) {
  return `${mindMapsKeyPrefix}:${email.toLowerCase()}`;
}

function loadMindMaps(email) {
  const savedMaps = window.localStorage.getItem(getMindMapsKey(email));
  return savedMaps ? JSON.parse(savedMaps) : [];
}

function saveMindMaps(email, maps) {
  window.localStorage.setItem(getMindMapsKey(email), JSON.stringify(maps));
}

function normalizeTextBoxes(textBoxes = []) {
  return textBoxes.map((box) => ({
    ...box,
    fontSize: box.fontSize ?? 24,
    isEditing: box.isEditing ?? false,
  }));
}

function formatDate(value) {
  return new Date(value).toLocaleString();
}

function MindMapPage({ onBackHome, onLogout, user }) {
  const canvasRef = useRef(null);
  const surfaceRef = useRef(null);
  const isDrawingRef = useRef(false);
  const dragStateRef = useRef(null);

  const [mode, setMode] = useState("draw");
  const [brushSize, setBrushSize] = useState(6);
  const [mindMaps, setMindMaps] = useState([]);
  const [textBoxes, setTextBoxes] = useState([]);
  const [activeMapId, setActiveMapId] = useState(null);
  const [statusMessage, setStatusMessage] = useState("Use the marker, eraser, or add a text box to begin.");

  useEffect(() => {
    setMindMaps(loadMindMaps(user.email));
  }, [user.email]);

  useEffect(() => {
    const handlePointerMove = (event) => {
      const dragState = dragStateRef.current;
      if (!dragState) {
        return;
      }

      const surface = surfaceRef.current;

      setTextBoxes((currentBoxes) =>
        currentBoxes.map((box) =>
          box.id === dragState.id
            ? {
                ...box,
                x: Math.max(
                  0,
                  Math.min(
                    CANVAS_WIDTH - 180,
                    event.clientX - dragState.offsetX + surface.scrollLeft
                  )
                ),
                y: Math.max(
                  0,
                  Math.min(
                    CANVAS_HEIGHT - 90,
                    event.clientY - dragState.offsetY + surface.scrollTop
                  )
                ),
              }
            : box
        )
      );
    };

    const stopDragging = () => {
      dragStateRef.current = null;
    };

    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseup", stopDragging);

    return () => {
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", stopDragging);
    };
  }, []);

  const activeMapTitle = useMemo(() => {
    const existing = mindMaps.find((map) => map.id === activeMapId);
    return existing ? existing.title : "Unsaved mind map";
  }, [activeMapId, mindMaps]);

  const getCanvasCoordinates = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_WIDTH / rect.width;
    const scaleY = CANVAS_HEIGHT / rect.height;

    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY,
    };
  };

  const getContext = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.lineCap = "round";
    context.lineJoin = "round";
    return context;
  };

  const clearCanvas = () => {
    const context = getContext();
    context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  };

  useEffect(() => {
    clearCanvas();
  }, []);

  const startDrawing = (event) => {
    if (mode === "text") {
      const point = getCanvasCoordinates(event);
      const id = crypto.randomUUID();
      setTextBoxes((currentBoxes) => [
        ...currentBoxes,
        {
          id,
          text: "Type here",
          x: Math.max(16, point.x - 80),
          y: Math.max(16, point.y - 28),
          fontSize: 24,
          isEditing: true,
        },
      ]);
      setStatusMessage("Text box added. Type your text, adjust the size, then click Done.");
      return;
    }

    isDrawingRef.current = true;
    const context = getContext();
    const point = getCanvasCoordinates(event);

    context.globalCompositeOperation = mode === "erase" ? "destination-out" : "source-over";
    context.strokeStyle = "#000000";
    context.lineWidth = brushSize;
    context.beginPath();
    context.moveTo(point.x, point.y);
  };

  const draw = (event) => {
    if (!isDrawingRef.current || mode === "text") {
      return;
    }

    const context = getContext();
    const point = getCanvasCoordinates(event);
    context.lineTo(point.x, point.y);
    context.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawingRef.current) {
      return;
    }

    isDrawingRef.current = false;
    const context = getContext();
    context.closePath();
  };

  const handleReset = () => {
    clearCanvas();
    setTextBoxes([]);
    setActiveMapId(null);
    setStatusMessage("Blank page ready.");
  };

  const handleTextChange = (id, text) => {
    setTextBoxes((currentBoxes) =>
      currentBoxes.map((box) => (box.id === id ? { ...box, text } : box))
    );
  };

  const handleTextSizeChange = (id, fontSize) => {
    setTextBoxes((currentBoxes) =>
      currentBoxes.map((box) => (box.id === id ? { ...box, fontSize } : box))
    );
  };

  const handleTextDone = (id) => {
    setTextBoxes((currentBoxes) =>
      currentBoxes.map((box) => (box.id === id ? { ...box, isEditing: false } : box))
    );
    setMode("draw");
    setStatusMessage("Text saved on the page.");
  };

  const handleTextEdit = (id) => {
    setTextBoxes((currentBoxes) =>
      currentBoxes.map((box) => (box.id === id ? { ...box, isEditing: true } : box))
    );
    setStatusMessage("Text box reopened for editing.");
  };

  const handleTextDelete = (id) => {
    setTextBoxes((currentBoxes) => currentBoxes.filter((box) => box.id !== id));
    setStatusMessage("Text box removed.");
  };

  const handleTextDragStart = (event, id) => {
    const box = textBoxes.find((currentBox) => currentBox.id === id);
    const point = getCanvasCoordinates(event);

    if (!box) {
      return;
    }

    dragStateRef.current = {
      id,
      offsetX: point.x - box.x,
      offsetY: point.y - box.y,
    };
  };

  const handleSaveMindMap = () => {
    const canvas = canvasRef.current;
    const now = new Date().toISOString();
    const savedMap = {
      id: activeMapId ?? crypto.randomUUID(),
      title: activeMapId ? activeMapTitle : `Mind Map ${mindMaps.length + 1}`,
      createdAt: activeMapId
        ? mindMaps.find((map) => map.id === activeMapId)?.createdAt ?? now
        : now,
      updatedAt: now,
      canvasDataUrl: canvas.toDataURL("image/png"),
      textBoxes: textBoxes.map((box) => ({
        ...box,
        isEditing: false,
      })),
    };

    const nextMaps = activeMapId
      ? mindMaps.map((map) => (map.id === activeMapId ? savedMap : map))
      : [savedMap, ...mindMaps];

    setMindMaps(nextMaps);
    setActiveMapId(savedMap.id);
    saveMindMaps(user.email, nextMaps);
    setStatusMessage(`${savedMap.title} saved.`);
  };

  const handleLoadMindMap = (map) => {
    clearCanvas();
    const context = getContext();
    const image = new Image();

    image.onload = () => {
      context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      context.drawImage(image, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    };

    image.src = map.canvasDataUrl;
    setTextBoxes(normalizeTextBoxes(map.textBoxes ?? []));
    setActiveMapId(map.id);
    setStatusMessage(`${map.title} loaded.`);
  };

  const handleDeleteMindMap = (id) => {
    const nextMaps = mindMaps.filter((map) => map.id !== id);
    setMindMaps(nextMaps);
    saveMindMaps(user.email, nextMaps);

    if (activeMapId === id) {
      handleReset();
    }

    setStatusMessage("Saved mind map deleted.");
  };

  return (
    <main className="app-shell">
      <section className="mindmap-viewport">
        <div className="home-overlay" />
        <section className="mindmap-surface">
          <div className="home-topbar">
            <div>
              <p className="eyebrow">Mind Maps</p>
              <h1>Draw your thoughts on a blank page.</h1>
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

          <section className="mindmap-layout">
            <article className="mindmap-editor glass-card">
              <div className="mindmap-toolbar">
                <div className="mindmap-tool-group">
                  <button
                    type="button"
                    className={`tool-button ${mode === "draw" ? "tool-button-active" : ""}`}
                    onClick={() => setMode("draw")}
                  >
                    Black marker
                  </button>
                  <button
                    type="button"
                    className={`tool-button ${mode === "erase" ? "tool-button-active" : ""}`}
                    onClick={() => setMode("erase")}
                  >
                    Erase
                  </button>
                  <button
                    type="button"
                    className={`tool-button ${mode === "text" ? "tool-button-active" : ""}`}
                    onClick={() => setMode("text")}
                  >
                    Add text box
                  </button>
                </div>

                <label className="brush-label">
                  Marker size
                  <input
                    type="range"
                    min="2"
                    max="28"
                    value={brushSize}
                    onChange={(event) => setBrushSize(Number(event.target.value))}
                  />
                  <span>{brushSize}px</span>
                </label>

                <div className="mindmap-tool-group">
                  <button type="button" className="secondary-button" onClick={handleReset}>
                    New blank page
                  </button>
                  <button type="button" onClick={handleSaveMindMap}>
                    Save mind map
                  </button>
                </div>
              </div>

              <p className="small-note">{statusMessage}</p>

              <div className="mindmap-canvas-shell glass-card">
                <div
                  ref={surfaceRef}
                  className="mindmap-surface-area"
                >
                  <canvas
                    ref={canvasRef}
                    className="mindmap-canvas"
                    width={CANVAS_WIDTH}
                    height={CANVAS_HEIGHT}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                  />

                  {textBoxes.map((box) => (
                    <div
                      key={box.id}
                      className={`mindmap-textbox ${box.isEditing ? "mindmap-textbox-editing" : "mindmap-textbox-display"}`}
                      style={{ left: `${box.x}px`, top: `${box.y}px` }}
                    >
                      {box.isEditing ? (
                        <>
                          <div className="textbox-actions">
                            <button
                              type="button"
                              className="textbox-handle"
                              onMouseDown={(event) => handleTextDragStart(event, box.id)}
                            >
                              Move
                            </button>
                            <button
                              type="button"
                              className="textbox-done"
                              onClick={() => handleTextDone(box.id)}
                            >
                              Done
                            </button>
                            <button
                              type="button"
                              className="textbox-delete"
                              onClick={() => handleTextDelete(box.id)}
                            >
                              x
                            </button>
                          </div>
                          <label className="textbox-size-label">
                            Text size
                            <input
                              type="range"
                              min="14"
                              max="48"
                              value={box.fontSize}
                              onChange={(event) => handleTextSizeChange(box.id, Number(event.target.value))}
                            />
                            <span>{box.fontSize}px</span>
                          </label>
                          <textarea
                            value={box.text}
                            onChange={(event) => handleTextChange(box.id, event.target.value)}
                            style={{ fontSize: `${box.fontSize}px` }}
                          />
                        </>
                      ) : (
                        <button
                          type="button"
                          className="mindmap-text-display"
                          style={{ fontSize: `${box.fontSize}px` }}
                          onDoubleClick={() => handleTextEdit(box.id)}
                          onMouseDown={(event) => handleTextDragStart(event, box.id)}
                          title="Double click to edit"
                        >
                          {box.text}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </article>

            <aside className="mindmap-library glass-card">
              <div className="panel-heading">
                <h2>My mind maps</h2>
                <p>Saved drawings for {user.name}.</p>
              </div>

              <div className="mindmap-list">
                {mindMaps.length === 0 ? (
                  <div className="saved-map-card">
                    <p className="small-note">No saved mind maps yet. Draw something, then hit save.</p>
                  </div>
                ) : (
                  mindMaps.map((map) => (
                    <div key={map.id} className="saved-map-card">
                      <img src={map.canvasDataUrl} alt={map.title} className="saved-map-preview" />
                      <h3>{map.title}</h3>
                      <p className="small-note">Updated {formatDate(map.updatedAt)}</p>
                      <div className="button-row">
                        <button type="button" className="secondary-button" onClick={() => handleLoadMindMap(map)}>
                          Open
                        </button>
                        <button type="button" className="danger-button" onClick={() => handleDeleteMindMap(map.id)}>
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </aside>
          </section>
        </section>
      </section>
    </main>
  );
}

export default MindMapPage;
